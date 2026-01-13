/**
 * 最小可运行示例
 * 演示如何使用 Gallup 报告流水线
 * 
 * 运行: node scripts/example-pipeline.mjs
 */

import { executePipeline, createDefaultConfig } from '../lib/pipeline/index.ts';

// ========== 示例输入 ==========

const SAMPLE_GALLUP_REPORT = `
# 你的 Gallup 优势报告

## 执行摘要

你的五大优势主题展示了你独特的才能模式。通过理解和发展这些主题，你可以发挥最大潜力。

## 优势主题详情

### 1. 战略思维

你善于看到全局。你能够快速识别模式，预测未来趋势。在复杂情况下，你能找到最有效的路径。

你经常问"如果...会怎样"，这让你能够预见潜在的问题和机会。你的思维方式帮助团队避免陷阱。

### 2. 分析

你喜欢证据和逻辑。你不满足于表面答案，总是想深入了解事物背后的原因。数据对你来说是可靠的指南。

当别人凭直觉做决定时，你需要看到支持性的证据。这让你在风险评估方面表现出色。

### 3. 学习

你热爱学习的过程。无论主题是什么，你都被获取新知识的兴奋感所驱动。对你来说，学习本身就是目的，而非手段。

你可能在很多领域都有广泛的知识，因为你对世界充满好奇。

## 行动建议

**继续做的事情：**
- 定期花时间进行战略规划
- 在做决定前收集和分析数据
- 每月学习一个新的主题

**开始做的事情：**
- 分享你的战略洞察给团队
- 帮助他人用数据做决策
- 建立一个学习小组

**停止做的事情：**
- 过度分析而延迟行动
- 在没有足够信息时感到焦虑
- 忽视他人的直觉判断

## 盲点提醒

你强大的分析能力可能让你陷入"分析瘫痪"。当面对不确定性时，你可能会过度思考，错失行动时机。

你的反直觉洞察：有时候，70%的把握就足够了。完美的分析可能不如及时的行动。

## 调整方向

在战略思维和执行之间找到平衡。你的分析能力是优势，但不要让它成为行动的障碍。
`;

// ========== 配置 ==========

function getConfig() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const hasValidKey = anthropicKey.startsWith('sk-') || openaiKey.startsWith('sk-');
  
  if (!hasValidKey) {
    console.log('⚠️  未检测到有效的 API Key，使用 Mock 模式\n');
    return createDefaultConfig('fast');
  }
  
  const provider = process.env.AI_PROVIDER || 'anthropic';
  
  if (provider === 'anthropic') {
    return {
      ...createDefaultConfig('balanced'),
      stage2: {
        provider: {
          provider: 'anthropic',
          model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
          apiKey,
          timeout: 60000,
        },
        temperature: 0.3,
      },
      stage3: {
        provider: {
          provider: 'anthropic',
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
          apiKey,
          timeout: 90000,
        },
        temperature: 0.5,
      },
      stage4: {
        provider: {
          provider: 'anthropic',
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
          apiKey,
          timeout: 60000,
        },
        temperature: 0.7,
        tone: {
          style: 'professional',
          detail_level: 'balanced',
          language: 'zh-CN',
        },
      },
      retry_config: {
        max_retries: 3,
        base_delay_ms: 1000,
      },
    };
  } else {
    // OpenAI 配置
    return {
      ...createDefaultConfig('economy'),
      stage2: {
        provider: {
          provider: 'openai',
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          apiKey,
          timeout: 60000,
        },
        temperature: 0.3,
      },
      stage3: {
        provider: {
          provider: 'openai',
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          apiKey,
          timeout: 90000,
        },
        temperature: 0.5,
      },
      stage4: {
        provider: {
          provider: 'openai',
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          apiKey,
          timeout: 60000,
        },
        temperature: 0.7,
        tone: {
          style: 'professional',
          detail_level: 'balanced',
          language: 'zh-CN',
        },
      },
      retry_config: {
        max_retries: 3,
        base_delay_ms: 1000,
      },
    };
  }
}

// ========== 运行示例 ==========

async function main() {
  console.log('=== Gallup 报告流水线示例 ===\n');
  
  const config = getConfig();
  
  const input = {
    fullText: SAMPLE_GALLUP_REPORT,
    metadata: {
      reportDate: new Date().toISOString().split('T')[0],
      language: 'zh-CN',
    },
  };
  
  console.log('📥 输入:');
  console.log(`   - 字符数: ${input.fullText.length}`);
  console.log(`   - 段落数: ${input.fullText.split('\n\n').length}\n`);
  
  console.log('⚙️  配置:');
  console.log(`   - 阶段2: ${config.stage2?.provider?.provider}/${config.stage2?.provider?.model}`);
  console.log(`   - 阶段3: ${config.stage3?.provider?.provider}/${config.stage3?.provider?.model}`);
  console.log(`   - 阶段4: ${config.stage4?.provider?.provider}/${config.stage4?.provider?.model}\n`);
  
  console.log('🚀 开始处理...\n');
  
  const startTime = Date.now();
  
  try {
    const result = await executePipeline(input, config, (progress) => {
      const bar = '█'.repeat(Math.floor((progress.current / progress.total) * 20));
      const empty = '░'.repeat(20 - bar.length);
      console.log(
        `[${progress.stage}/4] ${progress.stage_name}: ${bar}${empty} ${progress.current}/${progress.total} - ${progress.message}`
      );
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n✅ 处理完成!\n');
    console.log('📊 结果摘要:');
    console.log(`   - 阶段1: 生成 ${result.stage1.total_chunks} 个片段`);
    console.log(`   - 阶段2: 提取 ${result.stage2.length} 个片段的分析`);
    console.log(`   - 阶段3: 归并 ${result.stage3.top_strengths.length} 个核心优势`);
    console.log(`   - 阶段4: 生成 ${result.stage4.sections.length} 个页面区块`);
    console.log(`   - 总耗时: ${duration}秒\n`);
    
    console.log('⏱️  各阶段耗时:');
    for (const [stage, ms] of Object.entries(result.metadata.stage_durations)) {
      console.log(`   - ${stage}: ${(ms / 1000).toFixed(2)}秒`);
    }
    
    console.log('\n📋 阶段3 诊断示例:');
    console.log(JSON.stringify(result.stage3, null, 2));
    
    console.log('\n📄 阶段4 渲染示例:');
    console.log(JSON.stringify(result.stage4, null, 2));
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    if (error.cause) {
      console.error('   原因:', error.cause.message);
    }
    process.exit(1);
  }
}

main();
