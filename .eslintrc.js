module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // 允许 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // React hooks 警告降级为 info
    'react-hooks/exhaustive-deps': 'warn',
  },
};
