import { mockBlogPost } from '../mockData/blogPost/mockBlogPost';
import { BlogPost } from './index';
import type { H2, H3 } from './postContents/heading';
import type { Paragraph } from './postContents/paragraph';
import { RichText, RichTextPart } from './postContents/richText';

describe('エンティティ: 投稿記事', () => {
  it('id と記事タイトルを渡すと記事データを生成できる', () => {
    const blogPost = new mockBlogPost('1').successfulMock();
    expect(blogPost.getId()).toBe('1');
    expect(blogPost.getTitleText()).toBe('記事タイトル1');
  });

  it('サムネイル画像を持っている', () => {
    const blogPost = new mockBlogPost('1').successfulMock();
    const imagePath = 'path/to/image';
    blogPost.setThumbnail(imagePath);

    const thumbnail = blogPost.getThumbnail();
    expect(thumbnail.getPath()).toBe(imagePath);
  });

  it('コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const blogPost = new mockBlogPost('1').successfulMock();
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    const h2Content = contents[0] as H2;
    expect(h2Content.getValue()).toBe('h2見出し');
    expect(h2Content.getType()).toBe('h2');
    expect(h2Content.getId()).toBe('1');

    const h3Content = contents[1] as H3;
    expect(h3Content.getValue()).toBe('h3見出し');
    expect(h3Content.getType()).toBe('h3');
    expect(h3Content.getId()).toBe('2');

    const pContent = contents[2] as Paragraph;
    expect(pContent.getValue()).toEqual(
      new RichText([new RichTextPart('段落')]),
    );
    expect(pContent.getType()).toBe('paragraph');
    expect(pContent.getId()).toBe('3');
  });

  it('記事の投稿日付を取得できる', () => {
    const blogPost = new mockBlogPost('1').successfulMock();
    expect(blogPost.getPostDate()).toEqual(new Date('2021-01-01'));
  });

  it('記事の投稿日付が空の時に取得するとエラーが発生する', () => {
    const blogPost = new mockBlogPost('1').unsetPostDateMock();

    expect(() => blogPost.getPostDate()).toThrow('投稿日が設定されていません');
  });

  it('記事の最終更新日を取得できる', () => {
    const blogPost = new mockBlogPost('1').successfulMock();
    expect(blogPost.getLastUpdateDate()).toEqual(new Date('2021-01-02'));
  });

  it('記事の最終更新日が空の時に取得するとエラーが発生する', () => {
    const blogPost = new mockBlogPost('1').unsetLastUpdateDateMock();
    expect(() => blogPost.getLastUpdateDate()).toThrow(
      '最終更新日が設定されていません',
    );
  });

  it('YYYY-MM-DD の形式ではない文字列で日付を生成すると EntityError が発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost('1', title);
    expect(() => blogPost.setPostDate('2021/01/01')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => blogPost.setLastUpdateDate('2021/01/01')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });
});
