module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/modules/memeImages/', '<rootDir>/modules/cenaImages/'],
  moduleNameMapper: {
    '^discord\\.js$': '<rootDir>/__mocks__/discord.js.js'
  },
};