module.exports = {
  coverageDirectory: 'report',
  collectCoverageFrom: ['lib/*.js'],
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
