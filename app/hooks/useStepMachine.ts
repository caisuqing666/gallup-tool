import { useReducer, useEffect, useMemo, useCallback } from 'react';
import { FormData, ResultData } from '@/lib/types';
import type { Stage4Output } from '@/lib/pipeline';
import { ScenarioId } from '@/lib/scenarios';
import { StrengthId } from '@/lib/gallup-strengths';

// 步骤类型
export type Step = 'landing' | 'scenario' | 'strengths' | 'input' | 'loading' | 'result';

// 状态机状态
export interface StepState {
  step: Step;
  formData: FormData;
  resultData: ResultData | Stage4Output | null;
  isLoading: boolean;
  error: string | null;
  isMockResult?: boolean; // 标记当前结果是否为 Mock 数据
}

// 状态机动作
export type StepAction =
  | { type: 'START' }
  | { type: 'SELECT_SCENARIO'; payload: ScenarioId }
  | { type: 'NEXT_TO_STRENGTHS' }
  | { type: 'SELECT_STRENGTH'; payload: StrengthId }
  | { type: 'DESELECT_STRENGTH'; payload: StrengthId }
  | { type: 'MOVE_STRENGTH_UP'; payload: number } // 上移优势（索引）
  | { type: 'MOVE_STRENGTH_DOWN'; payload: number } // 下移优势（索引）
  | { type: 'NEXT_TO_INPUT' }
  | { type: 'UPDATE_CONFUSION'; payload: string }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: ResultData | Stage4Output; isMock?: boolean } // 标记是否为 Mock 数据
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'BACK' }
  | { type: 'REGENERATE' }
  | { type: 'RESET' }
  | { type: 'RESTORE_STATE'; payload: Partial<StepState> };

// 初始状态
const initialState: StepState = {
  step: 'landing',
  formData: {
    strengths: [],
    confusion: '',
  },
  resultData: null,
  isLoading: false,
  error: null,
};

// 表单校验
const validateForm = (state: StepState, action: StepAction): { valid: boolean; error?: string } => {
  switch (action.type) {
    case 'NEXT_TO_STRENGTHS':
      if (!state.formData.scenario) {
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
  const skipValidation = ['BACK', 'REGENERATE', 'RESET', 'RESTORE_STATE', 'SELECT_SCENARIO', 'SELECT_STRENGTH', 'DESELECT_STRENGTH', 'MOVE_STRENGTH_UP', 'MOVE_STRENGTH_DOWN', 'UPDATE_CONFUSION', 'SUBMIT_SUCCESS', 'SUBMIT_ERROR'];
  if (!skipValidation.includes(action.type)) {
    const validation = validateForm(state, action);
    if (!validation.valid) {
      return { ...state, error: validation.error || null };
    }
  }

  switch (action.type) {
    case 'START':
      return { ...state, step: 'scenario', error: null };

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

    case 'SUBMIT_ERROR':
      return {
        ...state,
        step: 'input',
        isLoading: false,
        error: action.payload,
      };

    case 'BACK': {
      // 根据当前步骤返回到上一步
      const backMap: Record<Step, Step> = {
        landing: 'landing',
        scenario: 'landing',
        strengths: 'scenario',
        input: 'strengths',
        loading: 'input', // 加载中也可以返回
        result: 'input',
      };
      return {
        ...state,
        step: backMap[state.step] || state.step,
        error: null,
      };
    }

    case 'REGENERATE':
      return {
        ...state,
        resultData: null,
        step: 'input',
        error: null,
      };

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
    updateConfusion: (confusion: string) => dispatch({ type: 'UPDATE_CONFUSION', payload: confusion }),
    submit: () => dispatch({ type: 'SUBMIT' }),
    submitSuccess: (result: ResultData | Stage4Output, isMock: boolean = false) => dispatch({ type: 'SUBMIT_SUCCESS', payload: result, isMock }),
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
