import WithBlogPostErrorForServer from '@/components/models/blogPost/error/WithBlogPostErrorForServer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

async function ErrorComponent() {
  throw new Error('エラー！！');
  return <div>これは表示されない文字列だよ</div>;
}

describe('投稿記事関連エラーを扱うコンポーネント', () => {
  it('エラーメッセージを表示する', async () => {
    const WithErrorHandling = await WithBlogPostErrorForServer(ErrorComponent);
    const screen = render(await WithErrorHandling(undefined));

    expect(screen.getByText('不明なエラーです。')).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });
});
