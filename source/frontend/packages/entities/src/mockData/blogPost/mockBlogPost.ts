import { BlogPost } from '../../blogPost';
import { Code } from '../../blogPost/postContents/code';
import { H2, H3 } from '../../blogPost/postContents/heading';
import { ImageContent } from '../../blogPost/postContents/image';
import { Paragraph } from '../../blogPost/postContents/paragraph';
import { RichText, RichTextPart } from '../../blogPost/postContents/richText';

// blogPost の mock データを生成するクラス
// 注意：タイトルは '記事タイトル' + id となる(記事タイトル1, 記事タイトル2, ...)
export class MockBlogPost {
  public mockParts: MockBlogPostParts;
  private id: string;

  constructor(id: string) {
    this.id = id;
    this.mockParts = new MockBlogPostParts(id);
  }

  successfulMock(): BlogPost {
    return this.mockBase()
      .setThumbnail(
        this.mockParts.getMockThumbnailId(),
        this.mockParts.getMockThumbnailPath(),
      )
      .setPostDate(this.mockParts.getMockPostDate())
      .setLastUpdateDate(this.mockParts.getMockLastUpdateDate());
  }

  unsetPostDateMock(): BlogPost {
    return this.mockBase()
      .setThumbnail(
        this.mockParts.getMockThumbnailId(),
        this.mockParts.getMockThumbnailPath(),
      )
      .setLastUpdateDate(this.mockParts.getMockLastUpdateDate());
  }

  unsetLastUpdateDateMock(): BlogPost {
    return this.mockBase()
      .setThumbnail(
        this.mockParts.getMockThumbnailId(),
        this.mockParts.getMockThumbnailPath(),
      )
      .setPostDate(this.mockParts.getMockPostDate());
  }

  unsetThumbnailMock(): BlogPost {
    return this.mockBase()
      .setPostDate(this.mockParts.getMockPostDate())
      .setLastUpdateDate(this.mockParts.getMockLastUpdateDate());
  }

  private mockBase(): BlogPost {
    return new BlogPost(this.id, this.mockParts.getMockTitle())
      .addContent(this.mockParts.getMockH2())
      .addContent(this.mockParts.getMockH3())
      .addContent(this.mockParts.getMockParagraph())
      .addContent(this.mockParts.getMockImageContent())
      .addContent(this.mockParts.getMockCode());
  }
}

// blogPost の各構成要素の mock
class MockBlogPostParts {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public getMockPostDate(): string {
    return '2021-01-01';
  }

  public getMockLastUpdateDate(): string {
    return '2021-01-02';
  }

  // id が連結されるので注意
  public getMockTitle(): string {
    return `記事タイトル${this.id}`;
  }

  public getMockThumbnailId(): string {
    return '535c8105-fd92-47b7-93ce-dc01b379ae66';
  }

  public getMockThumbnailPath(): string {
    return 'path/to/image';
  }

  public getMockH2(): H2 {
    return new H2('1', 'h2見出し');
  }

  public getMockH3(): H3 {
    return new H3('2', 'h3見出し');
  }

  public getMockParagraph(): Paragraph {
    return new Paragraph('3', mockRichText());
  }

  public getMockImageContent(): ImageContent {
    return new ImageContent('4', 'path/to/image');
  }

  public getMockCode(): Code {
    return new Code(
      '5',
      'サンプルコード',
      'console.log("Hello, World!");',
      'javascript',
    );
  }
}

export function mockRichText() {
  return new RichText([new RichTextPart('段落')]);
}
