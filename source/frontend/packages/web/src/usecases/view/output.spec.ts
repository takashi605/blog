import { createViewBlogPostDTO } from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost/blogPost';
import { createBlogPost } from 'entities/src/blogPost/blogPost';
import {
  ContentType,
  createContent,
} from 'entities/src/blogPost/postContents/content';

describe('DTO の生成', () => {
  it('ファクトリ関数を使って DTO を生成する', () => {
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
      .addContent(paragraph1)
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02');

    const dto = createViewBlogPostDTO(blogPost);
    expect(dto.title).toBe('記事タイトル');
    expect(dto.contents.length).toBe(3);

    expect(dto.contents[0].id).toBe(1);
    expect(dto.contents[0].value).toBe('h2見出し');
    expect(dto.contents[0].type).toBe('h2');

    expect(dto.contents[1].id).toBe(2);
    expect(dto.contents[1].value).toBe('h3見出し');
    expect(dto.contents[1].type).toBe('h3');

    expect(dto.contents[2].id).toBe(3);
    expect(dto.contents[2].value).toBe('段落');
    expect(dto.contents[2].type).toBe('paragraph');

    expect(dto.postDate).toEqual('2021/01/01');
    expect(dto.lastUpdateDate).toEqual('2021/01/02');
  });

  it('投稿日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(() => createViewBlogPostDTO(blogPost)).toThrow(
      '投稿日が存在しない記事を生成しようとしました',
    );
  });

  it('最終更新日が存在しない記事を生成しようとするとエラーが発生する', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title).setPostDate('2021-01-01');
    expect(() => createViewBlogPostDTO(blogPost)).toThrow(
      '最終更新日が存在しない記事を生成しようとしました',
    );
  });
});
