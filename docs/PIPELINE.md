# Gallup 报告 AI 流水线

## 架构概览

```
┌─────────────┐
│   原始报告   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  阶段 1: 文本预处理与切片        │
│  - 章节识别                      │
│  - 智能分块 (800词/块)           │
│  - 重叠保护 (100词)              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  阶段 2: Chunk 抽取 (低价模型)   │
│  - 主题识别                      │
│  - 断言提取                      │
│  - 建议收集                      │
│  - 引用归档                      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  阶段 3: 全局诊断归并 (中等模型)  │
│  - 主题排序                      │
│  - 断言合并                      │
│  - 系统诊断                      │
│  - 行动归并                      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  阶段 4: 最终渲染 (高质量模型)    │
│  - 语气控制                      │
│  - 页面结构                      │
│  - 文案生成                      │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────┐
        │ 页面内容  │
        └──────────┘
```

## 各阶段详细说明

### 阶段 1: 文本预处理

**输入:** `RawReport` (string + metadata)

**输出:** `Stage1Output` (Chunk 数组)

**逻辑:**
1. 按段落分割文本
2. 检测章节类型 (executive_summary, domain_analysis, etc.)
3. 智能分块 (max_chunk_size: 800词)
4. 添加重叠保护 (overlap_size: 100词)

### 阶段 2: Chunk 抽取

**输入:** `Chunk`

**输出:** `Stage2Output`

**Prompt 策略:**
- System: 角色定义 + 输出格式约束
- User: 具体内容 + 提取要求

**推荐模型:**
- Anthropic: `claude-3-haiku-20240307`
- OpenAI: `gpt-4o-mini`

### 阶段 3: 全局诊断归并

**输入:** `Stage2Output[]`

**输出:** `Stage3Output`

**Prompt 策略:**
- 合并所有 chunk 的提取结果
- 去重相似内容
- 生成统一诊断

**推荐模型:**
- Anthropic: `claude-3-5-sonnet-20241022`
- OpenAI: `gpt-4o`

### 阶段 4: 最终渲染

**输入:** `Stage3Output` + `RenderTone`

**输出:** `Stage4Output` (页面可直接渲染)

**语气选项:**
- `professional`: 专业、客观
- `conversational`: 对话式、友好
- `direct`: 简洁、行动导向
- `encouraging`: 鼓励、积极

**推荐模型:**
- Anthropic: `claude-3-5-sonnet-20241022`
- OpenAI: `gpt-4o`

## 使用方法

### 1. 基础用法

```typescript
import { executePipeline, createDefaultConfig } from '@/lib/pipeline';

const input = {
  fullText: '你的 Gallup 报告全文...',
  metadata: {
    reportDate: '2024-01-13',
    language: 'zh-CN',
  },
};

const config = {
  ...createDefaultConfig('balanced'),
  stage2: {
    provider: {
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  },
  // ... 配置其他阶段
};

const result = await executePipeline(input, config);
// result.stage4.sections 是页面可直接渲染的内容
```

### 2. 运行示例

```bash
# 使用 Mock 模式（不需要 API Key）
node scripts/example-pipeline.mjs

# 使用真实 API
ANTHROPIC_API_KEY=sk-xxx node scripts/example-pipeline.mjs

# 使用 OpenAI
OPENAI_API_KEY=sk-xxx AI_PROVIDER=openai node scripts/example-pipeline.mjs
```

### 3. API 集成

更新 `app/api/generate/route.ts`:

```typescript
import { executePipeline, createDefaultConfig } from '@/lib/pipeline';

export async function POST(request: Request) {
  const { fullText } = await request.json();
  
  const config = {
    ...createDefaultConfig('balanced'),
    // 从环境变量加载配置
  };
  
  const result = await executePipeline(
    { fullText },
    config,
    (progress) => {
      // 发送进度到客户端
    }
  );
  
  return Response.json(result.stage4);
}
```

## 环境变量配置

```bash
# .env.local
AI_PROVIDER=anthropic  # 或 openai
ANTHROPIC_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
OPENAI_MODEL=gpt-4o
```

## 预设配置

| 预设名 | 描述 | 阶段2 | 阶段3 | 阶段4 |
|--------|------|-------|-------|-------|
| fast | 开发/测试 | mock | mock | mock |
| economy | 经济模式 | gpt-4o-mini | gpt-4o-mini | gpt-4o |
| balanced | 平衡模式 | haiku | sonnet | sonnet |
| premium | 高质量模式 | sonnet | sonnet | gpt-4o |

## 错误处理

流水线内置重试机制：
- 默认最多重试 3 次
- 指数退避延迟 (1s, 2s, 4s)
- 可通过 `retry_config` 配置

```typescript
const config = {
  retry_config: {
    max_retries: 5,
    base_delay_ms: 2000,
  },
};
```

## 成本估算

以 2000 词报告为例:

| 预设 | 阶段2 tokens | 阶段3 tokens | 阶段4 tokens | 总成本 (约) |
|------|-------------|-------------|-------------|------------|
| economy | 5k | 8k | 6k | $0.05 |
| balanced | 4k | 6k | 5k | $0.08 |
| premium | 6k | 6k | 6k | $0.15 |

注: 实际成本取决于模型定价和报告长度。
