import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { mockRichTextForDTO } from 'service/src/mockData/mockBlogPostDTO';
import Paragraph from './Paragraph';

describe('コンポーネント： Paragraph', () => {
  it('RichText 配列が連結された文字列を表示する', async () => {
    render(<Paragraph richText={mockRichTextForDTO()} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('これはテストテキストです');
  });

  it('RichText 配列が空の場合、空文字列を表示する', async () => {
    render(<Paragraph richText={[]} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('');
  });
});
