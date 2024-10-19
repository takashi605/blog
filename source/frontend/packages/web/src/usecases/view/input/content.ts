import type {
  Content,
  ContentType,
} from 'entities/src/blogPost/postContents/content';

export type ContentForBlogPostBuilder = {
  type: ContentType;
  contentValue: string;
};

export const createContentForBlogPostBuilder = (
  id: number,
  input: ContentForBlogPostBuilder,
): Content => {
  return {
    getId: () => id,
    getValue: () => input.contentValue,
    getType: () => input.type,
  };
};
