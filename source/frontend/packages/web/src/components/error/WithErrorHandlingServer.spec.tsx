import WithErrorHandlingServer from '@/components/error/WithErrorHandlingServer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

async function ErrorComponent() {
  throw new Error('エラー！！');
  return <div>これは表示されない文字列だよ</div>;
}

describe('投稿記事関連エラーを扱うコンポーネント', () => {
  it('エラーメッセージを表示する', async () => {
    const WithErrorHandling = await WithErrorHandlingServer(
      ErrorComponent,
      'エラー発生！',
    );
    const screen = render(await WithErrorHandling(undefined));

    expect(screen.getByText('エラー発生！')).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });
});
