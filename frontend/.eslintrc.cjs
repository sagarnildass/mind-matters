module.exports = {
  root: true,
  env: {
    browser: true,
    node: true, // Add this to allow Node.js globals like `process`
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': 'off', // Disable the rule completely
    // OR
    // 'no-unused-vars': ['warn', { vars: 'all', args: 'none' }], // Warn only for unused variables, not unused function arguments
  },
};
