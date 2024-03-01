module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    ...[
      './rules/base',
      './rules/prettier',
      './rules/promise',
      './rules/import',
    ].map(require.resolve),
  ],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        ...['./rules/typescript'].map(require.resolve),
      ],
      settings: {
        /**
         * @description import plugin with Typescript configuration
         * @link https://github.com/alexgorbatchev/eslint-import-resolver-typescript#configuration
         */
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
      },
    },
  ],
};
