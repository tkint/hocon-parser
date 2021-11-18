import { lexString } from '../lib';

describe('lexString', () => {
  describe('OK', () => {
    test('return string when quoted string', () => {
      const given = '"aaa"';
      const expected = ['aaa', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string', () => {
      const given = 'aaa';
      const expected = ['aaa', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string with hyphen', () => {
      const given = 'aa-a';
      const expected = ['aa-a', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string with space', () => {
      const given = 'aa  a';
      const expected = ['aa  a', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string with hyphen and space', () => {
      const given = 'aa- a';
      const expected = ['aa- a', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when number', () => {
      const given = '05';
      const expected = ['05', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string with unix line separator', () => {
      const given = 'aaa\nbbb';
      const expected = ['aaa', '\nbbb'];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return string when implicit string with comma separator', () => {
      const given = 'aaa,bbb';
      const expected = ['aaa', ',bbb'];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return reference when substitution', () => {
      const given = '${a}';
      const expected = ['__SUBSTITUTION(a)__', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return reference when substitution with dots', () => {
      const given = '${a.b.0}';
      const expected = ['__SUBSTITUTION(a.b.0)__', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return undefined when commented string 1', () => {
      const given = '# aaa';
      const expected = ['', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });

    test('return undefined when commented string 2', () => {
      const given = '// aaa';
      const expected = ['', ''];
      expect(lexString(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when missing quoted end-of-string', () => {
      const given = '"aaa';
      const expected = Error('Expected end-of-string quote');
      expect(() => lexString(given)).toThrow(expected);
    });

    test('error when unexpected quote in free-string', () => {
      const given = 'aa"a';
      const expected = Error('Expected end-of-string quote');
      expect(() => lexString(given)).toThrow(expected);
    });
  });
});
