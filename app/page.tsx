'use client';

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ScenarioPage from './components/ScenarioPage';
import StrengthsPage from './components/StrengthsPage';
import InputPage from './components/InputPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import { ResultData, FormData } from '@/lib/types';

type Step = 'landing' | 'scenario' | 'strengths' | 'input' | 'loading' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [formData, setFormData] = useState<FormData>({
    strengths: [],
    confusion: '',
  });
  const [resultData, setResultData] = useState<ResultData | null>(null);

  // Step 0: 启动页
  const handleStart = () => {
    setStep('scenario');
  };

  // Step 1: 选场景
  const handleScenarioSelect = (scenarioId: string) => {
    setFormData((prev) => ({ ...prev, scenario: scenarioId }));
  };

  const handleScenarioNext = () => {
    if (formData.scenario) {
      setStep('strengths');
    }
  };

  // Step 1.5: 亮优势
  const handleStrengthSelect = (strengthId: string) => {
    setFormData((prev) => {
      const currentStrengths = prev.strengths;
      if (currentStrengths.includes(strengthId)) {
        // 取消选择
        return { ...prev, strengths: currentStrengths.filter((id) => id !== strengthId) };
      } else if (currentStrengths.length < 5) {
        // 添加选择
        return { ...prev, strengths: [...currentStrengths, strengthId] };
      }
      return prev;
    });
  };

  const handleStrengthsNext = () => {
    if (formData.strengths.length >= 3 && formData.strengths.length <= 5) {
      setStep('input');
    }
  };

  // Step 2: 说困惑
  const handleConfusionChange = (confusion: string) => {
    setFormData((prev) => ({ ...prev, confusion }));
  };

  const handleSubmit = async () => {
    if (!formData.confusion.trim()) return;

    setStep('loading');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: formData.scenario,
          strengths: formData.strengths,
          confusion: formData.confusion,
        }),
      });

      if (!response.ok) {
        throw new Error('生成方案失败');
      }

      const data: ResultData = await response.json();
      setResultData(data);
      setStep('result');
    } catch (error) {
      console.error('Error generating result:', error);
      // 使用 Mock 数据作为后备
      const { generateMockResult } = await import('@/lib/mock-data');
      const mockData = generateMockResult(
        formData.scenario || '',
        formData.strengths,
        formData.confusion
      );
      setResultData(mockData);
      setStep('result');
    }
  };

  // Step 3: 拿方案
  const handleSave = () => {
    // TODO: 实现保存功能
    console.log('保存方案:', resultData);
    alert('保存功能开发中');
  };

  const handleRegenerate = () => {
    setResultData(null);
    setStep('input');
  };

  // 渲染当前步骤
  switch (step) {
    case 'landing':
      return <LandingPage onStart={handleStart} />;
    
    case 'scenario':
      return (
        <ScenarioPage
          selectedScenario={formData.scenario}
          onSelectScenario={handleScenarioSelect}
          onNext={handleScenarioNext}
        />
      );
    
    case 'strengths':
      return (
        <StrengthsPage
          selectedStrengths={formData.strengths}
          onSelectStrength={handleStrengthSelect}
          onNext={handleStrengthsNext}
        />
      );
    
    case 'input':
      return (
        <InputPage
          selectedStrengths={formData.strengths}
          confusion={formData.confusion}
          onConfusionChange={handleConfusionChange}
          onSubmit={handleSubmit}
        />
      );
    
    case 'loading':
      return (
        <LoadingPage
          selectedStrengths={formData.strengths}
          confusion={formData.confusion}
        />
      );
    
    case 'result':
      return resultData ? (
        <ResultPage
          data={resultData}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );
    
    default:
      return <LandingPage onStart={handleStart} />;
  }
}
