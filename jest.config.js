module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-pdf|@react-pdf|pdf-lib)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
} 