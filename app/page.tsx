'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import ScenarioPage from './components/ScenarioPage';
import StrengthsPage from './components/StrengthsPage';
import InputPage from './components/InputPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import GuideResultPage from './components/GuideResultPage';
import CareerResultPage from './components/CareerResultPage';
import OcrUploadPlaceholder from './components/OcrUploadPlaceholder';
import ReportResultPlaceholder from './components/ReportResultPlaceholder';
import { useStepMachine } from './hooks/useStepMachine';
import { GallupResult, StrengthGuideResult, CareerMatchResult, ReportInterpretResult } from '@/lib/types';
import { generateMockResult } from '@/lib/mock-data';
import { generateMockGuideResult } from '@/lib/strength-guide';
import { generateMockCareerResult } from '@/lib/mock-career';
import { generateMockReportResult } from '@/lib/mock-report';
import { addHistory } from '@/lib/history';
import { PATH_FLOWS } from '@/lib/path-config';

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
    if (state.step === 'loading' && !state.resultData && !state.guideData) {
      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      const generateResult = async () => {
        try {
          // 根据路径选择不同的 API
          if (state.path === 'career-match') {
            // 职业匹配路径
            const response = await fetch('/api/career', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                strengths: state.formData.strengths,
              }),
              signal: abortControllerRef.current?.signal,
            });

            if (!response.ok) {
              throw new Error('生成职业匹配失败');
            }

            const responseJson = await response.json();
            actions.careerSuccess(responseJson.data, false);
          } else if (state.path === 'strength-guide') {
            // 优势指南路径
            const response = await fetch('/api/guide', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                strengths: state.formData.strengths,
              }),
              signal: abortControllerRef.current?.signal,
            });

            if (!response.ok) {
              throw new Error('生成优势指南失败');
            }

            const responseJson = await response.json();
            actions.guideSuccess(responseJson.data, false);
          } else if (state.path === 'breakthrough') {
            // 突破方案路径（现有功能）
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
          } else {
            // 其他路径暂时使用 mock
            throw new Error('该功能即将推出');
          }
        } catch (error) {
          console.error('Error generating result:', error);

          // 根据路径使用不同的 mock 数据
          if (state.path === 'career-match') {
            const mockData = generateMockCareerResult(state.formData.strengths);
            actions.careerSuccess(mockData, true);
          } else if (state.path === 'strength-guide') {
            const mockData = generateMockGuideResult(state.formData.strengths);
            actions.guideSuccess(mockData, true);
          } else {
            const mockData = generateMockResult(
              state.formData.scenario || '',
              state.formData.strengths,
              state.formData.confusion
            );
            actions.submitSuccess(mockData, true);
          }
        }
      };

      generateResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.path]);

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
      return <LandingPage onSelectPath={actions.selectPath} />;

    case 'scenario':
      return (
        <ScenarioPage
          selectedScenario={state.formData.scenario}
          onSelectScenario={actions.selectScenario}
          onNext={actions.nextToStrengths}
          onBack={actions.back}
        />
      );

    case 'strengths': {
      // 根据路径决定下一步的处理
      const handleNext = () => {
        if (state.path === 'breakthrough') {
          // 突破方案需要输入困惑
          actions.nextToInput();
        } else {
          // 其他路径直接生成
          actions.nextToLoading();
        }
      };

      return (
        <StrengthsPage
          selectedStrengths={state.formData.strengths}
          onSelectStrength={actions.selectStrength}
          onMoveUp={actions.moveStrengthUp}
          onMoveDown={actions.moveStrengthDown}
          onNext={handleNext}
          onBack={actions.back}
        />
      );
    }

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

    case 'guide-result':
      return state.guideData ? (
        <GuideResultPage
          guideData={state.guideData}
          strengths={state.formData.strengths}
          onRegenerate={actions.regenerate}
          onBack={actions.back}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );

    case 'career-result':
      return state.careerData ? (
        <CareerResultPage
          careerData={state.careerData}
          strengths={state.formData.strengths}
          onRegenerate={actions.regenerate}
          onBack={actions.back}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );

    case 'ocr-upload':
      return (
        <OcrUploadPlaceholder
          onNext={(imageData) => {
            // Phase 3 占位：直接使用 Mock 数据
            const mockData = generateMockReportResult(imageData);
            actions.reportSuccess(mockData, true);
          }}
          onBack={actions.back}
        />
      );

    case 'report-result':
      return state.reportData ? (
        <ReportResultPlaceholder
          reportData={state.reportData}
          onBack={actions.back}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );

    default:
      return <LandingPage onSelectPath={actions.selectPath} />;
  }
}
