module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: './coverage/',
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/*.+(ts|tsx)'],
  timers: 'fake',
  resetMocks: true,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      diagnostics: false,
    },
  },
};
