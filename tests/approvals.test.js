const path = require('path');
const fs = require('fs');

const { parseHocon } = require('../lib/main');

describe('approvals', () => {
  const approvalsDir = path.join(__dirname, 'approvals');
  fs.readdirSync(approvalsDir).forEach((testName) => {
    test(`test approval ${testName}`, () => {
      const testDir = path.join(approvalsDir, testName);
      const given = fs.readFileSync(path.join(testDir, 'given.conf')).toString();
      const expected = require(path.join(testDir, 'expected.js'));

      const result = parseHocon(given);

      expect(result).toStrictEqual(expected);
    });
  });
});
