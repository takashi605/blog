import { RichText, RichTextPart } from '.';

describe('richText', () => {
  it('複数行のテキスト構造を返却する', () => {
    const richText = new RichText([
      new RichTextPart('テストテキスト1'),
      new RichTextPart('テストテキスト2'),
      new RichTextPart('テストテキスト3'),
    ]);
    expect(richText.getText()).toEqual([
      'テストテキスト1',
      'テストテキスト2',
      'テストテキスト3',
    ]);
  });
});
