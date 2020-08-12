module.exports = {
  mode: 'modules',
  out: 'docs',
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/*.spec.ts',
    '**/__tests__/**/*.ts',
  ],
  name: 'messaging-apis',
  excludePrivate: true,
  excludeNotExported: true,
  excludeExternals: true,
  esModuleInterop: true,
  includeVersion: true,
};
