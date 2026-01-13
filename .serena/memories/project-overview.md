# Gallup Tool 项目概览

## 项目目的
这是一个盖洛普优势才干（CliftonStrengths）分析工具，帮助用户识别自己的优势是否被误用（进入"地下室状态"），并提供"顺着优势走"的替代性方案，而不是"补短板"。

核心哲学：
- **不补短板**：绝不建议用户学习新技能或提升弱项
- **地下室状态**：优势被过度使用或误用时，反而成为负担
- **替代性行动**：用现有优势重新定义问题，而不是提升能力

## 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **测试**: Jest + React Testing Library
- **AI 集成**: Claude API / OpenAI API (可选，默认使用 Mock)

## 代码结构
```
gallup-tool/
├── app/
│   ├── page.tsx              # 主入口，状态机驱动流程
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式
│   ├── components/           # 页面组件
│   │   ├── LandingPage.tsx   # 落地页
│   │   ├── ScenarioPage.tsx  # 场景选择页
│   │   ├── StrengthsPage.tsx # 优势选择页
│   │   ├── InputPage.tsx     # 困惑输入页
│   │   ├── LoadingPage.tsx   # 加载页
│   │   ├── ResultPage.tsx    # 结果展示页
│   │   └── ...
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useStepMachine.ts # 状态机 Hook（核心）
│   │   └── useTypewriter.ts  # 打字机效果 Hook
│   └── api/
│       └── generate/
│           └── route.ts      # AI 生成 API 端点
├── lib/
│   ├── types.ts              # 核心类型定义
│   ├── gallup-strengths.ts   # 34 个盖洛普优势定义
│   ├── scenarios.ts          # 4 个使用场景
│   ├── prompts.ts            # AI System Prompt（核心）
│   ├── verdict-rules.ts      # 判词库规则（硬约束）
│   ├── verdict-validator.ts  # 输出验证器
│   ├── ai-generate.ts        # AI 生成服务（统一入口）
│   ├── mock-data.ts          # Mock 数据生成器
│   └── mock-rules.ts         # Mock 规则判断函数
└── __tests__/                # 测试文件
```

## 核心业务逻辑

### 1. 盖洛普优势分类（34 个才干）
- **执行力** (9项): 专注、信仰、公平、审慎、成就、排难、纪律、统筹、责任
- **影响力** (8项): 取悦、完美、沟通、竞争、统率、自信、行动、追求
- **关系建立** (9项): 个别、交往、伯乐、体谅、关联、包容、和谐、积极、适应
- **战略思维** (8项): 分析、前瞻、回顾、学习、思维、战略、搜集、理念

### 2. 状态机流程
```
landing → scenario → strengths → input → loading → result
   ↑                                                    ↓
   ←←←←←←←←←←←←←←← back ←←←←←←←←←←←←←←←←←←←←←←←←←
```

### 3. 判词库规则（硬约束）
- **诊断标签**: 必须从白名单选择（如：决策空转、用力反噬、优势错位等）
- **核心判词**: 必须使用断言模板（如："你不是X，是你一直在Y"）
- **困境还原**: 体验句，每句不超过 22 字，最多 4 句
- **指令出口**: 必须含"不是X，而是Y"结构
- **禁用词黑名单**: 禁止使用羞辱词、医学诊断词、绝对化预言等

### 4. AI 生成 vs Mock
- 默认使用 Mock 数据（稳定演示）
- 设置 `ENABLE_AI=true` 可启用 AI（需配置 API Key）
- AI 失败时自动回退到 Mock
