# 任务完成检查清单

## 提交代码前必须执行

### 1. 代码质量检查
```bash
npm run lint       # 确保 ESLint 无错误
npm run test       # 确保所有测试通过
npm run build      # 确保构建成功
```

### 2. 类型检查
- TypeScript 编译无错误
- 无 `any` 类型滥用（除非有意为之）
- 类型定义准确，使用类型守卫进行运行时校验

### 3. 代码审查点
- [ ] 遵循项目代码风格规范
- [ ] 注释清晰（使用中文）
- [ ] 无 console.log 调试代码残留
- [ ] 无注释掉的代码块
- [ ] 新增功能有对应测试（如适用）

### 4. 特定检查项

#### 修改判词库规则时（lib/prompts.ts, lib/verdict-rules.ts）
- [ ] 禁用词黑名单已更新
- [ ] 诊断标签在白名单中
- [ ] 判词符合断言模板
- [ ] 字数限制符合要求
- [ ] 运行 `npm test` 确保验证逻辑正常

#### 修改 AI Prompt 时（lib/prompts.ts）
- [ ] System Prompt 结构完整
- [ ] JSON 输出格式正确
- [ ] 降级策略已定义
- [ ] 禁用词检查已启用

#### 添加新组件时
- [ ] 使用 `'use client'` 指令（如需要）
- [ ] Props 类型已定义
- [ ] 遵循现有组件结构
- [ ] Tailwind 类名规范

#### 修改状态机时（app/hooks/useStepMachine.ts）
- [ ] 状态转换逻辑正确
- [ ] 表单校验已更新
- [ ] localStorage 持久化正常
- [ ] 所有组件状态处理正确

### 5. 测试覆盖
```bash
npm run test:coverage  # 查看覆盖率
```
- 新增核心逻辑有测试覆盖
- 边界情况已处理
