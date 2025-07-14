module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'modules/**/*.js',
    '!**/*.test.js',
    '!**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
}; 