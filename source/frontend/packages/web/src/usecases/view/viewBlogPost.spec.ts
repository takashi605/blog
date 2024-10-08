import { createViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const input = createViewBlogPostInput()
      .setPostTitle('記事タイトル')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1')
      .addH3('h3見出し2')
      .addParagraph('段落2');

    const output: ViewBlogPost = viewBlogPost(input);

    expect(output.getTitle()).toBe('記事タイトル');

    const contents = output.getContents();
    expect(contents.length).toBe(5);

    expect(contents[0].getId()).toBe(1);
    expect(contents[0].getValue()).toBe('h2見出し1');
    expect(contents[0].getType()).toBe('h2');

    expect(contents[1].getId()).toBe(2);
    expect(contents[1].getValue()).toBe('h3見出し1');
    expect(contents[1].getType()).toBe('h3');

    expect(contents[2].getId()).toBe(3);
    expect(contents[2].getValue()).toBe('段落1');
    expect(contents[2].getType()).toBe('paragraph');

    expect(contents[3].getId()).toBe(4);
    expect(contents[3].getValue()).toBe('h3見出し2');
    expect(contents[3].getType()).toBe('h3');

    expect(contents[4].getId()).toBe(5);
    expect(contents[4].getValue()).toBe('段落2');
    expect(contents[4].getType()).toBe('paragraph');
    expect(contents[4].getType()).toBe('paragraph');
  });
});
