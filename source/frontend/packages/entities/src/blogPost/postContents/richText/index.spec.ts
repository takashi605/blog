import { RichText } from '.';

describe('richText', () => {
  it('単純なテキスト構造を返却する', () => {
    const richText = new RichText('テストテキスト');
    expect(richText.getText()).toEqual('テストテキスト');
  });
});
