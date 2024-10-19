import { UsecaseError } from '@/usecases/error';

const throwErrorFunction = () => {
  throw new UsecaseError('ユースケースでエラーが発生しました');
};

describe('ユースケース: エラー', () => {
  it('エラーメッセージを生成できる', () => {
    expect(() => throwErrorFunction()).toThrow(
      'ユースケースでエラーが発生しました',
    );
  });

  it('instanceof で型比較できる', () => {
    try {
      throwErrorFunction();
    } catch (error) {
      expect(error instanceof UsecaseError).toBeTruthy();
    }
  });
});
