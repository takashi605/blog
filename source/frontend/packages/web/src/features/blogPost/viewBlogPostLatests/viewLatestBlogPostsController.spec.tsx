import type { ReactElement } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import ViewLatestBlogPostsController from './ViewLatestBlogPostsController';

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

describe('viewLatestBlogPostsController', () => {
  it('レンダリングするコンポーネントに記事データの DTO 配列が渡されている', async () => {
    const { props } = (await ViewLatestBlogPostsController({})) as ReactElement;
    const dtoList = props.blogPosts as BlogPostDTO[];
    expect(dtoList).toBeDefined();
    expect(dtoList.length).toBeGreaterThan(0);
    dtoList.forEach((dto) => {
      expect(dto.id).toBeDefined();
      expect(dto.title).toBeDefined();
      expect(dto.postDate).toBeDefined();
      expect(dto.lastUpdateDate).toBeDefined();
      expect(dto.thumbnail.path).toBeDefined();
      dto.contents.forEach((content) => {
        expect(content.id).toBeDefined();
        expect(content.type).toBeDefined();

        if (content.type === 'image') {
          expect(content.path).toBeDefined();
        } else if (content.type === 'codeBlock') {
          expect(content.code).toBeDefined();
        } else {
          expect(content.text).toBeDefined();
        }
      });
    });
  });

  it('取得するデータ数を指定した場合、その数だけの記事データが取得される', async () => {
    const { props } = (await ViewLatestBlogPostsController({
      quantity: 3,
    })) as ReactElement;
    const dtoList = props.blogPosts as BlogPostDTO[];
    expect(dtoList).toBeDefined();
    expect(dtoList.length).toBe(3);
  });
});
