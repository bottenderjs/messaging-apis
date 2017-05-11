module.exports = {
  parser: 'babel-eslint',
  extends: ['yoctol-base', 'prettier'],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
  },
};
