import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { BlogPost } from 'shared-lib/src/api';
import { UUIDList } from 'shared-test-data';
import ViewBlogPostController from './ViewBlogPostController';

// shared-lib/src/api のモック
jest.mock('shared-lib/src/api', () => ({
  api: {
    get: jest.fn(),
  },
  HttpError: class HttpError extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
      this.name = 'HttpError';
    }
  },
}));

const mockGet = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const api = require('shared-lib/src/api').api;
  api.get = mockGet;
});

const mockBlogPost: BlogPost = {
  id: UUIDList.UUID1,
  title: 'テスト記事タイトル',
  thumbnail: { id: 'thumb-1', path: 'https://example.com/thumb1.jpg' },
  postDate: '2024-01-01',
  lastUpdateDate: '2024-01-02',
  contents: [
    {
      type: 'h2',
      id: 'h2-1',
      text: 'テスト見出し2',
    },
    {
      type: 'h3',
      id: 'h3-1',
      text: 'テスト見出し3',
    },
    {
      type: 'paragraph',
      id: 'p-1',
      text: [
        {
          text: 'テスト段落です。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
    {
      type: 'image',
      id: 'img-1',
      path: 'https://example.com/content1.jpg',
    },
    {
      type: 'codeBlock',
      id: 'code-1',
      code: 'console.log("hello");',
      language: 'javascript',
      title: 'サンプルコード',
    },
  ],
};

const renderController = async (postId: string = UUIDList.UUID1) => {
  mockGet.mockResolvedValue(mockBlogPost);
  const ControllerComponent = await ViewBlogPostController({ postId });
  return render(ControllerComponent);
};

describe('コンポーネント: ViewBlogPostController', () => {
  it('記事タイトルが表示されている', async () => {
    await renderController();
    expect(mockGet).toHaveBeenCalledWith('/api/blog/posts/{uuid}', {
      pathParams: { uuid: UUIDList.UUID1 },
    });

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBe('テスト記事タイトル');
  });

  it('サムネイル画像が表示されている', async () => {
    await renderController();

    const mainVisual = screen.getByRole('img', {
      name: 'サムネイル画像',
    }) as HTMLImageElement;
    expect(mainVisual).toBeInTheDocument();
    expect(mainVisual.src).toMatch('https://example.com/thumb1.jpg');
  });

  it('投稿日,更新日が表示されている', async () => {
    await renderController();

    const postDateSection = screen.getByText('投稿日:');
    expect(postDateSection).toBeInTheDocument();
    expect(screen.getByText('2024/1/1')).toBeInTheDocument();

    const updateDateSection = screen.getByText('更新日:');
    expect(updateDateSection).toBeInTheDocument();
    expect(screen.getByText('2024/1/2')).toBeInTheDocument();
  });

  describe('コンテンツ', () => {
    it('h2 が表示されている', async () => {
      await renderController();

      const h2 = screen.getAllByRole('heading', { level: 2 });
      expect(h2).toHaveLength(1);
      expect(h2[0].textContent).toBe('テスト見出し2');
    });

    it('h3 が表示されている', async () => {
      await renderController();

      const h3 = screen.getAllByRole('heading', { level: 3 });
      expect(h3).toHaveLength(1);
      expect(h3[0].textContent).toBe('テスト見出し3');
    });

    it('p が表示されている', async () => {
      await renderController();

      const p = screen.getAllByRole('paragraph');
      expect(p).toHaveLength(1);
      expect(p[0].textContent).toBe('テスト段落です。');
    });

    it('画像が表示されている', async () => {
      await renderController();

      const img = screen.getAllByRole('img', { name: '画像コンテンツ' });
      expect(img).toHaveLength(1);
      expect((img[0] as HTMLImageElement).src).toMatch(
        'https://example.com/content1.jpg',
      );
    });

    it('コードブロックが表示されている', async () => {
      await renderController();

      const codeBlock = screen.getAllByRole('code');
      expect(codeBlock).toHaveLength(1);
      expect(codeBlock[0].textContent).toBe('console.log("hello");');
    });
  });

  it('APIエラー時（404）に記事が見つからないメッセージが表示される', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { HttpError } = require('shared-lib/src/api');
    mockGet.mockRejectedValue(new HttpError(404, 'Not Found'));

    const ControllerComponent = await ViewBlogPostController({
      postId: 'nonexistent-id',
    });
    render(ControllerComponent);

    const errorMessage = screen.getByText('記事が見つかりませんでした');
    expect(errorMessage).toBeInTheDocument();
  });

  it('APIエラー時（その他）に汎用エラーメッセージが表示される', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    const ControllerComponent = await ViewBlogPostController({
      postId: UUIDList.UUID1,
    });
    render(ControllerComponent);

    const errorMessage = screen.getByText('記事の読み込みに失敗しました');
    expect(errorMessage).toBeInTheDocument();
  });
});
