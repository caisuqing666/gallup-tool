'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import ScenarioPage from './components/ScenarioPage';
import StrengthsPage from './components/StrengthsPage';
import InputPage from './components/InputPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import { useStepMachine } from './hooks/useStepMachine';
import { GallupResult } from '@/lib/types';
import { generateMockResult } from '@/lib/mock-data';
import { addHistory } from '@/lib/history';

export default function Home() {
  const { state, actions } = useStepMachine();
  const [mounted, setMounted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 确保 hydration 匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 取消生成
  const handleCancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    actions.back();
  }, [actions]);

  // 提交表单，生成方案
  useEffect(() => {
    if (state.step === 'loading' && !state.resultData) {
      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();
      
      const generateResult = async () => {
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              scenario: state.formData.scenario,
              strengths: state.formData.strengths,
              confusion: state.formData.confusion,
            }),
            signal: abortControllerRef.current?.signal,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '生成方案失败' }));
            throw new Error(errorData.error || '生成方案失败');
          }

          const responseJson = await response.json();
          actions.submitSuccess(responseJson.data, false);
        } catch (error) {
          console.error('Error generating result:', error);
          // 使用 mock 数据作为降级方案
          const mockData = generateMockResult(
            state.formData.scenario || '',
            state.formData.strengths,
            state.formData.confusion
          );
          actions.submitSuccess(mockData, true);
        }
      };

      generateResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  const handleSave = (savedData: GallupResult) => {
    console.log('用户保存了方案:', {
      scenario: state.formData.scenario,
      strengthsCount: state.formData.strengths.length,
      timestamp: new Date().toISOString(),
    });

    // 添加到历史记录
    addHistory({
      scenario: state.formData.scenario || 'work-decision',
      strengths: state.formData.strengths,
      confusion: state.formData.confusion,
      result: savedData,
    });
  };

  // hydration 前显示占位符
  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 渲染当前步骤（使用状态机统一管理）
  switch (state.step) {
    case 'landing':
      return <LandingPage onStart={actions.start} />;

    case 'scenario':
      return (
        <ScenarioPage
          selectedScenario={state.formData.scenario}
          onSelectScenario={actions.selectScenario}
          onNext={actions.nextToStrengths}
          onBack={actions.back}
        />
      );

    case 'strengths':
      return (
        <StrengthsPage
          selectedStrengths={state.formData.strengths}
          onSelectStrength={actions.selectStrength}
          onMoveUp={actions.moveStrengthUp}
          onMoveDown={actions.moveStrengthDown}
          onNext={actions.nextToInput}
          onBack={actions.back}
        />
      );

    case 'input':
      return (
        <InputPage
          selectedStrengths={state.formData.strengths}
          confusion={state.formData.confusion}
          onConfusionChange={actions.updateConfusion}
          onSubmit={actions.submit}
          onBack={actions.back}
        />
      );

    case 'loading':
      return (
        <LoadingPage
          selectedStrengths={state.formData.strengths}
          confusion={state.formData.confusion}
          onCancel={handleCancelGeneration}
        />
      );

    case 'result':
      return state.resultData ? (
        <ResultPage
          explainData={state.resultData.explain}
          decideData={state.resultData.decide}
          onSave={handleSave}
          onRegenerate={actions.regenerate}
          onBack={actions.back}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );

    default:
      return <LandingPage onStart={actions.start} />;
  }
}
