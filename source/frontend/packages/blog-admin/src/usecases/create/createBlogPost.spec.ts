import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type { BlogPostRepository } from './createBlogPost';
import { BlogPostCreator } from './createBlogPost';

const mockRepository: BlogPostRepository = {
  save: jest.fn(),
};

describe('ユースケース: 記事の投稿', () => {
  it('ブログ記事のデータを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPostCreator = new BlogPostCreator(builder, mockRepository);
    const blogPost = blogPostCreator.buildBlogPost();
    expect(blogPost.getTitleText()).toBe('記事タイトル');
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

  it('JSON 文字列のデータを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPostCreator = new BlogPostCreator(builder, mockRepository);
    const json = blogPostCreator.buildJson();

    const today = onlyYMD(new Date());
    const expectedJson = {
      title: '記事タイトル',
      postDate: today,
      lastUpdateDate: today,
      contents: [
        { type: 'h2', text: 'h2見出し1' },
        { type: 'h3', text: 'h3見出し1' },
        { type: 'paragraph', text: '段落1' },
      ],
    };
    expect(json).toEqual(JSON.stringify(expectedJson));
  });

  it('ユースケースを実行すると、データリポジトリへの保存が行われる', () => {
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
    };
    const builder = createBlogPostBuilder().setPostTitle('記事タイトル');

    const blogPostCreator = new BlogPostCreator(builder, mockRepository);
    blogPostCreator.execute();

    expect(mockRepository.save).toHaveBeenCalled();
  });
});

// 年月日のみを取得する
function onlyYMD(date: Date) {
  return date.toISOString().split('T')[0];
}
