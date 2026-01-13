#!/usr/bin/env node

/**
 * 配置检查脚本
 * 用于验证环境变量配置
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 .env.local 文件（如果存在）
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    return {};
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      env[key] = valueParts.join('=').trim();
    }
  }

  return env;
}

/**
 * 验证环境变量配置
 */
function validateConfig() {
  const errors = [];
  const warnings = [];

  // 加载 .env.local 文件
  const env = loadEnvFile();

  // 从环境和文件中读取配置
  const aiEnabled = process.env.ENABLE_AI === 'true' ||
                    process.env.NEXT_PUBLIC_ENABLE_AI === 'true' ||
                    env.ENABLE_AI === 'true' ||
                    env.NEXT_PUBLIC_ENABLE_AI === 'true';

  const aiProvider = process.env.AI_PROVIDER ||
                     env.AI_PROVIDER ||
                     'anthropic';

  const anthropicKey = process.env.ANTHROPIC_API_KEY ||
                       env.ANTHROPIC_API_KEY;

  const openaiKey = process.env.OPENAI_API_KEY ||
                    env.OPENAI_API_KEY;

  if (aiEnabled) {
    // AI 启用时，必须有至少一个 API Key
    if (!anthropicKey && !openaiKey) {
      errors.push(
        'AI 已启用（ENABLE_AI=true），但未配置 API Key。' +
        '请在 .env.local 中设置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY，' +
        '或设置 ENABLE_AI=false 使用 Mock 数据'
      );
    }

    // 检查指定的提供商是否有 API Key
    if (aiProvider === 'anthropic' && !anthropicKey) {
      if (openaiKey) {
        warnings.push(
          '指定了 AI_PROVIDER=anthropic，但未设置 ANTHROPIC_API_KEY。' +
          '将使用 OpenAI 作为备用方案。'
        );
      } else {
        errors.push(
          '指定了 AI_PROVIDER=anthropic，但未设置 ANTHROPIC_API_KEY。' +
          '请在 .env.local 中设置 ANTHROPIC_API_KEY，或切换到 openai 提供商。'
        );
      }
    }

    if (aiProvider === 'openai' && !openaiKey) {
      if (anthropicKey) {
        warnings.push(
          '指定了 AI_PROVIDER=openai，但未设置 OPENAI_API_KEY。' +
          '将使用 Anthropic Claude 作为备用方案。'
        );
      } else {
        errors.push(
          '指定了 AI_PROVIDER=openai，但未设置 OPENAI_API_KEY。' +
          '请在 .env.local 中设置 OPENAI_API_KEY，或切换到 anthropic 提供商。'
        );
      }
    }

    // 检查模型配置
    if (aiProvider === 'anthropic' && anthropicKey) {
      const model = process.env.ANTHROPIC_MODEL || env.ANTHROPIC_MODEL;
      const validModels = [
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'claude-3-haiku-20240307',
      ];
      if (model && !validModels.includes(model)) {
        warnings.push(
          `ANTHROPIC_MODEL="${model}" 不是有效值。` +
          `有效值: ${validModels.join(', ')}。将使用默认模型。`
        );
      }
    }

    if (aiProvider === 'openai' && openaiKey) {
      const model = process.env.OPENAI_MODEL || env.OPENAI_MODEL;
      const validModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
      if (model && !validModels.includes(model)) {
        warnings.push(
          `OPENAI_MODEL="${model}" 不是有效值。` +
          `有效值: ${validModels.join(', ')}。将使用默认模型。`
        );
      }
    }
  }

  // 检查应用 URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
                 env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.startsWith('http')) {
    warnings.push(
      'NEXT_PUBLIC_APP_URL 应该以 http:// 或 https:// 开头'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config: {
      aiEnabled,
      aiProvider: aiEnabled ? aiProvider : undefined,
      hasApiKey: aiEnabled ? !!(anthropicKey || openaiKey) : undefined,
      model: aiProvider === 'anthropic'
        ? (process.env.ANTHROPIC_MODEL || env.ANTHROPIC_MODEL)
        : (process.env.OPENAI_MODEL || env.OPENAI_MODEL),
    },
  };
}

/**
 * 打印配置信息
 */
function printConfigInfo(validation) {
  console.log('\n📋 Gallup Tool 配置信息');
  console.log('='.repeat(40));

  console.log(`✓ AI 生成: ${validation.config.aiEnabled ? '已启用' : '未启用（使用 Mock 数据）'}`);

  if (validation.config.aiEnabled) {
    console.log(`✓ AI 提供商: ${validation.config.aiProvider}`);
    console.log(`✓ API Key: ${validation.config.hasApiKey ? '已配置' : '未配置'}`);
    if (validation.config.model) {
      console.log(`✓ 模型: ${validation.config.model}`);
    }
  }

  if (validation.warnings.length > 0) {
    console.log('\n⚠️  警告:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (validation.errors.length > 0) {
    console.log('\n❌ 配置错误:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('='.repeat(40) + '\n');
}

// 主执行逻辑
console.log('🔍 检查环境变量配置...\n');

const validation = validateConfig();

if (validation.valid) {
  console.log('✅ 配置验证通过\n');
} else {
  console.log('❌ 配置验证失败\n');
  validation.errors.forEach(error => console.error(`  ❌ ${error}\n`));
}

if (validation.warnings.length > 0) {
  console.log('⚠️  以下警告需要注意:\n');
  validation.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}\n`));
}

printConfigInfo(validation);

process.exit(validation.valid ? 0 : 1);
