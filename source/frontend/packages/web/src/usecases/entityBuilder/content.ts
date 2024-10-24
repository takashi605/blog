import type {
  Content,
  ContentType,
} from 'entities/src/blogPost/postContents/content';

export type ContentForBlogPostBuilder = {
  type: ContentType;
  contentValue: string;
};

export const createContent = (
  id: number,
  input: ContentForBlogPostBuilder,
): Content => {
  return {
    getId: () => id,
    getValue: () => input.contentValue,
    getType: () => input.type,
  };
};

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
