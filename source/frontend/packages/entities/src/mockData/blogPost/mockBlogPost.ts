import { BlogPost } from '../../blogPost';
import { H2, H3 } from '../../blogPost/postContents/heading';
import { ImageContent } from '../../blogPost/postContents/image';
import { Paragraph } from '../../blogPost/postContents/paragraph';
import { RichText, RichTextPart } from '../../blogPost/postContents/richText';

// blogPost の mock データを生成するクラス
// 注意：タイトルは '記事タイトル' + id となる(記事タイトル1, 記事タイトル2, ...)
export class mockBlogPost {
  public mockParts: mockBlogPostParts;
  private id: string;

  constructor(id: string) {
    this.id = id;
    this.mockParts = new mockBlogPostParts(id);
  }

  public successfulMock(): BlogPost {
    return this.mockBase()
      .setPostDate(this.mockParts.getMockPostDate())
      .setLastUpdateDate(this.mockParts.getMockLastUpdateDate());
  }

  public unsetPostDateMock(): BlogPost {
    return this.mockBase().setLastUpdateDate(
      this.mockParts.getMockLastUpdateDate(),
    );
  }

  public unsetLastUpdateDateMock(): BlogPost {
    return this.mockBase().setPostDate(this.mockParts.getMockPostDate());
  }

  mockBase(): BlogPost {
    return new BlogPost(this.id, this.mockParts.getMockTitle())
      .setThumbnail(this.mockParts.getMockThumbnailPath())
      .addContent(this.mockParts.getMockH2())
      .addContent(this.mockParts.getMockH3())
      .addContent(this.mockParts.getMockParagraph())
      .addContent(this.mockParts.getMockImageContent());
  }
}

// blogPost の各構成要素の mock
class mockBlogPostParts {
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
    return new ImageContent('1', 'path/to/image');
  }
}

export function mockRichText() {
  return new RichText([new RichTextPart('段落')]);
}
