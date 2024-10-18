import { createBlogPost, n__BlogPost, type BlogPost } from './index';
import { ContentType, createContent } from './postContents/content';

describe('エンティティ: 投稿記事', () => {
  it('記事タイトルを生成できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(blogPost.getTitleText()).toBe(title);
    expect(blogPost.getTitleLevel()).toBe(1);
  });

  it('コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const title = '記事タイトル';
    const h2 = createContent({
      id: 1,
      type: ContentType.H2,
      value: 'h2見出し',
    });
    const h3 = createContent({
      id: 2,
      type: ContentType.H3,
      value: 'h3見出し',
    });
    const paragraph1 = createContent({
      id: 3,
      type: ContentType.Paragraph,
      value: '段落',
    });
    const blogPost: BlogPost = createBlogPost(title)
      .addContent(h2)
      .addContent(h3)
      .addContent(paragraph1);
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    expect(contents[0].getValue()).toBe('h2見出し');
    expect(contents[0].getType()).toBe('h2');
    expect(contents[0].getId()).toBe(1);

    expect(contents[1].getValue()).toBe('h3見出し');
    expect(contents[1].getType()).toBe('h3');
    expect(contents[1].getId()).toBe(2);

    expect(contents[2].getValue()).toBe('段落');
    expect(contents[2].getType()).toBe('paragraph');
    expect(contents[2].getId()).toBe(3);
  });

  it('記事の投稿日付を取得できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021-01-01';
    blogPost.setPostDate(date);
    expect(blogPost.getPostDate()).toEqual(new Date(date));
  });

  it('記事の投稿日付が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(() => blogPost.getPostDate()).toThrow('投稿日が設定されていません');
  });

  it('記事の最終更新日を取得できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021-01-01';
    blogPost.setLastUpdateDate(date);
    expect(blogPost.getLastUpdateDate()).toEqual(new Date(date));
  });

  it('記事の最終更新日が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(() => blogPost.getLastUpdateDate()).toThrow(
      '最終更新日が設定されていません',
    );
  });

  it('YYYY-MM-DD の形式ではない文字列で日付を生成すると EntityError が発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021/01/01';
    expect(() => blogPost.setPostDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => blogPost.setLastUpdateDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });
});

describe('【旧】エンティティ: 投稿記事', () => {
  it('記事タイトルを生成できる', () => {
    const title = '記事タイトル';
    const blogPost = new n__BlogPost(title);
    expect(blogPost.getTitleText()).toBe(title);
    expect(blogPost.getTitleLevel()).toBe(1);
  });

  it.skip('コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const title = '記事タイトル';
    const h2 = createContent({
      id: 1,
      type: ContentType.H2,
      value: 'h2見出し',
    });
    const h3 = createContent({
      id: 2,
      type: ContentType.H3,
      value: 'h3見出し',
    });
    const paragraph1 = createContent({
      id: 3,
      type: ContentType.Paragraph,
      value: '段落',
    });
    const blogPost: BlogPost = createBlogPost(title)
      .addContent(h2)
      .addContent(h3)
      .addContent(paragraph1);
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    expect(contents[0].getValue()).toBe('h2見出し');
    expect(contents[0].getType()).toBe('h2');
    expect(contents[0].getId()).toBe(1);

    expect(contents[1].getValue()).toBe('h3見出し');
    expect(contents[1].getType()).toBe('h3');
    expect(contents[1].getId()).toBe(2);

    expect(contents[2].getValue()).toBe('段落');
    expect(contents[2].getType()).toBe('paragraph');
    expect(contents[2].getId()).toBe(3);
  });

  it.skip('記事の投稿日付を取得できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021-01-01';
    blogPost.setPostDate(date);
    expect(blogPost.getPostDate()).toEqual(new Date(date));
  });

  it.skip('記事の投稿日付が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(() => blogPost.getPostDate()).toThrow('投稿日が設定されていません');
  });

  it.skip('記事の最終更新日を取得できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021-01-01';
    blogPost.setLastUpdateDate(date);
    expect(blogPost.getLastUpdateDate()).toEqual(new Date(date));
  });

  it.skip('記事の最終更新日が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(() => blogPost.getLastUpdateDate()).toThrow(
      '最終更新日が設定されていません',
    );
  });

  it.skip('YYYY-MM-DD の形式ではない文字列で日付を生成すると EntityError が発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021/01/01';
    expect(() => blogPost.setPostDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => blogPost.setLastUpdateDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });
});
