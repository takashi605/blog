import {
  mockBlogPostDTO,
  mockRichTextDTO,
} from '../../../mockData/mockBlogPostDTO';
import {
  extractFirstParagraph,
  extractFirstParagraphText,
} from './excerptedBlogPostDTO';

describe('excerptedBlogPostDTO', () => {
  describe('extractFirstParagraphText 関数', () => {
    it('記事コンテンツの最も上部に位置する段落のテキストを取得する', () => {
      const dto = mockBlogPostDTO;
      const result = extractFirstParagraphText(dto);
      expect(result).toEqual('これはテストテキストです');
    });
  });

  describe('extractFirstParagraph 関数', () => {
    it('記事コンテンツの最も上部に位置する段落を取得する', () => {
      const dto = mockBlogPostDTO;
      const result = extractFirstParagraph(dto);
      expect(result).toEqual(mockRichTextDTO());
    });
  });
});
