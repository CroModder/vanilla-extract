module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.rollup.cache/'],
  testTimeout: 10000,
};
