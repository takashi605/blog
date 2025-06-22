import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import type { components } from 'shared-lib/src/generated/api-types';
import Paragraph from './Paragraph';

type RichText = components['schemas']['RichText'];

// テスト用のモックデータ
const mockRichText: RichText[] = [
  {
    text: 'これは',
    styles: { bold: false, inlineCode: false },
  },
  {
    text: 'テストテキスト',
    styles: { bold: false, inlineCode: false },
  },
  {
    text: 'です',
    styles: { bold: false, inlineCode: false },
  },
];

describe('コンポーネント： Paragraph', () => {
  it('RichText 配列が連結された文字列を表示する', async () => {
    render(<Paragraph richText={mockRichText} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('これはテストテキストです');
  });

  it('太字フォーマットが含まれる RichText 配列が渡された場合、strong タグによる太字対応がされている', async () => {
    render(
      <Paragraph
        richText={[
          {
            text: 'これは',
            styles: { bold: false, inlineCode: false },
          },
          {
            text: 'テストテキスト',
            styles: { bold: true, inlineCode: false },
          },
          {
            text: 'です',
            styles: { bold: false, inlineCode: false },
          },
        ]}
      />,
    );

    const strong = screen.getByRole('strong');
    expect(strong).toHaveTextContent('テストテキスト');
  });

  it('インラインフォーマットが含まれる RichText 配列が渡された場合、code タグによるインライン対応がされている', async () => {
    render(
      <Paragraph
        richText={[
          {
            text: 'これは',
            styles: { bold: false, inlineCode: false },
          },
          {
            text: 'テストテキスト',
            styles: { bold: false, inlineCode: true },
          },
          {
            text: 'です',
            styles: { bold: false, inlineCode: false },
          },
        ]}
      />,
    );

    const code = screen.getByRole('code');
    expect(code).toHaveTextContent('テストテキスト');
  });

  it('全てのスタイルが渡された場合、<code><strong>text</strong></code> の優先度でタグがラッピングされる', async () => {
    render(
      <Paragraph
        richText={[
          {
            text: 'これは',
            styles: { bold: false, inlineCode: false },
          },
          {
            text: 'テストテキスト',
            styles: { bold: true, inlineCode: true },
          },
          {
            text: 'です',
            styles: { bold: false, inlineCode: false },
          },
        ]}
      />,
    );

    const code = screen.getByRole('code');
    const strong = within(code).getByRole('strong');
    expect(code).toHaveTextContent('テストテキスト');
    expect(strong).toHaveTextContent('テストテキスト');
  });

  it('RichText 配列が空の場合、空文字列を表示する', async () => {
    render(<Paragraph richText={[]} />);

    const p = screen.getByRole('paragraph');
    expect(p).toHaveTextContent('');
  });
});
