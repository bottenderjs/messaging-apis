module.exports = {
  parser: 'babel-eslint',
  extends: ['yoctol-base', 'prettier'],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  plugins: ['import', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'prettier/prettier': ['error'],
  },
};
