import ContentRenderer from '@/components/models/blogPost/view/ui/contents/Content';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('コンポーネント: viewBlogPostController', () => {
  it('type に h2 を渡したとき、h2 タグを表示する', async () => {
    render(<ContentRenderer type="h2" value="h2見出し" />);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('h2見出し');
  });

  it('type に h3 を渡したとき、h3 タグを表示する', async () => {
    render(<ContentRenderer type="h3" value="h3見出し" />);

    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('h3見出し');
  });

  it('type に paragraph を渡したとき、p タグを表示する', async () => {
    render(<ContentRenderer type="paragraph" value="段落" />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('段落');
  });
});
