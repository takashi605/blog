import ContentRenderer from '@/controllers/blogPost/view/ui/contents/Content';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ContentType } from 'entities/src/blogPost/postContents/content';

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

  it('type に paragraph を渡したとき、p タグを表示する', async () => {
    render(
      <ContentRenderer
        content={{
          id: '1',
          type: ContentType.Paragraph,
          text: '段落',
        }}
      />,
    );

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('段落');
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
});
