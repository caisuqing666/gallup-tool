import { useReducer, useEffect, useMemo, useCallback } from 'react';
import { FormData, GallupResult, PathId, StrengthGuideResult, CareerMatchResult } from '@/lib/types';
import { ScenarioId } from '@/lib/scenarios';
import { StrengthId } from '@/lib/gallup-strengths';
import { Step, PATH_FLOWS, getStepAfterStrengths, getPreviousStep } from '@/lib/path-config';

// 重新导出 Step 类型
export type { Step } from '@/lib/path-config';

// 状态机状态
export interface StepState {
  step: Step;
  path: PathId;  // 当前路径
  formData: FormData;
  resultData: GallupResult | null;
  // 路径特定的结果数据
  guideData: StrengthGuideResult | null;      // 优势指南结果
  careerData: CareerMatchResult | null;        // 职业匹配结果（Phase 2）
  reportData: ReportInterpretResult | null;    // 报告解读结果（Phase 3）
  isLoading: boolean;
  error: string | null;
  isMockResult?: boolean; // 标记当前结果是否为 Mock 数据
}

// 状态机动作
export type StepAction =
  | { type: 'START' }
  | { type: 'SELECT_PATH'; payload: PathId }  // 选择路径
  | { type: 'SELECT_SCENARIO'; payload: ScenarioId }
  | { type: 'NEXT_TO_STRENGTHS' }
  | { type: 'SELECT_STRENGTH'; payload: StrengthId }
  | { type: 'DESELECT_STRENGTH'; payload: StrengthId }
  | { type: 'MOVE_STRENGTH_UP'; payload: number } // 上移优势（索引）
  | { type: 'MOVE_STRENGTH_DOWN'; payload: number } // 下移优势（索引）
  | { type: 'NEXT_TO_INPUT' }
  | { type: 'NEXT_TO_LOADING' }  // 直接跳转到 loading（用于不需要 input 的路径）
  | { type: 'UPDATE_CONFUSION'; payload: string }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: GallupResult; isMock?: boolean } // 标记是否为 Mock 数据
  | { type: 'GUIDE_SUCCESS'; payload: StrengthGuideResult; isMock?: boolean }  // 优势指南成功
  | { type: 'CAREER_SUCCESS'; payload: CareerMatchResult; isMock?: boolean }   // 职业匹配成功（Phase 2）
  | { type: 'REPORT_SUCCESS'; payload: ReportInterpretResult; isMock?: boolean } // 报告解读成功（Phase 3）
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'BACK' }
  | { type: 'REGENERATE' }
  | { type: 'RESET' }
  | { type: 'RESTORE_STATE'; payload: Partial<StepState> };

// 初始状态
const initialState: StepState = {
  step: 'landing',
  path: 'breakthrough',  // 默认路径
  formData: {
    strengths: [],
    confusion: '',
  },
  resultData: null,
  guideData: null,
  careerData: null,
  isLoading: false,
  error: null,
};

// 表单校验
const validateForm = (state: StepState, action: StepAction): { valid: boolean; error?: string } => {
  switch (action.type) {
    case 'NEXT_TO_STRENGTHS':
      // 只有 breakthrough 路径需要选择场景
      if (state.path === 'breakthrough' && !state.formData.scenario) {
        return { valid: false, error: '请先选择一个场景' };
      }
      return { valid: true };

    case 'NEXT_TO_INPUT':
      if (state.formData.strengths.length < 3) {
        return { valid: false, error: '请至少选择 3 个优势' };
      }
      if (state.formData.strengths.length > 5) {
        return { valid: false, error: '最多只能选择 5 个优势' };
      }
      return { valid: true };

    case 'NEXT_TO_LOADING':
      // 用于不需要输入困惑的路径（如 strength-guide, career-match）
      if (state.formData.strengths.length < 3) {
        return { valid: false, error: '请至少选择 3 个优势' };
      }
      if (state.formData.strengths.length > 5) {
        return { valid: false, error: '最多只能选择 5 个优势' };
      }
      return { valid: true };

    case 'SUBMIT':
      if (!state.formData.confusion?.trim()) {
        return { valid: false, error: '请输入你的困惑' };
      }
      if (state.formData.strengths.length < 3) {
        return { valid: false, error: '请至少选择 3 个优势' };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
};

// 状态机 reducer
function stepReducer(state: StepState, action: StepAction): StepState {
  // 校验（除了不需要校验的操作）
  const skipValidation = ['BACK', 'REGENERATE', 'RESET', 'RESTORE_STATE', 'SELECT_PATH', 'SELECT_SCENARIO', 'SELECT_STRENGTH', 'DESELECT_STRENGTH', 'MOVE_STRENGTH_UP', 'MOVE_STRENGTH_DOWN', 'UPDATE_CONFUSION', 'SUBMIT_SUCCESS', 'SUBMIT_ERROR', 'GUIDE_SUCCESS', 'CAREER_SUCCESS'];
  if (!skipValidation.includes(action.type)) {
    const validation = validateForm(state, action);
    if (!validation.valid) {
      return { ...state, error: validation.error || null };
    }
  }

  switch (action.type) {
    case 'START':
      // 根据路径决定下一步
      // breakthrough 路径需要选择场景，其他路径直接选优势
      if (state.path === 'breakthrough') {
        return { ...state, step: 'strengths', error: null };
      }
      return { ...state, step: 'strengths', error: null };

    case 'SELECT_PATH':
      // 选择路径后直接进入对应流程
      // 根据路径决定下一步
      // report-interpret 路径直接跳到 ocr-upload
      // 其他路径先选择优势
      const nextStep = action.payload === 'report-interpret' ? 'ocr-upload' : 'strengths';
      return {
        ...state,
        path: action.payload,
        step: nextStep,
        error: null,
      };

    case 'SELECT_SCENARIO':
      return {
        ...state,
        formData: { ...state.formData, scenario: action.payload },
        error: null,
      };

    case 'NEXT_TO_STRENGTHS':
      return { ...state, step: 'strengths', error: null };

    case 'SELECT_STRENGTH': {
      const currentStrengths = state.formData.strengths;
      if (currentStrengths.includes(action.payload)) {
        return state; // 已选择，不处理
      }
      if (currentStrengths.length >= 5) {
        return state; // 已达上限
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          strengths: [...currentStrengths, action.payload],
        },
        error: null,
      };
    }

    case 'DESELECT_STRENGTH':
      return {
        ...state,
        formData: {
          ...state.formData,
          strengths: state.formData.strengths.filter((id) => id !== action.payload),
        },
        error: null,
      };

    case 'MOVE_STRENGTH_UP': {
      const index = action.payload;
      if (index <= 0 || index >= state.formData.strengths.length) {
        return state; // 无法上移
      }
      const newStrengths = [...state.formData.strengths];
      [newStrengths[index - 1], newStrengths[index]] = [newStrengths[index], newStrengths[index - 1]];
      return {
        ...state,
        formData: {
          ...state.formData,
          strengths: newStrengths,
        },
        error: null,
      };
    }

    case 'MOVE_STRENGTH_DOWN': {
      const index = action.payload;
      if (index < 0 || index >= state.formData.strengths.length - 1) {
        return state; // 无法下移
      }
      const newStrengths = [...state.formData.strengths];
      [newStrengths[index], newStrengths[index + 1]] = [newStrengths[index + 1], newStrengths[index]];
      return {
        ...state,
        formData: {
          ...state.formData,
          strengths: newStrengths,
        },
        error: null,
      };
    }

    case 'NEXT_TO_INPUT':
      return { ...state, step: 'input', error: null };

    case 'NEXT_TO_LOADING':
      // 用于不需要输入困惑的路径（如 strength-guide, career-match）
      return { ...state, step: 'loading', isLoading: true, error: null };

    case 'UPDATE_CONFUSION':
      return {
        ...state,
        formData: { ...state.formData, confusion: action.payload },
        error: null,
      };

    case 'SUBMIT':
      return { ...state, step: 'loading', isLoading: true, error: null };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        step: 'result',
        resultData: action.payload,
        isLoading: false,
        error: null,
        isMockResult: action.isMock || false, // 标记是否为 Mock 数据
      };

    case 'GUIDE_SUCCESS':
      return {
        ...state,
        step: 'guide-result',
        guideData: action.payload,
        isLoading: false,
        error: null,
        isMockResult: action.isMock || false,
      };

    case 'CAREER_SUCCESS':
      return {
        ...state,
        step: 'career-result',
        careerData: action.payload,
        isLoading: false,
        error: null,
        isMockResult: action.isMock || false,
      };

    case 'REPORT_SUCCESS':
      return {
        ...state,
        step: 'report-result',
        reportData: action.payload,
        isLoading: false,
        error: null,
        isMockResult: action.isMock || false,
      };

    case 'SUBMIT_ERROR':
      return {
        ...state,
        step: 'input',
        isLoading: false,
        error: action.payload,
      };

    case 'BACK': {
      // 根据当前路径和步骤返回到上一步
      const previousStep = getPreviousStep(state.path, state.step);

      // 如果没有上一步，返回到 landing
      if (!previousStep) {
        return {
          ...state,
          step: 'landing',
          error: null,
        };
      }

      return {
        ...state,
        step: previousStep,
        error: null,
      };
    }

    case 'REGENERATE': {
      // 根据路径决定返回到哪个步骤
      // breakthrough 返回 input，其他路径返回 strengths
      const regenerateStep = state.path === 'breakthrough' ? 'input' : 'strengths';
      return {
        ...state,
        resultData: null,
        guideData: null,
        careerData: null,
        step: regenerateStep,
        error: null,
      };
    }

    case 'RESET':
      return {
        ...initialState,
      };

    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// 持久化键名
const STORAGE_KEY = 'gallup-tool-state';

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 保存状态到 localStorage
const saveState = (state: StepState) => {
  if (!isBrowser) return;
  try {
    const stateToSave = {
      step: state.step,
      formData: state.formData,
      // 不保存 resultData 和 isLoading，每次刷新后需要重新生成
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('保存状态失败:', error);
  }
};

// 从 localStorage 恢复状态
const loadState = (): Partial<StepState> | null => {
  if (!isBrowser) return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('恢复状态失败:', error);
  }
  return null;
};

// 清除保存的状态
export const clearSavedState = () => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除状态失败:', error);
  }
};

// 步骤状态机 Hook
export function useStepMachine() {
  const [state, dispatch] = useReducer(stepReducer, initialState, () => {
    // 初始化时尝试从 localStorage 恢复
    const saved = loadState();
    if (saved) {
      return {
        ...initialState,
        ...saved,
        resultData: null, // 结果数据不持久化，需要重新生成
        isLoading: false,
        error: null,
      };
    }
    return initialState;
  });

  // 状态变化时自动保存到 localStorage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 不保存 loading 和 result 状态
    if (state.step !== 'loading' && state.step !== 'result') {
      saveState(state);
    }
  }, [state.step, state.formData]);

  // 使用 useCallback 确保 actions 引用稳定
  const actions = useMemo(() => ({
    start: () => dispatch({ type: 'START' }),
    selectPath: (pathId: PathId) => dispatch({ type: 'SELECT_PATH', payload: pathId }),
    selectScenario: (scenarioId: ScenarioId) => dispatch({ type: 'SELECT_SCENARIO', payload: scenarioId }),
    nextToStrengths: () => dispatch({ type: 'NEXT_TO_STRENGTHS' }),
    selectStrength: (strengthId: StrengthId) => {
      const isSelected = state.formData.strengths.includes(strengthId);
      if (isSelected) {
        dispatch({ type: 'DESELECT_STRENGTH', payload: strengthId });
      } else {
        dispatch({ type: 'SELECT_STRENGTH', payload: strengthId });
      }
    },
    nextToInput: () => dispatch({ type: 'NEXT_TO_INPUT' }),
    nextToLoading: () => dispatch({ type: 'NEXT_TO_LOADING' }),
    updateConfusion: (confusion: string) => dispatch({ type: 'UPDATE_CONFUSION', payload: confusion }),
    submit: () => dispatch({ type: 'SUBMIT' }),
    submitSuccess: (result: GallupResult, isMock: boolean = false) => dispatch({ type: 'SUBMIT_SUCCESS', payload: result, isMock }),
    guideSuccess: (result: StrengthGuideResult, isMock: boolean = false) => dispatch({ type: 'GUIDE_SUCCESS', payload: result, isMock }),
    careerSuccess: (result: CareerMatchResult, isMock: boolean = false) => dispatch({ type: 'CAREER_SUCCESS', payload: result, isMock }),
    reportSuccess: (result: ReportInterpretResult, isMock: boolean = false) => dispatch({ type: 'REPORT_SUCCESS', payload: result, isMock }),
    moveStrengthUp: (index: number) => dispatch({ type: 'MOVE_STRENGTH_UP', payload: index }),
    moveStrengthDown: (index: number) => dispatch({ type: 'MOVE_STRENGTH_DOWN', payload: index }),
    submitError: (error: string) => dispatch({ type: 'SUBMIT_ERROR', payload: error }),
    back: () => dispatch({ type: 'BACK' }),
    regenerate: () => dispatch({ type: 'REGENERATE' }),
    reset: () => {
      clearSavedState();
      dispatch({ type: 'RESET' });
    },
  }), [state.formData.strengths]); // 只有 strengths 变化时才重新创建

  return {
    state,
    actions,
  };
}
