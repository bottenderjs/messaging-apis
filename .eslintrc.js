module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'yoctol-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  rules: {
    camelcase: 'off',

    'no-useless-constructor': 'off',

    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',

    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'warn',
  },
  overrides: [
    {
      files: ['examples/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['packages/**/*.ts'],
      rules: {
        'tsdoc/syntax': 'warn',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
};
