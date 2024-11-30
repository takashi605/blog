import { BlogPost } from 'entities/src/blogPost/index';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import { BlogPostDTOBuilder } from '.';

describe('DTO の生成', () => {
  it('builder クラスを使って DTO を生成できる', () => {
    const title = '記事タイトル';
    const thumbnailPath = 'path/to/image';
    const h2 = new H2('1', 'h2見出し');
    const h3 = new H3('2', 'h3見出し');
    const paragraph1 = new Paragraph('3', '段落');
    const blogPost = new BlogPost('1', title)
      .setThumbnail(thumbnailPath)
      .addContent(h2)
      .addContent(h3)
      .addContent(paragraph1)
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02');

    const builder = new BlogPostDTOBuilder(blogPost);
    const dto = builder.build();

    expect(dto.title).toBe('記事タイトル');

    expect(dto.thumbnail.path).toBe('path/to/image');

    expect(dto.contents.length).toBe(3);

    const h2DTO = dto.contents[0];
    if (h2DTO.type === 'h2') {
      expect(h2DTO.id).toBe('1');
      expect(h2DTO.text).toBe('h2見出し');
      expect(h2DTO.type).toBe('h2');
    } else {
      fail('h2 DTO が生成されていません');
    }

    const h3DTO = dto.contents[1];
    if (h3DTO.type === 'h3') {
      expect(h3DTO.id).toBe('2');
      expect(h3DTO.text).toBe('h3見出し');
      expect(h3DTO.type).toBe('h3');
    } else {
      fail('h3 DTO が生成されていません');
    }

    const pDTO = dto.contents[2];
    if (pDTO.type === 'paragraph') {
      expect(pDTO.id).toBe('3');
      expect(pDTO.text).toBe('段落');
      expect(pDTO.type).toBe('paragraph');
    } else {
      fail('段落 DTO が生成されていません');
    }

    expect(dto.postDate).toEqual('2021/01/01');
    expect(dto.lastUpdateDate).toEqual('2021/01/02');
  });

  it('投稿日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost('1', title)
      .setThumbnail('path/to/image')
      .setLastUpdateDate('2021-01-02');
    expect(() => new BlogPostDTOBuilder(blogPost).build()).toThrow(
      '投稿日が存在しない記事を生成しようとしました',
    );
  });

  it('最終更新日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost('1', title)
      .setThumbnail('path/to/image')
      .setPostDate('2021-01-01');
    expect(() => new BlogPostDTOBuilder(blogPost).build()).toThrow(
      '最終更新日が存在しない記事を生成しようとしました',
    );
  });

  it('サムネイル画像が存在しない記事を生成しようとするとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost = new BlogPost('1', title)
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02');
    expect(() => new BlogPostDTOBuilder(blogPost).build()).toThrow(
      'サムネイル画像が存在しない記事を生成しようとしました',
    );
  });
});
