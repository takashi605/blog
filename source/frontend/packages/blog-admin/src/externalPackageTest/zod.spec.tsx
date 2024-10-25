import { z } from 'zod';

describe('学習用テスト： Zod パッケージ', () => {
  it('リテラル型について、型の一致を検証できる', () => {
    const stringSchema = z.string();

    expect(stringSchema.parse('1')).toBe('1');
    expect(() => stringSchema.parse(1)).toThrow();
  });

  it('オブジェクト型について、型の一致を検証できる', () => {
    const objectSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    expect(objectSchema.parse({ name: 'Alice', age: 20 })).toEqual({ name: 'Alice', age: 20 });
    expect(() => objectSchema.parse({ name: 'Alice', age: '20' })).toThrow();
  });
});
