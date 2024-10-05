import { createBlogPost, type BlogPost } from './blogPost';

describe('エンティティ: 投稿記事', () => {
  it('記事タイトルとなる h1 見出しを生成できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title, [], []);
    expect(blogPost.getTitleText()).toBe(title);
    expect(blogPost.getTitleLevel()).toBe(1);
  });

  it('h2 見出しを複数生成できる', () => {
    const title = '記事タイトル';
    const h2List = ['h2見出し1', 'h2見出し2', 'h2見出し3'];
    const blogPost: BlogPost = createBlogPost(title, h2List, []);
    blogPost.getH2List().forEach((h2, index) => {
      expect(h2.getText()).toBe(h2List[index]);
      expect(h2.getLevel()).toBe(2);
    });
  });

  it('h3 見出しを複数生成できる', () => {
    const title = '記事タイトル';
    const h3List = ['h3見出し1', 'h3見出し2', 'h3見出し3'];
    const blogPost: BlogPost = createBlogPost(title, [], h3List);
    blogPost.getH3List().forEach((h3, index) => {
      expect(h3.getText()).toBe(h3List[index]);
      expect(h3.getLevel()).toBe(3);
    });
  });

  it('段落を生成できる', () => {
    const title = '記事タイトル';
    const paragraphList = ['段落1', '段落2', '段落3'];
    const blogPost: BlogPost = createBlogPost(title, [], [], paragraphList);
    expect(blogPost.getParagraphList()).toEqual(paragraphList);
  })
});
