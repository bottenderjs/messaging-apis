module.exports = {
  out: 'docs',
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/*.spec.ts',
    '**/__tests__/**/*.ts',
  ],
  name: 'messaging-apis',
  excludePrivate: true,
  excludeExternals: true,
  includeVersion: true,
};
