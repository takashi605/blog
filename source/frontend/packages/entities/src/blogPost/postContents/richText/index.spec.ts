import { RichText, RichTextPart } from '.';

describe('richText', () => {
  it('テキスト構造を返却する', () => {
    const richText = new RichText([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2'),
      new RichTextPart('テストテキスト3'),
    ]);
    expect(richText.getText()).toEqual([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2'),
      new RichTextPart('テストテキスト3'),
    ]);
  });

  it('太字が含まれるテキスト構造を返却する', () => {
    const richText = new RichText([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: true, inlineCode: false }),
      new RichTextPart('テストテキスト3'),
    ]);
    expect(richText.getText()).toEqual([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: true, inlineCode: false }),
      new RichTextPart('テストテキスト3'),
    ]);
  });

  it('インライン文字装飾が含まれるテキスト構造を返却する', () => {
    const richText = new RichText([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: false, inlineCode: true }),
      new RichTextPart('テストテキスト3'),
    ]);
    expect(richText.getText()).toEqual([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: false, inlineCode: true }),
      new RichTextPart('テストテキスト3'),
    ]);
  });

  it('リンクが含まれるテキスト構造を返却する', () => {
    const richText = new RichText([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: false, inlineCode: false }, { href: 'https://example.com' }),
      new RichTextPart('テストテキスト3'),
    ]);
    expect(richText.getText()).toEqual([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2', { bold: false, inlineCode: false }, { href: 'https://example.com' }),
      new RichTextPart('テストテキスト3'),
    ]);
  });
});
