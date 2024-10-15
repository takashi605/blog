import {
  createContentByInput,
  type ContentInput,
} from '@/usecases/view/input/content';
import { createBlogPost, type BlogPost } from 'entities/src/blogPost';
import { ContentType } from 'entities/src/postContents/content';

export type ViewBlogPostInput = {
  getPostTitle: () => string;
  getContents: () => ContentInput[];
  addH2: (contentValue: string) => ViewBlogPostInput;
  addH3: (contentValue: string) => ViewBlogPostInput;
  addParagraph: (contentValue: string) => ViewBlogPostInput;
  setPostTitle: (postTitle: string) => ViewBlogPostInput;
  injectionContentsTo: (blogPost: BlogPost) => void;
  generateBlogPost: () => BlogPost;
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
    injectionContentsTo(blogPost: BlogPost) {
      contents.forEach((content) => {
        blogPost.addContent(
          createContentByInput(blogPost.getContents().length + 1, content),
        );
      });
    },
    generateBlogPost() {
      const blogPost = createBlogPost(postTitle);
      this.injectionContentsTo(blogPost);
      return blogPost;
    },
  };
};
