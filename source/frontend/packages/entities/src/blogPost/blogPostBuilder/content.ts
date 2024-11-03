import {
  createContent,
  type Content,
  type ContentType,
} from '../../blogPost/postContents/content';

export class ContentBuilder {
  private type: ContentType;
  private contentValue: string;

  constructor(input: { type: ContentType; contentValue: string }) {
    this.type = input.type;
    this.contentValue = input.contentValue;
  }

  build(id: number): Content {
    return createContent({ id, type: this.type, value: this.contentValue });
  }
}
