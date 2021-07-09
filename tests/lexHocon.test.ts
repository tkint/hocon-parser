import { lexHocon, TOKENS } from '../lib';

describe('lexHocon', () => {
  describe('OK', () => {
    test('return field tokens when quoted strings', () => {
      const given = '"hello": "world"';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string key', () => {
      const given = 'hello: "world"';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string value', () => {
      const given = '"hello": world';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit strings', () => {
      const given = 'hello: world';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when multiple spaces', () => {
      const given = 'hello :  world ';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens and trim spaces', () => {
      const given = ' hello :  world ';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with equal sign', () => {
      const given = 'hello = world';
      const expected = ['hello', TOKENS.COLON, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value containing number', () => {
      const given = 'hello = w0rld';
      const expected = ['hello', TOKENS.COLON, 'w0rld'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value starting with number', () => {
      const given = 'hello = 42world';
      const expected = ['hello', TOKENS.COLON, '42world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value', () => {
      const given = 'hello = 42';
      const expected = ['hello', TOKENS.COLON, 42];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value containing space', () => {
      const given = 'hello = 4 2';
      const expected = ['hello', TOKENS.COLON, '4 2'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value ending with space', () => {
      const given = 'hello = 42 ';
      const expected = ['hello', TOKENS.COLON, '42'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });
  });
});
