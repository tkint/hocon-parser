import { parseTokens, TOKENS } from '../lib';

describe('parseTokens', () => {
  test('parse object', () => {
    const given = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
    const expected = [{ hello: 'world' }, []];
    expect(parseTokens(given)).toStrictEqual(expected);
  });

  test('parse array', () => {
    const given = [TOKENS.ARRAY_OPEN, 'hello', TOKENS.COMMA, 'world', TOKENS.ARRAY_CLOSE];
    const expected = [['hello', 'world'], []];
    expect(parseTokens(given)).toStrictEqual(expected);
  });

  test('parse array of objects', () => {
    const given = [
      TOKENS.ARRAY_OPEN,
      TOKENS.OBJECT_OPEN,
      'b',
      TOKENS.COLON,
      'bbb',
      TOKENS.OBJECT_CLOSE,
      TOKENS.COMMA,
      TOKENS.OBJECT_OPEN,
      'c',
      TOKENS.COLON,
      'ccc',
      TOKENS.OBJECT_CLOSE,
      TOKENS.ARRAY_CLOSE,
    ];
    const expected = [[{ b: 'bbb' }, { c: 'ccc' }], []];
    expect(parseTokens(given)).toStrictEqual(expected);
  });

  test('parse array of objects with extra commas', () => {
    const given = [
      TOKENS.ARRAY_OPEN,
      TOKENS.COMMA,
      TOKENS.OBJECT_OPEN,
      'b',
      TOKENS.COLON,
      'bbb',
      TOKENS.COMMA,
      TOKENS.OBJECT_CLOSE,
      TOKENS.COMMA,
      TOKENS.COMMA,
      TOKENS.OBJECT_OPEN,
      'c',
      TOKENS.COLON,
      'ccc',
      TOKENS.COMMA,
      TOKENS.OBJECT_CLOSE,
      TOKENS.COMMA,
      TOKENS.ARRAY_CLOSE,
    ];
    const expected = [[{ b: 'bbb' }, { c: 'ccc' }], []];
    expect(parseTokens(given)).toStrictEqual(expected);
  });

  test('parse array of objects in object', () => {
    const given = [
      TOKENS.OBJECT_OPEN,
      'a',
      TOKENS.COLON,
      TOKENS.ARRAY_OPEN,
      TOKENS.OBJECT_OPEN,
      'b',
      TOKENS.COLON,
      'bbb',
      TOKENS.OBJECT_CLOSE,
      TOKENS.COMMA,
      TOKENS.OBJECT_OPEN,
      'c',
      TOKENS.COLON,
      'ccc',
      TOKENS.OBJECT_CLOSE,
      TOKENS.ARRAY_CLOSE,
      TOKENS.OBJECT_CLOSE,
    ];
    const expected = [{ a: [{ b: 'bbb' }, { c: 'ccc' }] }, []];
    expect(parseTokens(given)).toStrictEqual(expected);
  });
});
