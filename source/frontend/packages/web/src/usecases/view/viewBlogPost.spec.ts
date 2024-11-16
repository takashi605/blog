import type { ViewBlogPostDTO } from '@/usecases/view/output/dto/index';
import { ViewBlogPostUseCase } from '@/usecases/view/viewBlogPost';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const blogPostBuilder = createBlogPostBuilder()
      .setId(1)
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1')
      .addH3(4, 'h3見出し2')
      .addParagraph(5, '段落2');

    const blogPostDTO: ViewBlogPostDTO = new ViewBlogPostUseCase(
      blogPostBuilder,
    ).execute();

    expect(blogPostDTO.title).toBe('記事タイトル');

    expect(blogPostDTO.postDate).toEqual('2021/01/01');
    expect(blogPostDTO.lastUpdateDate).toEqual('2021/01/02');

    const contents = blogPostDTO.contents;
    expect(contents.length).toBe(5);

    if (contents[0].type === 'h2') {
      expect(contents[0].id).toBe(1);
      expect(contents[0].text).toBe('h2見出し1');
      expect(contents[0].type).toBe('h2');
    } else {
      fail('h2 DTO が生成されていません');
    }

    if (contents[1].type === 'h3') {
      expect(contents[1].id).toBe(2);
      expect(contents[1].text).toBe('h3見出し1');
      expect(contents[1].type).toBe('h3');
    } else {
      fail('h3 DTO が生成されていません');
    }

    if (contents[2].type === 'paragraph') {
      expect(contents[2].id).toBe(3);
      expect(contents[2].text).toBe('段落1');
      expect(contents[2].type).toBe('paragraph');
    } else {
      fail('段落 DTO が生成されていません');
    }

    if (contents[3].type === 'h3') {
      expect(contents[3].id).toBe(4);
      expect(contents[3].text).toBe('h3見出し2');
      expect(contents[3].type).toBe('h3');
    } else {
      fail('h3 DTO が生成されていません');
    }

    if (contents[4].type === 'paragraph') {
      expect(contents[4].id).toBe(5);
      expect(contents[4].text).toBe('段落2');
      expect(contents[4].type).toBe('paragraph');
    } else {
      fail('段落 DTO が生成されていません');
    }
  });
});
