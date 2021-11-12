import { deepFind } from '../lib';

describe('deepFind', () => {
  describe('OK', () => {
    it('return element when found', () => {
      const obj = { a: 'aaa' };
      const path = 'a';
      expect(deepFind(obj, path)).toBe('aaa');
    });

    it('return element when nested', () => {
      const obj = { a: { b: 'bbb' } };
      const path = 'a.b';
      expect(deepFind(obj, path)).toBe('bbb');
    });

    it('return element when array index', () => {
      const obj = ['aaa'];
      const path = '0';
      expect(deepFind(obj, path)).toBe('aaa');
    });

    it('return element when array index nested', () => {
      const obj = { a: ['aaa'] };
      const path = 'a.0';
      expect(deepFind(obj, path)).toBe('aaa');
    });

    it('return element when found as number', () => {
      const obj = { a: 10 };
      const path = 'a';
      expect(deepFind(obj, path)).toBe(10);
    });
  });

  describe('OK', () => {
    it('undefined when empty path', () => {
      const obj = { a: 'aaa' };
      const path = '';
      expect(deepFind(obj, path)).toBe(undefined);
    });

    it('undefined when not found', () => {
      const obj = { a: 'aaa' };
      const path = 'b';
      expect(deepFind(obj, path)).toBe(undefined);
    });
  });
});
