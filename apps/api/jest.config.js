/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/__mocks__/uuid.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
