import { BlogPost } from '../../blogPost';
import { H2, H3 } from '../../blogPost/postContents/heading';
import { Paragraph } from '../../blogPost/postContents/paragraph';
import { RichText, RichTextPart } from '../../blogPost/postContents/richText';

// blogPost の mock データを生成するクラス
export class mockBlogPost {
  public mockParts: mockBlogPostParts;
  private id: string;

  constructor(id: string) {
    this.id = id;
    this.mockParts = new mockBlogPostParts(id);
  }

  public getMock(): BlogPost {
    return new BlogPost(this.id, this.mockParts.getMockTitle())
      .setThumbnail(this.mockParts.getMockImagePath())
      .setPostDate(this.mockParts.getMockPostDate())
      .setLastUpdateDate(this.mockParts.getMockLastUpdateDate())
      .addContent(this.mockParts.getMockH2())
      .addContent(this.mockParts.getMockH3())
      .addContent(this.mockParts.getMockParagraph());
  }
}

// 各構成要素の mock
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

  public getMockTitle(): string {
    return `記事タイトル${this.id}`;
  }

  public getMockH2(): H2 {
    return new H2('1', 'h2見出し');
  }

  public getMockH3(): H3 {
    return new H3('2', 'h3見出し');
  }

  public getMockParagraph(): Paragraph {
    return new Paragraph('3', new RichText([new RichTextPart('段落')]));
  }

  public getMockImagePath(): string {
    return 'path/to/image';
  }
}
