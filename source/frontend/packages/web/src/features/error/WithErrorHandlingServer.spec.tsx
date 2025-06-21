import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import WithErrorHandlingServer from './WithErrorHandlingServer';

async function ErrorComponent() {
  throw new Error('エラー！！');
  return <div>これは表示されない文字列だよ</div>;
}

describe('エラーを扱うコンポーネント', () => {
  it('エラーをキャッチすると本来レンダリング予定のコンポーネントを\
      レンダリングせずにエラーメッセージを表示する', async () => {
    const WithErrorHandling = WithErrorHandlingServer(
      ErrorComponent,
      'エラー発生！',
    );
    const screen = render(await WithErrorHandling(undefined));

    expect(screen.getByText('エラー発生！')).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });
});
