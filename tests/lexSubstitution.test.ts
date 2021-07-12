import { lexSubstitution } from '../lib';

describe('lexSubstitution', () => {
  describe('OK', () => {
    test('return substitution when valid', () => {
      const given = '${a}';
      const expected = ['${a}', ''];
      expect(lexSubstitution(given)).toStrictEqual(expected);
    });
  });

  describe('KO', () => {
    test('error when missing end-of-substitution character', () => {
      const given = '${a';
      const expected = Error('Expected end-of-substitution character');
      expect(() => lexSubstitution(given)).toThrow(expected);
    });
  });
});
