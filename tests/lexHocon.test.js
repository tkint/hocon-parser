const { lexHocon, COLON_TOKEN, SEPARATOR_TOKEN } = require('../lib/main');

describe('lexHocon', () => {
  describe('OK', () => {
    test('return field tokens when quoted strings', () => {
      const given = '"hello": "world"';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string key', () => {
      const given = 'hello: "world"';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit string value', () => {
      const given = '"hello": world';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when implicit strings', () => {
      const given = 'hello: world';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens when multiple spaces', () => {
      const given = 'hello :  world ';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens and trim spaces', () => {
      const given = ' hello :  world ';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with equal sign', () => {
      const given = 'hello = world';
      const expected = ['hello', COLON_TOKEN, 'world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value containing number', () => {
      const given = 'hello = w0rld';
      const expected = ['hello', COLON_TOKEN, 'w0rld'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with implicit string value starting with number', () => {
      const given = 'hello = 42world';
      const expected = ['hello', COLON_TOKEN, '42world'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value', () => {
      const given = 'hello = 42';
      const expected = ['hello', COLON_TOKEN, 42];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value containing space', () => {
      const given = 'hello = 4 2';
      const expected = ['hello', COLON_TOKEN, '4 2'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });

    test('return field tokens with number value ending with space', () => {
      const given = 'hello = 42 ';
      const expected = ['hello', COLON_TOKEN, '42'];
      expect(lexHocon(given)).toStrictEqual(expected);
    });
  });
});
