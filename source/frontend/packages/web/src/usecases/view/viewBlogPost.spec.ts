import { ViewBlogPostUseCase } from '@/usecases/view/viewBlogPost';
import { createBlogPostBuilder } from 'service/src/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('【旧】記事のデータを入力値として受け取り、ブログ記事の構造として返却する', () => {
    const id = createUUIDv4();
    const blogPostBuilder = createBlogPostBuilder()
      .setId(id)
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1')
      .addH3(4, 'h3見出し2')
      .addParagraph(5, '段落2');

    const blogPostDTO: BlogPostDTO = new ViewBlogPostUseCase(
      blogPostBuilder,
    ).old__execute();

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

  it('データリポジトリからデータを取得し、ブログ記事の構造として返却する', async () => {
    const id = createUUIDv4();
    const fetchedDTOMock = {
      id,
      title: '記事タイトル',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: { path: 'path/to/thumbnail' },
      contents: [
        { id: 1, type: 'h2', text: 'h2見出し1' },
        { id: 2, type: 'h3', text: 'h3見出し1' },
        { id: 3, type: 'paragraph', text: '段落1' },
        { id: 4, type: 'h3', text: 'h3見出し2' },
        { id: 5, type: 'paragraph', text: '段落2' },
      ],
    };
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn().mockReturnValue(fetchedDTOMock),
    };

    const viewBlogPostUsecase = new ViewBlogPostUseCase(
      createBlogPostBuilder(), // TODO 削除する
      mockRepository,
    );

    // TODO UUID で取得するように変更
    const blogPostDTO = await viewBlogPostUsecase.execute('1');
    expect(blogPostDTO).toEqual({
      ...fetchedDTOMock,
      postDate: '2021/01/01',
      lastUpdateDate: '2021/01/02',
    });
  });
});
