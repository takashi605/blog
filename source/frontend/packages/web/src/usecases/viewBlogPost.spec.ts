import { input } from '@testing-library/user-event/dist/cjs/event/input.js';
import type { ViewBlogPostInput, ViewBlogPostOutput } from './viewBlogPost';
import { viewBlogPost } from './viewBlogPost';
import exp from 'constants';

describe('ユースケース: 投稿記事の閲覧', () => {
  // it('【旧】記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
  //   const input: ViewBlogPostInput = {
  //     postTitle: '記事タイトル',
  //     h2List: ['h2見出し1', 'h2見出し2', 'h2見出し3'],
  //     h3List: ['h3見出し1', 'h3見出し2', 'h3見出し3'],
  //     paragraphList: ['段落1', '段落2', '段落3'],
  //     contents: []
  //   };

  //   const output: ViewBlogPostOutput = viewBlogPost(input);

  //   // 記事タイトル(h1 見出し)
  //   expect(output.postTitle.getText()).toBe('記事タイトル');
  //   expect(output.postTitle.getLevel()).toBe(1);

  //   // h2 見出し
  //   output.getH2List().forEach((h2, index) => {
  //     expect(h2.getText()).toBe(input.h2List[index]);
  //     expect(h2.getLevel()).toBe(2);
  //   });

  //   // h3 見出し
  //   output.getH3List().forEach((h3, index) => {
  //     expect(h3.getText()).toBe(input.h3List[index]);
  //     expect(h3.getLevel()).toBe(3);
  //   });

  //   // 段落
  //   output.getParagraphList().forEach((paragraph, index) => {
  //     expect(paragraph.getText()).toBe(input.paragraphList[index]);
  //   });
  // });

  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const input: ViewBlogPostInput = {
      postTitle: '記事タイトル',
      h2List: [],
      h3List: [],
      paragraphList: [],
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
