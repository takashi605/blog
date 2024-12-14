import { RichText, RichTextPart } from '.';

describe('richText', () => {
  it('単純なテキスト構造を返却する', () => {
    const richText = new RichText(new RichTextPart('テストテキスト'));
    expect(richText.getText()).toEqual('テストテキスト');
  });
});
