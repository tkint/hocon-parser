import { parseTokens, TOKENS } from '../lib';

describe('parseTokens', () => {
  describe('OK', () => {
    test('parse one set of tokens', () => {
      const given = ['hello', TOKENS.COLON, 'world'];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens when extra separator', () => {
      const given = [
        'hello', TOKENS.COLON, 'world',
        TOKENS.SEPARATOR,
      ];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens', () => {
      const given = [
        'hello', TOKENS.COLON, 'world',
        TOKENS.SEPARATOR,
        'foo', TOKENS.COLON, 'bar',
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens without separator', () => {
      const given = [
        'hello', TOKENS.COLON, 'world',
        'foo', TOKENS.COLON, 'bar',
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with extra separators', () => {
      const given = [
        'hello', TOKENS.COLON, 'world',
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
        'foo', TOKENS.COLON, 'bar',
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens with leading separators', () => {
      const given = [
        TOKENS.SEPARATOR,
        TOKENS.SEPARATOR,
        'hello', TOKENS.COLON, 'world',
      ];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with override', () => {
      const given = [
        'hello', TOKENS.COLON, 'world',
        TOKENS.SEPARATOR,
        'hello', TOKENS.COLON, 'le monde',
      ];
      const expected = { hello: 'le monde' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when key is TOKENS.COLON', () => {
      const given = [TOKENS.COLON, TOKENS.COLON, 'world'];
      const expected = Error(`Invalid key: ${TOKENS.COLON}`);
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when colon is not TOKENS.COLON', () => {
      const given = ['hello', 'bad_token', 'world'];
      const expected = Error('Expected colon after key `hello`: bad_token');
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when value is TOKENS.COLON', () => {
      const given = ['hello', TOKENS.COLON, TOKENS.COLON];
      const expected = Error(`Invalid value for key \`hello\`: ${TOKENS.COLON}`);
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when value is undefined', () => {
      const given = ['hello', TOKENS.COLON];
      const expected = Error('Expected value after colon for key `hello`: undefined');
      expect(() => parseTokens(given)).toThrow(expected);
    });
  });
});
