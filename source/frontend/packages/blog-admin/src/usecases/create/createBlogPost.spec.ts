import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type { BlogPostRepository } from './createBlogPost';
import { BlogPostCreator } from './createBlogPost';

const mockRepository: BlogPostRepository = {
  save: jest.fn(),
};

describe('ユースケース: 記事の投稿', () => {
  it('ユースケースを実行すると JSON 記事データを生成してデータリポジトリへ保存する', () => {
    const mockSave = jest.fn();
    const mockRepository: BlogPostRepository = {
      save: mockSave,
    };

    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPostCreator = new BlogPostCreator(builder, mockRepository);

    blogPostCreator.execute();

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const blogPost = getSaveMethodArg();
    expect(blogPost).toEqual(blogPostCreator.buildBlogPost());

    function getSaveMethodArg() {
      return mockSave.mock.calls[0][0];
    }
  });

  it('投稿日時と更新日時が今日の日付になる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02');
    const blogPostCreator = new BlogPostCreator(builder, mockRepository);
    const blogPost = blogPostCreator.buildBlogPost();

    const today = onlyYMD(new Date());
    const postDate = onlyYMD(blogPost.getPostDate());
    const lastUpdateDate = onlyYMD(blogPost.getLastUpdateDate());

    expect(postDate).toBe(today);
    expect(lastUpdateDate).toBe(today);
  });
});

// 年月日のみを取得する
function onlyYMD(date: Date) {
  return date.toISOString().split('T')[0];
}
