/**
 * useStepMachine 单元测试
 */

import { renderHook, act } from '@testing-library/react';
import { useStepMachine } from '@/app/hooks/useStepMachine';
import { ScenarioId } from '@/lib/scenarios';
import { StrengthId } from '@/lib/gallup-strengths';

describe('useStepMachine', () => {
  // 每个测试后清理 localStorage
  beforeEach(() => {
    localStorage.clear();
  });

  test('初始状态应该是 landing', () => {
    const { result } = renderHook(() => useStepMachine());
    expect(result.current.state.step).toBe('landing');
    expect(result.current.state.formData.strengths).toEqual([]);
    expect(result.current.state.formData.confusion).toBe('');
  });

  test('start 动作应该切换到 scenario 步骤', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
    });

    expect(result.current.state.step).toBe('scenario');
  });

  test('selectScenario 应该更新场景', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      result.current.actions.selectScenario('work-decision');
    });

    expect(result.current.state.formData.scenario).toBe('work-decision');
  });

  test('selectStrength 应该添加优势（未达上限）', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.selectStrength('focus' as StrengthId);
      result.current.actions.selectStrength('analytical' as StrengthId);
    });

    expect(result.current.state.formData.strengths).toHaveLength(2);
  });

  test('selectStrength 应该移除优势（已选择）', () => {
    const { result } = renderHook(() => useStepMachine());
    const strengthId = 'focus' as StrengthId;
    
    act(() => {
      result.current.actions.selectStrength(strengthId);
      result.current.actions.selectStrength(strengthId); // 再次点击应该移除
    });

    expect(result.current.state.formData.strengths).toHaveLength(0);
  });

  test('selectStrength 应该限制最多选择 5 个优势', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      ['focus', 'analytical', 'strategic', 'responsibility', 'achiever'].forEach(id => {
        result.current.actions.selectStrength(id as StrengthId);
      });
      // 尝试添加第 6 个
      result.current.actions.selectStrength('communication' as StrengthId);
    });

    expect(result.current.state.formData.strengths).toHaveLength(5);
  });

  test('moveStrengthUp 应该正确移动优势位置', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.selectStrength('focus' as StrengthId);
      result.current.actions.selectStrength('analytical' as StrengthId);
      result.current.actions.moveStrengthUp(1); // 将 analytical 移到前面
    });

    expect(result.current.state.formData.strengths[0]).toBe('analytical');
    expect(result.current.state.formData.strengths[1]).toBe('focus');
  });

  test('moveStrengthDown 应该正确移动优势位置', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.selectStrength('focus' as StrengthId);
      result.current.actions.selectStrength('analytical' as StrengthId);
      result.current.actions.moveStrengthDown(0); // 将 focus 移到后面
    });

    expect(result.current.state.formData.strengths[0]).toBe('analytical');
    expect(result.current.state.strengths[1]).toBe('focus');
  });

  test('updateConfusion 应该更新困惑描述', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.updateConfusion('我不知道该怎么办');
    });

    expect(result.current.state.formData.confusion).toBe('我不知道该怎么办');
  });

  test('submit 应该切换到 loading 步骤', () => {
    const { result } = renderHook(() => useStepMachine());
    
    // 设置必要的数据
    act(() => {
      result.current.actions.selectScenario('work-decision');
      ['focus', 'analytical', 'strategic'].forEach(id => {
        result.current.actions.selectStrength(id as StrengthId);
      });
      result.current.actions.updateConfusion('测试困惑');
      result.current.actions.submit();
    });

    expect(result.current.state.step).toBe('loading');
    expect(result.current.state.isLoading).toBe(true);
  });

  test('submitSuccess 应该切换到 result 步骤', () => {
    const { result } = renderHook(() => useStepMachine());
    const mockResult = {
      highlight: '测试高光',
      judgment: '测试判断',
      blindspot: '测试盲区',
      actions: ['行动1', '行动2', '行动3'],
    };
    
    act(() => {
      result.current.actions.submitSuccess(mockResult as any, false);
    });

    expect(result.current.state.step).toBe('result');
    expect(result.current.state.resultData).toEqual(mockResult);
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.isMockResult).toBe(false);
  });

  test('back 应该正确返回上一步', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start(); // landing -> scenario
    });
    expect(result.current.state.step).toBe('scenario');

    act(() => {
      result.current.actions.back(); // scenario -> landing
    });
    expect(result.current.state.step).toBe('landing');
  });

  test('regenerate 应该重置结果并返回 input 步骤', () => {
    const { result } = renderHook(() => useStepMachine());
    const mockResult = {
      highlight: '测试高光',
      judgment: '测试判断',
      blindspot: '测试盲区',
      actions: ['行动1', '行动2', '行动3'],
    };
    
    act(() => {
      result.current.actions.submitSuccess(mockResult as any, false);
      result.current.actions.regenerate();
    });

    expect(result.current.state.step).toBe('input');
    expect(result.current.state.resultData).toBeNull();
  });

  test('reset 应该重置所有状态', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      result.current.actions.selectScenario('work-decision');
      result.current.actions.selectStrength('focus' as StrengthId);
      result.current.actions.reset();
    });

    expect(result.current.state.step).toBe('landing');
    expect(result.current.state.formData.scenario).toBeUndefined();
    expect(result.current.state.formData.strengths).toEqual([]);
  });

  test('表单验证：nextToStrengths 需要选择场景', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      // 不选择场景，直接尝试下一步
      result.current.actions.nextToStrengths();
    });

    // 应该停留在 scenario 步骤
    expect(result.current.state.step).toBe('scenario');
    expect(result.current.state.error).toBeTruthy();
  });

  test('表单验证：nextToInput 需要至少选择 3 个优势', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      result.current.actions.selectScenario('work-decision');
      // 只选择 2 个优势
      result.current.actions.selectStrength('focus' as StrengthId);
      result.current.actions.selectStrength('analytical' as StrengthId);
      result.current.actions.nextToInput();
    });

    expect(result.current.state.step).toBe('strengths');
    expect(result.current.state.error).toContain('至少选择 3 个优势');
  });

  test('表单验证：nextToInput 最多选择 5 个优势', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      result.current.actions.selectScenario('work-decision');
      // 选择 6 个优势
      ['focus', 'analytical', 'strategic', 'responsibility', 'achiever', 'communication'].forEach(id => {
        result.current.actions.selectStrength(id as StrengthId);
      });
      result.current.actions.nextToInput();
    });

    expect(result.current.state.step).toBe('strengths');
    expect(result.current.state.error).toContain('最多只能选择 5 个优势');
  });

  test('表单验证：submit 需要输入困惑', () => {
    const { result } = renderHook(() => useStepMachine());
    
    act(() => {
      result.current.actions.start();
      result.current.actions.selectScenario('work-decision');
      ['focus', 'analytical', 'strategic'].forEach(id => {
        result.current.actions.selectStrength(id as StrengthId);
      });
      result.current.actions.submit(); // 不输入困惑
    });

    expect(result.current.state.step).toBe('input');
    expect(result.current.state.error).toContain('请输入你的困惑');
  });
});
