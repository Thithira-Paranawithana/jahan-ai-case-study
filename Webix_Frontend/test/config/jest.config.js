module.exports = {
    testEnvironment: 'jsdom',
    rootDir: '../../',
    testMatch: ['**/test/unit/**/*.test.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/test/mocks/styleMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/test/config/jest.setup.js'],
    collectCoverageFrom: [
      'sources/**/*.js',
      '!sources/myapp.js',
      '!sources/styles/**',
    ],
    coverageDirectory: 'test/coverage',
    verbose: true,
  };
  