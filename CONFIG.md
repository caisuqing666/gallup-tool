# 环境变量配置说明

## 快速开始

1. 复制环境变量模板：
```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的 API Key

3. 启动开发服务器：
```bash
npm run dev
```

---

## 配置选项详解

### AI 服务配置

#### 启用 AI 生成
```bash
# 使用 AI 生成（需要 API Key）
ENABLE_AI=true

# 使用 Mock 数据（默认，无需 API Key）
ENABLE_AI=false
```

#### 选择 AI 提供商

**方式 1: Anthropic Claude（推荐）**
```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

获取 API Key：https://console.anthropic.com/

**方式 2: OpenAI**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

获取 API Key：https://platform.openai.com/api-keys

#### 模型选择

**Claude 模型**
```bash
# 默认（推荐）
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# 更快更便宜
ANTHROPIC_MODEL=claude-3-haiku-20240307

# 最强
ANTHROPIC_MODEL=claude-3-opus-20240229
```

**OpenAI 模型**
```bash
# 默认（推荐）
OPENAI_MODEL=gpt-4o

# 更快更便宜
OPENAI_MODEL=gpt-3.5-turbo
```

---

## 配置验证

运行配置检查：
```bash
npm run check-config
```

查看当前配置：
```bash
npm run config:info
```

---

## 常见问题

### Q: 如何在本地使用 Mock 数据？
A: 设置 `ENABLE_AI=false`（或不设置此变量）

### Q: AI 生成失败怎么办？
A: 系统会自动降级到 Mock 数据，确保功能正常

### Q: 如何切换 AI 提供商？
A: 修改 `AI_PROVIDER` 为 `anthropic` 或 `openai`

### Q: API Key 会泄露吗？
A: `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git

---

## 安全提示

⚠️ **重要**：
- 永远不要将 `.env.local` 文件提交到版本控制
- 永远不要在代码中硬编码 API Key
- 定期轮换 API Key
- 使用生产环境的专用 API Key
