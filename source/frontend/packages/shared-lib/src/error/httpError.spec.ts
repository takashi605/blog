import { HttpError } from './httpError';

const throwErrorFunction = () => {
  throw new HttpError('HTTP 通信でエラーが発生しました', 500);
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

  it('エラーステータスを取得できる', () => {
    try {
      throwErrorFunction();
    } catch (error) {
      const httpError = error as HttpError;
      expect(httpError.status).toBe(500);
    }
  });
});
