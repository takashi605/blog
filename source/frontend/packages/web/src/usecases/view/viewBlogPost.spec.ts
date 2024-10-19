import { BlogPostBuilder } from '@/usecases/entityBuilder/index';
import type { ViewBlogPostDTO } from '@/usecases/view/output/dto';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const input = new BlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1')
      .addH3('h3見出し2')
      .addParagraph('段落2');

    const output: ViewBlogPostDTO = viewBlogPost(input);

    expect(output.title).toBe('記事タイトル');

    expect(output.postDate).toEqual('2021/01/01');
    expect(output.lastUpdateDate).toEqual('2021/01/02');

    const contents = output.contents;
    expect(contents.length).toBe(5);

    expect(contents[0].id).toBe(1);
    expect(contents[0].value).toBe('h2見出し1');
    expect(contents[0].type).toBe('h2');

    expect(contents[1].id).toBe(2);
    expect(contents[1].value).toBe('h3見出し1');
    expect(contents[1].type).toBe('h3');

    expect(contents[2].id).toBe(3);
    expect(contents[2].value).toBe('段落1');
    expect(contents[2].type).toBe('paragraph');

    expect(contents[3].id).toBe(4);
    expect(contents[3].value).toBe('h3見出し2');
    expect(contents[3].type).toBe('h3');

    expect(contents[4].id).toBe(5);
    expect(contents[4].value).toBe('段落2');
    expect(contents[4].type).toBe('paragraph');
  });
});
