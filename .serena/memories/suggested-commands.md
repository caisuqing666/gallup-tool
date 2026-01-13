# 常用命令

## 开发
```bash
npm run dev        # 启动开发服务器 (http://localhost:3000)
npm run build      # 构建生产版本
npm run start      # 启动生产服务器
```

## 代码质量
```bash
npm run lint       # 运行 ESLint 检查
npm run test       # 运行测试
npm run test:watch # 运行测试（监视模式）
npm run test:coverage # 运行测试并生成覆盖率报告
```

## Git 命令（Darwin/macOS）
```bash
git status         # 查看工作区状态
git add .          # 添加所有更改
git commit -m "..." # 提交
git push           # 推送
git pull           # 拉取
git branch         # 查看分支
git checkout -b    # 创建并切换分支
```

## 系统命令（Darwin/macOS）
```bash
ls -la             # 列出文件（包含隐藏文件）
cd /path/to/dir    # 切换目录
pwd                # 显示当前目录
grep -r "pattern" . # 递归搜索文本
find . -name "*.ts" # 查找文件
cat file.txt       # 查看文件
tail -f log.txt    # 实时查看日志
```

## AI 生成配置
启用 AI 生成（需要配置 API Key）：
```bash
# 在 .env.local 中添加：
ANTHROPIC_API_KEY=your_key_here
ENABLE_AI=true
```
或
```bash
OPENAI_API_KEY=your_key_here
ENABLE_AI=true
```
