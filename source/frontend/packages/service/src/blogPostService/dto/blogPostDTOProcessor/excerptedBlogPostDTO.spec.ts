import { mockBlogPostDTO } from '../../../mockData/mockBlogPostDTO';
import { extractFirstParagraphText } from './excerptedBlogPostDTO';

describe('excerptedBlogPostDTO', () => {
  it('記事コンテンツの最も上部に位置する段落のテキストを取得する', () => {
    const dto = mockBlogPostDTO;
    const result = extractFirstParagraphText(dto);
    expect(result).toEqual('これはテストテキストです');
  });
});
