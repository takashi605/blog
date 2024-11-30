import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
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
  it('props に記事データの DTO が渡されたコンポーネントを返却する', async () => {
    const { props } = await ViewTopTechPickController();
    const { title, thumbnail, postDate, contents }: BlogPostDTO =
      props.blogPostDTO;
    expect(title).toBeDefined();
    expect(thumbnail).toBeDefined();
    expect(postDate).toBeDefined();
    expect(contents).toBeDefined();
  });

  it('記事のタイトルが表示されている', async () => {
    await renderController();
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeInTheDocument();
  });
});
