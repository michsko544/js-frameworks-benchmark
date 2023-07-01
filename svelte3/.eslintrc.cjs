/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: { svelte: true },
  extends: [
    'eslint:recommended',
    'plugin:svelte/base',
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.svelte'],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        // Svelte allows to use unused types like $$Props, $$Events inside components
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  include: ['src'],
  ignorePatterns: [
    'dist/',
    'public/build/',
    '**/*.d.ts',
    '.eslintrc.cjs',
    'svelte.config.js',
    'vite.config.ts',
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
  },
};
