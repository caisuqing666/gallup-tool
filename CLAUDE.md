# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

盖洛普优势分析工具 - 基于 CliftonStrengths 的 AI 驱动决策辅助应用。用户选择场景、优势、描述困惑后，系统生成"解释页"（理解发生了什么）和"判定页"（现在该怎么做）两部分内容。

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器 (localhost:3000)

# 构建和检查
npm run build            # 生产构建
npm run lint             # ESLint 检查

# 测试
npm run test             # 运行 Jest 测试
npm run test:watch       # 监视模式
npm run test -- path/to/test.ts  # 运行单个测试文件

# 工具脚本
npm run check-config     # 检查 AI 配置状态
```

## 核心架构

### 数据流

```
用户输入 (场景 + 优势 + 困惑)
    ↓
API Route (/api/generate)
    ↓
confusion-parser → 解析问题类型(ProblemType) + 问题焦点(problemFocus)
    ↓
Context Pack 构建 (strength-profiles + combo-rules)
    ↓
AI 生成 / Mock 降级
    ↓
GallupResult { explain: ExplainData, decide: DecideData }
```

### 核心类型 (`lib/types.ts`)

- **ProblemType**: P1(方向不确定) / P2(边界过载) / P3(信息瘫痪) / P4(效率瓶颈)
- **PathDecision**: DoubleDown / Reframe / Narrow / Exit - 路径判定的四种结果
- **GallupResult**: `{ explain: ExplainData, decide: DecideData }` - AI 输出的完整结构
- **ExplainData**: 优势行为表现、组合互动、盲区、总结
- **DecideData**: 路径判定、pathLogic、doMore/doLess、责任边界

### 状态管理 (`app/hooks/useStepMachine.ts`)

使用 useReducer 实现的状态机，步骤流程：
```
landing → scenario → strengths → input → loading → result
```
表单数据持久化到 localStorage，结果不持久化。

### AI 生成层 (`lib/ai-generate.ts`)

支持三种 AI Provider：
- Anthropic Claude（推荐）
- OpenAI GPT-4o
- 智谱 GLM4（理解层转译默认使用）

通过 `ENABLE_AI` 环境变量控制启用/禁用，禁用时自动降级到 Mock 数据。

### Prompt 系统 (`lib/prompts.ts`)

- **Context Pack**: 整合困惑分析 + 优势画像 + 组合效应，注入到系统 prompt
- **双重锁定约束**: problemType + problemFocus 约束所有输出
- **Explain Prompt**: 只负责"理解发生了什么"
- **Decide Prompt**: 只负责"现在该怎么做"（路径判定）

### 关键文件

| 文件 | 职责 |
|------|------|
| `lib/confusion-parser.ts` | 解析用户困惑，提取 problemType/problemFocus |
| `lib/strength-profiles.ts` | 34 个优势的能量画像（驱动力/代价区/地下室） |
| `lib/combo-rules.ts` | 优势组合的陷阱/盲区/放大效应 |
| `lib/context-generator.ts` | Mock 降级时的结构化内容生成 |
| `lib/understanding-layer.ts` | 理解层转译（智谱 GLM4） |

## 环境配置

复制 `.env.local.example` 为 `.env.local`：

```bash
ENABLE_AI=true                    # 启用 AI（false 使用 Mock）
AI_PROVIDER=anthropic             # anthropic / openai
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...             # 备用
ZHIPU_API_KEY=...                 # 理解层转译
```

## 代码规范

- 路径别名：`@/*` 映射到项目根目录
- 组件使用 `'use client'` 标记客户端组件
- 类型优先从 `lib/types.ts` 导入
- AI prompt 修改需同步更新 Mock 数据结构
