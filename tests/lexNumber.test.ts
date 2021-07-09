import { lexNumber } from '../lib';

describe('lexNumber', () => {
  describe('OK', () => {
    test('return number when valid number', () => {
      const given = '0';
      const expected = [0, ''];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('return number with negative sign', () => {
      const given = '-5';
      const expected = [-5, ''];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('return number with dot', () => {
      const given = '1.5';
      const expected = [1.5, ''];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('return number with dot starting with zero', () => {
      const given = '0.5';
      const expected = [0.5, ''];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('return number with dot starting with dot', () => {
      const given = '.5';
      const expected = [0.5, ''];
      expect(lexNumber(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('undefined when quoted string', () => {
      const given = '"0"';
      const expected = [undefined, given];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('undefined when implicit string', () => {
      const given = 'aaa';
      const expected = [undefined, given];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('undefined when implicit string starts with number', () => {
      const given = '0aa';
      const expected = [undefined, given];
      expect(lexNumber(given)).toStrictEqual(expected);
    });

    test('undefined when number with space', () => {
      const given = '0 5';
      const expected = [undefined, given];
      expect(lexNumber(given)).toStrictEqual(expected);
    });
  });
});
