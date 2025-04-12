import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { mockRichTextDTO } from 'service/src/mockData/mockBlogPostDTO';
import Paragraph from './Paragraph';

describe('コンポーネント： Paragraph', () => {
  it('RichText 配列が連結された文字列を表示する', async () => {
    render(<Paragraph richText={mockRichTextDTO()} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('これはテストテキストです');
  });

  it('太字フォーマットが含まれる RichText 配列が渡された場合、strong タグによる太字対応がされている', async () => {
    render(
      <Paragraph
        richText={[
          {
            text: 'これは',
            styles: { bold: false, inline: false },
          },
          {
            text: 'テストテキスト',
            styles: { bold: true, inline: false },
          },
          {
            text: 'です',
            styles: { bold: false, inline: false },
          },
        ]}
      />,
    );

    const strong = screen.getByRole('strong');
    expect(strong).toHaveTextContent('テストテキスト');
  });

  it('RichText 配列が空の場合、空文字列を表示する', async () => {
    render(<Paragraph richText={[]} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('');
  });
});
