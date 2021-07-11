import { lexHocon, TOKENS } from '../lib';

describe('lexHocon', () => {
  describe('OK', () => {
    test('return field tokens when quoted strings', () => {
      const given = '"hello": "world"';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string key', () => {
      const given = 'hello: "world"';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string value', () => {
      const given = '"hello": world';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit strings', () => {
      const given = 'hello: world';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when multiple spaces', () => {
      const given = 'hello :  world ';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens and trim spaces', () => {
      const given = ' hello :  world ';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with equal sign', () => {
      const given = 'hello = world';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value containing number', () => {
      const given = 'hello = w0rld';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 'w0rld', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value starting with number', () => {
      const given = 'hello = 42world';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, '42world', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value starting with number and containing keyword', () => {
      const given = 'hello = 42true';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, '42true', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value', () => {
      const given = 'hello = 42';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, 42, TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value containing space', () => {
      const given = 'hello = 4 2';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, '4 2', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value ending with space', () => {
      const given = 'hello = 42 ';
      const expected = [TOKENS.OBJECT_OPEN, 'hello', TOKENS.COLON, '42', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    [
      { given: 'hello = true', expected: ['hello', TOKENS.COLON, true] },
      { given: 'hello = false', expected: ['hello', TOKENS.COLON, false] },
      { given: 'hello = null', expected: ['hello', TOKENS.COLON, null] },
      { given: 'hello = tr ue', expected: ['hello', TOKENS.COLON, 'tr ue'] },
      { given: 'hello = fal se', expected: ['hello', TOKENS.COLON, 'fal se'] },
      { given: 'hello = nu ll', expected: ['hello', TOKENS.COLON, 'nu ll'] },
      { given: 'hello = trueworld', expected: ['hello', TOKENS.COLON, 'trueworld'] },
      { given: 'hello = true42', expected: ['hello', TOKENS.COLON, 'true42'] },
    ].forEach((testData, index) => {
      test(`return field tokens with keyword value ${index}`, () => {
        expect(lexHocon(testData.given)).toStrictEqual([TOKENS.OBJECT_OPEN, ...testData.expected, TOKENS.OBJECT_CLOSE]);
      });
    });

    test('return multiple field tokens when multiple fields on one line', () => {
      const given = 'a = aaa, b = bbb';
      const expected = [TOKENS.OBJECT_OPEN, 'a', TOKENS.COLON, 'aaa', TOKENS.SEPARATOR, 'b', TOKENS.COLON, 'bbb', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return multiple field tokens when multiple fields', () => {
      const given = 'a = aaa\nb = bbb';
      const expected = [TOKENS.OBJECT_OPEN, 'a', TOKENS.COLON, 'aaa', TOKENS.SEPARATOR, 'b', TOKENS.COLON, 'bbb', TOKENS.OBJECT_CLOSE];
      expect(lexHocon(given)).toStrictEqual(expected);
    });
  });
});
