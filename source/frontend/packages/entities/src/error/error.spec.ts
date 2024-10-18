import { EntityError } from '@/error/error';

const throwErrorFunction = () => {
  throw new EntityError('エンティティでエラーが発生しました');
};

describe('エンティティ: エラー', () => {
  it('エラーメッセージを生成できる', () => {
    expect(() => throwErrorFunction()).toThrow(
      'エンティティでエラーが発生しました',
    );
  });

  it('instanceof で型比較できる', () => {
    try {
      throwErrorFunction();
    } catch (error) {
      expect(error instanceof EntityError).toBeTruthy();
    }
  });
});
