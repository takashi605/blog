import { BlogPost } from 'entities/src/blogPost/index';
import { mockBlogPost } from 'entities/src/mockData/blogPost/mockBlogPost';
import { BlogPostDTOBuilder } from '.';

describe('DTO の生成', () => {
  it('builder クラスを使って DTO を生成できる', () => {
    const blogPost = new mockBlogPost('1').successfulMock();

    const builder = new BlogPostDTOBuilder(blogPost);
    const dto = builder.build();

    expect(dto.title).toBeDefined();

    expect(dto.thumbnail.path).toBeDefined();

    expect(dto.contents.length).toBeGreaterThan(0);

    const h2DTO = dto.contents[0];
    if (h2DTO.type === 'h2') {
      expect(h2DTO.id).toBeDefined();
      expect(h2DTO.text).toBeDefined();
      expect(h2DTO.type).toBe('h2');
    } else {
      fail('h2 DTO が生成されていません');
    }

    const h3DTO = dto.contents[1];
    if (h3DTO.type === 'h3') {
      expect(h3DTO.id).toBeDefined();
      expect(h3DTO.text).toBeDefined();
      expect(h3DTO.type).toBe('h3');
    } else {
      fail('h3 DTO が生成されていません');
    }

    const pDTO = dto.contents[2];
    if (pDTO.type === 'paragraph') {
      expect(pDTO.id).toBeDefined();
      expect(pDTO.text).toBeDefined();
      expect(pDTO.type).toBe('paragraph');
    } else {
      fail('段落 DTO が生成されていません');
    }

    expect(dto.postDate).toEqual('2021/01/01');
    expect(dto.lastUpdateDate).toEqual('2021/01/02');
  });

  it('投稿日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const blogPost = new mockBlogPost('1').unsetPostDateMock();
    expect(() => new BlogPostDTOBuilder(blogPost).build()).toThrow(
      '投稿日が存在しない記事を生成しようとしました',
    );
  });

  it('最終更新日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const blogPost = new mockBlogPost('1').unsetLastUpdateDateMock();

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
