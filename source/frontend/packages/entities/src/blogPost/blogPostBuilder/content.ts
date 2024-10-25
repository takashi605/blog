import type { Content, ContentType } from '../../blogPost/postContents/content';

export class ContentBuilder {
  private type: ContentType;
  private contentValue: string;

  constructor(input: { type: ContentType; contentValue: string }) {
    this.type = input.type;
    this.contentValue = input.contentValue;
  }

  createContent(id: number): Content {
    return {
      getId: () => id,
      getValue: () => this.contentValue,
      getType: () => this.type,
    };
  }
}
