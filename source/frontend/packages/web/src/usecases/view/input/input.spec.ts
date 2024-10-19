import {
  BlogPostBuilder,
  createViewBlogPostInput,
} from '@/usecases/view/input/input';

const createInputForTest = () => {
  return createViewBlogPostInput()
    .setPostTitle('記事タイトル')
    .setPostDate('2021-01-01')
    .setLastUpdateDate('2021-01-02')
    .addH2('h2見出し1')
    .addH3('h3見出し1')
    .addParagraph('段落1')
    .addH3('h3見出し2')
    .addParagraph('段落2');
};

describe('【旧】ユースケース: 投稿記事生成のための入力値', () => {
  it('BlogPost エンティティを生成できる', () => {
    const input = createInputForTest();
    const blogPost = input.generateBlogPost();

    expect(blogPost.getTitleText()).toBe('記事タイトル');

    const expectedPostDate = new Date('2021-01-01');
    expect(blogPost.getPostDate()).toEqual(expectedPostDate);

    const expectedLastUpdateDate = new Date('2021-01-02');
    expect(blogPost.getLastUpdateDate()).toEqual(expectedLastUpdateDate);

    expect(blogPost.getContents().length).toBe(5);
    contentsEqualsInputData();

    function contentsEqualsInputData() {
      blogPost.getContents().forEach((content, index) => {
        const contentForInput = input.getContents()[index];
        expect(content.getValue()).toBe(contentForInput.contentValue);
        expect(content.getType()).toBe(contentForInput.type);
      });
    }
  });
});

describe('ユースケース: 投稿記事を生成するビルダークラス', () => {
  it('BlogPost エンティティを生成できる', () => {
    // createViewBlogPostInput()
    //   .setPostTitle('記事タイトル')
    //   .setPostDate('2021-01-01')
    //   .setLastUpdateDate('2021-01-02')
    //   .addH2('h2見出し1')
    //   .addH3('h3見出し1')
    //   .addParagraph('段落1')
    //   .addH3('h3見出し2')
    //   .addParagraph('段落2');
    // const input = createInputForTest();
    // const blogPost = input.generateBlogPost();

    const builder = new BlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02');
    const blogPost = builder.build();

    expect(blogPost.getTitleText()).toBe('記事タイトル');

    const expectedPostDate = new Date('2021-01-01');
    expect(blogPost.getPostDate()).toEqual(expectedPostDate);

    const expectedLastUpdateDate = new Date('2021-01-02');
    expect(blogPost.getLastUpdateDate()).toEqual(expectedLastUpdateDate);

    // expect(blogPost.getContents().length).toBe(5);
    // contentsEqualsInputData();

    // function contentsEqualsInputData() {
    //   blogPost.getContents().forEach((content, index) => {
    //     const contentForInput = input.getContents()[index];
    //     expect(content.getValue()).toBe(contentForInput.contentValue);
    //     expect(content.getType()).toBe(contentForInput.type);
    //   });
    // }
  });
});
