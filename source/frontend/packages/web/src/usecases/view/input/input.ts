import { ContentType } from '@/entities/postContants/content';
import type { ContentInput } from './content';

export type ViewBlogPostInput = {
  getPostTitle: () => string;
  getContents: () => ContentInput[];
  addH2: (contentValue: string) => ViewBlogPostInput;
  addH3: (contentValue: string) => ViewBlogPostInput;
  addParagraph: (contentValue: string) => ViewBlogPostInput;
  setPostTitle: (postTitle: string) => ViewBlogPostInput;
};

export const createViewBlogPostInput = (): ViewBlogPostInput => {
  let postTitle = '';
  const contents: ContentInput[] = [];

  return {
    getPostTitle: () => postTitle,
    getContents: () => contents,
    addH2(contentValue: string) {
      contents.push({ type: ContentType.H2, contentValue });
      return this;
    },
    addH3(contentValue: string) {
      contents.push({ type: ContentType.H3, contentValue });
      return this;
    },
    addParagraph(contentValue: string) {
      contents.push({ type: ContentType.Paragraph, contentValue });
      return this;
    },
    setPostTitle(newPostTitle: string) {
      postTitle = newPostTitle;
      return this;
    },
  };
};
