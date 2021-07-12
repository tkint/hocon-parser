import { parseTokensAsArray, TOKENS } from '../lib';

describe('parseTokensAsArray', () => {
  describe('OK', () => {
    test('parse one set of tokens', () => {
      const given = [TOKENS.ARRAY_OPEN, 'hello', TOKENS.ARRAY_CLOSE];
      const expected = [['hello'], []];
      expect(parseTokensAsArray(given)).toStrictEqual(expected);
    });

    test('parse empty array', () => {
      const given = [TOKENS.ARRAY_OPEN, TOKENS.ARRAY_CLOSE];
      const expected = [[], []];
      expect(parseTokensAsArray(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when colon token as value', () => {
      const given = [TOKENS.ARRAY_OPEN, TOKENS.COLON, TOKENS.ARRAY_CLOSE];
      const expected = Error(`Invalid array value, got ${TOKENS.COLON}`);
      expect(() => parseTokensAsArray(given)).toThrow(expected);
    });

    test('error when no array opening token', () => {
      const given = ['hello', TOKENS.ARRAY_CLOSE];
      const expected = Error('Expected array opening token, got hello');
      expect(() => parseTokensAsArray(given)).toThrow(expected);
    });

    test('error when no end of array token', () => {
      const given = [TOKENS.ARRAY_OPEN, 'hello'];
      const expected = Error('Expected end of array');
      expect(() => parseTokensAsArray(given)).toThrow(expected);
    });
  });
});
