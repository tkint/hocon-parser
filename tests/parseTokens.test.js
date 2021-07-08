const { parseTokens, COLON_TOKEN, SEPARATOR_TOKEN } = require('../lib/main');

describe('parseTokens', () => {
  describe('OK', () => {
    test('parse one set of tokens', () => {
      const given = ['hello', COLON_TOKEN, 'world'];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens when extra separator', () => {
      const given = [
        'hello', COLON_TOKEN, 'world',
        SEPARATOR_TOKEN,
      ];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens', () => {
      const given = [
        'hello', COLON_TOKEN, 'world',
        SEPARATOR_TOKEN,
        'foo', COLON_TOKEN, 'bar',
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens without separator', () => {
      const given = [
        'hello', COLON_TOKEN, 'world',
        'foo', COLON_TOKEN, 'bar',
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with extra separators', () => {
      const given = [
        'hello', COLON_TOKEN, 'world',
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
        'foo', COLON_TOKEN, 'bar',
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
      ];
      const expected = { hello: 'world', foo: 'bar' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens with leading separators', () => {
      const given = [
        SEPARATOR_TOKEN,
        SEPARATOR_TOKEN,
        'hello', COLON_TOKEN, 'world',
      ];
      const expected = { hello: 'world' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with override', () => {
      const given = [
        'hello', COLON_TOKEN, 'world',
        SEPARATOR_TOKEN,
        'hello', COLON_TOKEN, 'le monde',
      ];
      const expected = { hello: 'le monde' };
      expect(parseTokens(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when key is COLON_TOKEN', () => {
      const given = [COLON_TOKEN, COLON_TOKEN, 'world'];
      const expected = Error(`Invalid key: ${COLON_TOKEN}`);
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when colon is not COLON_TOKEN', () => {
      const given = ['hello', 'bad_token', 'world'];
      const expected = Error('Expected colon after key `hello`: bad_token');
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when value is COLON_TOKEN', () => {
      const given = ['hello', COLON_TOKEN, COLON_TOKEN];
      const expected = Error(`Invalid value for key \`hello\`: ${COLON_TOKEN}`);
      expect(() => parseTokens(given)).toThrow(expected);
    });

    test('error when value is undefined', () => {
      const given = ['hello', COLON_TOKEN];
      const expected = Error('Expected value after colon for key `hello`: undefined');
      expect(() => parseTokens(given)).toThrow(expected);
    });
  });
});
