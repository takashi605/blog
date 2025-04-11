import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import { mockRichTextDTO } from 'service/src/mockData/mockBlogPostDTO';
import ContentRenderer from './Content';

describe('コンポーネント: viewBlogPostController', () => {
  it('type に h2 を渡したとき、h2 タグを表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.H2,
          text: 'h2見出し',
        }}
      />,
    );

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('h2見出し');
  });

  it('type に h3 を渡したとき、h3 タグを表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.H3,
          text: 'h3見出し',
        }}
      />,
    );

    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('h3見出し');
  });

  it('type に paragraph を渡したとき、RichText 配列が連結された文字列を表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.Paragraph,
          text: mockRichTextDTO(),
        }}
      />,
    );

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('これはテストテキストです');
  });

  it('type に image を渡したとき、img タグを表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.Image,
          path: 'path/to/image',
        }}
      />,
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toMatch('path/to/image');
  });

  it('type に codeBlock を渡したとき、code タグを表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.CodeBlock,
          title: 'サンプルコード',
          code: 'console.log("Hello, world!")',
          language: 'javascript',
        }}
      />,
    );
    const codeBlock = screen.getByRole('code');
    expect(codeBlock).toBeInTheDocument();

    // span で細かく分けられているので、一部のテキストが含まれているかのみ確認
    const codeBlockFragment = within(codeBlock).getByText('console');
    expect(codeBlockFragment).toBeInTheDocument();
  });
});
