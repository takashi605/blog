import type { ViewBlogPostInput, ViewBlogPostOutput } from './viewBlogPost';
import { viewBlogPost } from './viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const input: ViewBlogPostInput = {
      postTitle: '記事タイトル',
      contents: [
        {
          type: 'h2',
          contentValue: 'h2見出し1',
        },
        {
          type: 'h3',
          contentValue: 'h3見出し1',
        },
        {
          type: 'paragraph',
          contentValue: '段落1',
        },
        {
          type: 'h3',
          contentValue: 'h3見出し2',
        },
        {
          type: 'paragraph',
          contentValue: '段落2',
        },
      ],
    };

    const output: ViewBlogPostOutput = viewBlogPost(input);

    expect(output.postTitle.getText()).toBe('記事タイトル');

    const contents = output.getContents();
    expect(contents.length).toBe(5);

    expect(contents[0].getId()).toBe(1);
    expect(contents[0].getText()).toBe('h2見出し1');
    expect(contents[0].getType()).toBe('h2');

    expect(contents[1].getId()).toBe(2);
    expect(contents[1].getText()).toBe('h3見出し1');
    expect(contents[1].getType()).toBe('h3');

    expect(contents[2].getId()).toBe(3);
    expect(contents[2].getText()).toBe('段落1');
    expect(contents[2].getType()).toBe('paragraph');

    expect(contents[3].getId()).toBe(4);
    expect(contents[3].getText()).toBe('h3見出し2');
    expect(contents[3].getType()).toBe('h3');

    expect(contents[4].getId()).toBe(5);
    expect(contents[4].getText()).toBe('段落2');
    expect(contents[4].getType()).toBe('paragraph');
    expect(contents[4].getType()).toBe('paragraph');
  });
});
