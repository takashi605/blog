import WithBlogPostErrorForServer from '@/components/models/blogPost/error/WithBlogPostErrorForServer';
import { HttpError } from '@/components/models/error/httpError';
import { UsecaseError } from '@/usecases/error';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { EntityError } from 'entities/src/error/error';

async function ErrorComponent() {
  throw new Error('エラー！！');
  return <div>これは表示されない文字列だよ</div>;
}

async function UsecaseErrorComponent() {
  throw new UsecaseError('エラー！！');
  return <div>これは表示されない文字列だ よ</div>;
}

async function EntityErrorComponent() {
  throw new EntityError('エラー！！');
  return <div>これは表示されない文字列だよ</div>;
}

async function HttpErrorComponent() {
  throw new HttpError('エラー！！', 500);
  return <div>これは表示されない文字列だよ</div>;
}

async function NotFoundErrorComponent() {
  throw new HttpError('エラー！！', 404);
  return <div>これは表示されない文字列だよ</div>;
}

describe('投稿記事関連エラーを扱うコンポーネント', () => {
  it('エラーメッセージを表示する', async () => {
    const WithErrorHandling = WithBlogPostErrorForServer(ErrorComponent);
    const screen = render(await WithErrorHandling(undefined));

    expect(screen.getByText('不明なエラーです。')).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });

  it('Usecase 層でエラーが発生していた場合、「記事データを生成できませんでした」というエラーメッセージを表示する', async () => {
    const WithErrorHandling = WithBlogPostErrorForServer(UsecaseErrorComponent);
    const screen = render(await WithErrorHandling(undefined));

    expect(
      screen.getByText('記事データを生成できませんでした'),
    ).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });

  it('Entity 層でエラーが発生していた場合、「記事データを生成できませんでした」というエラーメッセージを表示する', async () => {
    const WithErrorHandling = WithBlogPostErrorForServer(EntityErrorComponent);
    const screen = render(await WithErrorHandling(undefined));

    expect(
      screen.getByText('記事データを生成できませんでした'),
    ).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });

  it('Http エラーが発生していた場合、「記事データの取得に失敗しました」というエラーメッセージを表示する', async () => {
    const WithErrorHandling = WithBlogPostErrorForServer(HttpErrorComponent);
    const screen = render(await WithErrorHandling(undefined));

    expect(
      screen.getByText('記事データの取得に失敗しました'),
    ).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });

  it('404 エラーが発生していた場合、「記事が見つかりませんでした」というエラーメッセージを表示する', async () => {
    const WithErrorHandling = WithBlogPostErrorForServer(
      NotFoundErrorComponent,
    );
    const screen = render(await WithErrorHandling(undefined));

    expect(screen.getByText('記事が見つかりませんでした')).toBeInTheDocument();
    expect(screen.queryByText('これは表示されない文字列だよ')).toBeNull();
  });
});
