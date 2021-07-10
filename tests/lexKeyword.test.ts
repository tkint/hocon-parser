import { lexKeyword } from '../lib';

describe('lexKeyword', () => {
  describe('OK', () => {
    const keywords = [
      { given: 'true', expected: true },
      { given: 'false', expected: false },
      { given: 'null', expected: null },
    ];

    keywords.forEach((keyword) => {
      test(`return ${keyword.expected} when strictly equals ${keyword.given}`, () => {
        const given = keyword.given;
        const expected = [keyword.expected, ''];
        expect(lexKeyword(given)).toStrictEqual(expected);
      });

      test(`return ${keyword.expected} when ${keyword.given} and comma`, () => {
        const given = `${keyword.given},`;
        const expected = [keyword.expected, ','];
        expect(lexKeyword(given)).toStrictEqual(expected);
      });

      test(`return ${keyword.expected} when ${keyword.given} and new line`, () => {
        const given = `${keyword.given}\n`;
        const expected = [keyword.expected, '\n'];
        expect(lexKeyword(given)).toStrictEqual(expected);
      });
    });
  });

  describe('KO', () => {
    test('undefined when keyword ends with space', () => {
      const given = 'true ';
      const expected = [undefined, given];
      expect(lexKeyword(given)).toStrictEqual(expected);
    });

    test('undefined when keyword contains space', () => {
      const given = 'tr ue';
      const expected = [undefined, given];
      expect(lexKeyword(given)).toStrictEqual(expected);
    });
  });
});
