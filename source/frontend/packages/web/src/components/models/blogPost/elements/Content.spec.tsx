import Content from '@/components/models/blogPost/elements/Content';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('コンポーネント: viewBlogPostController', () => {
  it('type に h2 を渡したとき、h2 タグを表示する', async () => {
    render(<Content type="h2" value="h2見出し" />);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('h2見出し');
  });
});
