module.exports = {
  setupFiles: ['./tests/setup/setEnvironment.js'],
  transform: {
    '^.+\\.ts?$': 'babel-jest'
  },
  collectCoverageFrom: ['src/**/*.ts'],
  moduleNameMapper: {
    // Jest needs to know about module aliasing as it doesn't run after webpack magic
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@clients/(.*)$': '<rootDir>/src/clients/$1',
    '^@transformers/(.*)$': '<rootDir>/src/transformers/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@commands/(.*)$': '<rootDir>/src/bot/commands/$1'
  }
};
