import { HttpError } from '@/components/models/error/httpError';

const throwErrorFunction = () => {
  throw new HttpError('HTTP 通信でエラーが発生しました');
};

describe('HTTP エラー', () => {
  it('エラーメッセージを生成できる', () => {
    expect(() => throwErrorFunction()).toThrow(
      'HTTP 通信でエラーが発生しました',
    );
  });

  it('instanceof で型比較できる', () => {
    try {
      throwErrorFunction();
    } catch (error) {
      expect(error instanceof HttpError).toBeTruthy();
    }
  });
});
