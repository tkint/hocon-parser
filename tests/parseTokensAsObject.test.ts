import { parseTokensAsObject, TOKENS } from '../lib';

describe('parseTokensAsObject', () => {
  describe('OK', () => {
    test('parse one set of tokens', () => {
      const given = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      const expected = [{ hello: 'world' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens when extra separator', () => {
      const given = [
        TOKENS.OBJECT_OPEN,
        'hello', TOKENS.COLON, 'world',
        TOKENS.COMMA,
        TOKENS.OBJECT_CLOSE,
      ];
      const expected = [{ hello: 'world' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens', () => {
      const given = [
        TOKENS.OBJECT_OPEN,
        'hello', TOKENS.COLON, 'world',
        TOKENS.COMMA,
        'foo', TOKENS.COLON, 'bar',
        TOKENS.OBJECT_CLOSE,
      ];
      const expected = [{ hello: 'world', foo: 'bar' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with extra separators', () => {
      const given = [
        TOKENS.OBJECT_OPEN,
        'hello', TOKENS.COLON, 'world',
        TOKENS.COMMA,
        TOKENS.COMMA,
        TOKENS.COMMA,
        TOKENS.COMMA,
        'foo', TOKENS.COLON, 'bar',
        TOKENS.COMMA,
        TOKENS.COMMA,
        TOKENS.COMMA,
        TOKENS.OBJECT_CLOSE,
      ];
      const expected = [{ hello: 'world', foo: 'bar' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });

    test('parse one set of tokens with leading separators', () => {
      const given = [
        TOKENS.OBJECT_OPEN,
        TOKENS.COMMA,
        TOKENS.COMMA,
        'hello', TOKENS.COLON, 'world',
        TOKENS.OBJECT_CLOSE,
      ];
      const expected = [{ hello: 'world' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });

    test('parse multiple set of tokens with override', () => {
      const given = [
        TOKENS.OBJECT_OPEN,
        'hello', TOKENS.COLON, 'world',
        TOKENS.COMMA,
        'hello', TOKENS.COLON, 'le monde',
        TOKENS.OBJECT_CLOSE,
      ];
      const expected = [{ hello: 'le monde' }, []];
      expect(parseTokensAsObject(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when key is TOKENS.COLON', () => {
      const given = [TOKENS.OBJECT_OPEN, TOKENS.COLON, TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      const expected = Error(`Expected string as key, got ${TOKENS.COLON}`);
      expect(() => parseTokensAsObject(given)).toThrow(expected);
    });

    test('error when colon is not TOKENS.COLON', () => {
      const given = [TOKENS.OBJECT_OPEN, 'hello', 'bad_token', 'world', TOKENS.OBJECT_CLOSE];
      const expected = Error('Expected colon, got bad_token');
      expect(() => parseTokensAsObject(given)).toThrow(expected);
    });

    test('error when no object opening token', () => {
      const given = ['hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      const expected = Error('Expected object opening token, got hello');
      expect(() => parseTokensAsObject(given)).toThrow(expected);
    });

    test('error when no end of object token', () => {
      const given = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world'];
      const expected = Error('Expected end of object');
      expect(() => parseTokensAsObject(given)).toThrow(expected);
    });
  });
});
