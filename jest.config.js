module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'report',
  collectCoverageFrom: ['lib/*.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'report',
      },
    ],
  ],
};
