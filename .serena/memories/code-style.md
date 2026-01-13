# 代码风格和规范

## TypeScript 规范
- 严格模式 (`strict: true`)
- 允许 any 类型 (`@typescript-eslint/no-explicit-any: 'off'`)
- 使用类型推导，优先使用 `const` 断言 (`as const`) 确保类型安全

## 命名规范
- **组件**: PascalCase (如 `LandingPage`, `ResultPage`)
- **函数/变量**: camelCase (如 `generateMockResult`, `strengthBasement`)
- **类型/接口**: PascalCase (如 `ResultData`, `FormData`)
- **常量**: UPPER_SNAKE_CASE (如 `ALL_STRENGTHS`, `CORE_DIAGNOSIS_LABELS`)
- **类型 ID**: 使用类型推导从数据中导出（如 `StrengthId`, `ScenarioId`）

## 代码组织
- **类型定义**: 集中在 `lib/types.ts`，其他文件通过导入/重新导出保持兼容
- **数据与逻辑分离**: 数据定义（如 `gallup-strengths.ts`）与业务逻辑（如 `mock-rules.ts`）分离
- **纯函数优先**: 规则判断函数抽取为纯函数，便于测试
- **类型守卫**: 使用 `isValidXXX()` 函数进行运行时类型校验

## React 规范
- 使用客户端组件 (`'use client'`) 处理交互
- 状态管理使用 `useReducer` 实现状态机
- 使用 `useMemo` 和 `useCallback` 优化性能
- 避免 hydration 不匹配：使用 `mounted` 状态延迟渲染

## 注释规范
- 使用中文注释
- 复杂逻辑添加解释注释
- 禁用 ESLint 规则时添加原因说明

## 文件结构规范
- 每个组件一个文件
- 相关类型定义与组件同文件或就近定义
- 测试文件放在 `__tests__/` 目录，命名格式 `*.test.ts`
