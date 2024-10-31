import { createBlogPostBuilder } from '../../blogPost/blogPostBuilder';

describe('ユースケース: 投稿記事を生成するビルダークラス', () => {
  it('BlogPost エンティティを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPost = builder.build();

    expect(blogPost.getTitleText()).toBe('記事タイトル');

    const expectedPostDate = new Date('2021-01-01');
    expect(blogPost.getPostDate()).toEqual(expectedPostDate);

    const expectedLastUpdateDate = new Date('2021-01-02');
    expect(blogPost.getLastUpdateDate()).toEqual(expectedLastUpdateDate);

    expect(blogPost.getContents().length).toBe(3);

    expect(blogPost.getContents()[0].getValue()).toBe('h2見出し1');
    expect(blogPost.getContents()[0].getType()).toBe('h2');

    expect(blogPost.getContents()[1].getValue()).toBe('h3見出し1');
    expect(blogPost.getContents()[1].getType()).toBe('h3');

    expect(blogPost.getContents()[2].getValue()).toBe('段落1');
    expect(blogPost.getContents()[2].getType()).toBe('paragraph');
  });
});
