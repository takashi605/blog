import { BlogPost } from './index';
import { H2, H3 } from './postContents/heading';
import { Paragraph } from './postContents/paragraph';

describe('エンティティ: 投稿記事', () => {
  it('記事タイトルを生成できる', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    expect(blogPost.getTitleText()).toBe(title);
  });

  it('メインビジュアルを持っている', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    const imagePath = 'path/to/image';
    blogPost.setMainVisual(imagePath);
    expect(blogPost.getMainVisual().path).toBe(imagePath);
  });

  it('コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const title = '記事タイトル';
    const h2 = new H2(1, 'h2見出し');
    const h3 = new H3(2, 'h3見出し');
    const paragraph1 = new Paragraph(3, '段落');
    const blogPost = new BlogPost(title)
      .addContent(h2)
      .addContent(h3)
      .addContent(paragraph1);
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    // TODO 一時的に不適切な定数化をしているので、後で修正する
    const h2Content = contents[0] as H2;
    expect(h2Content.getValue()).toBe('h2見出し');
    expect(h2Content.getType()).toBe('h2');
    expect(h2Content.getId()).toBe(1);

    const h3Content = contents[1] as H2;
    expect(h3Content.getValue()).toBe('h3見出し');
    expect(h3Content.getType()).toBe('h3');
    expect(h3Content.getId()).toBe(2);

    const pContent = contents[2] as H2;
    expect(pContent.getValue()).toBe('段落');
    expect(pContent.getType()).toBe('paragraph');
    expect(pContent.getId()).toBe(3);
  });

  it('記事の投稿日付を取得できる', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    const date = '2021-01-01';
    blogPost.setPostDate(date);
    expect(blogPost.getPostDate()).toEqual(new Date(date));
  });

  it('記事の投稿日付が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    expect(() => blogPost.getPostDate()).toThrow('投稿日が設定されていません');
  });

  it('記事の最終更新日を取得できる', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    const date = '2021-01-01';
    blogPost.setLastUpdateDate(date);
    expect(blogPost.getLastUpdateDate()).toEqual(new Date(date));
  });

  it('記事の最終更新日が空の時に取得するとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    expect(() => blogPost.getLastUpdateDate()).toThrow(
      '最終更新日が設定されていません',
    );
  });

  it('YYYY-MM-DD の形式ではない文字列で日付を生成すると EntityError が発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost(title);
    const date = '2021/01/01';
    expect(() => blogPost.setPostDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => blogPost.setLastUpdateDate(date)).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });
});
