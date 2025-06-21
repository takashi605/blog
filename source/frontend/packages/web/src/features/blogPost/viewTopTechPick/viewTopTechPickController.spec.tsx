import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import type { BlogPost } from 'shared-lib/src/api/types';
import ViewTopTechPickController from './ViewTopTechPickController';

const mockApiForServer = setupMockApiForServer(
  process.env.NEXT_PUBLIC_API_URL!,
);
beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

const renderController = async () => render(await ViewTopTechPickController());

describe('ViewTopTechPickController', () => {
  it('props に記事データが渡されたコンポーネントを返却する', async () => {
    const { props } = await ViewTopTechPickController();
    const {
      title,
      thumbnail,
      postDate,
      contents,
    }: BlogPost = props.blogPost;
    expect(title).toBeDefined();
    expect(thumbnail).toBeDefined();
    expect(postDate).toBeDefined();
    expect(contents).toBeDefined();
  });

  it('記事のタイトルが表示されている', async () => {
    await renderController();
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });

  it('記事のサムネイル画像が表示されている', async () => {
    await renderController();
    const thumbnail = await screen.findByRole('img', {
      name: 'サムネイル画像',
    });
    expect(thumbnail).toBeInTheDocument();
  });

  it('記事の投稿日が表示されている', async () => {
    await renderController();
    const postDate = await screen.findByText(/\d{4}\/\d{1,2}\/\d{1,2}/);
    expect(postDate).toBeInTheDocument();
  });

  it('記事本文の抜粋が表示されている', async () => {
    await renderController();
    const content = await screen.findByRole('paragraph');
    expect(content).toBeInTheDocument();
  });
});
