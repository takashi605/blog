import { sum } from './functions';

describe('util functions', () => {
  describe('sum', () => {
    it('2つの数値の和を返す', () => {
      expect(sum(1, 2)).toBe(3);
      expect(sum(3, 4)).toBe(7);
      expect(sum(5, 6)).toBe(11);
    });
  });
});
