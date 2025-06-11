module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^\.\./main$': '<rootDir>/main.ts',
  },
};
