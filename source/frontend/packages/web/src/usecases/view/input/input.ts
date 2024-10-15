import {
  createContentByInput,
  type ContentInput,
} from '@/usecases/view/input/content';
import { createBlogPost, type BlogPost } from 'entities/src/blogPost';
import { ContentType } from 'entities/src/postContents/content';

export type ViewBlogPostInput = {
  getPostTitle: () => string;
  setPostTitle: (postTitle: string) => ViewBlogPostInput;

  getContents: () => ContentInput[];
  addH2: (contentValue: string) => ViewBlogPostInput;
  addH3: (contentValue: string) => ViewBlogPostInput;
  addParagraph: (contentValue: string) => ViewBlogPostInput;

  getPotsDate: () => string;
  setPostDate: (postDate: string) => ViewBlogPostInput;

  injectionContentsTo: (blogPost: BlogPost) => void;
  generateBlogPost: () => BlogPost;
};

export const createViewBlogPostInput = (): ViewBlogPostInput => {
  let postTitle = '';
  let postDate = '';
  const contents: ContentInput[] = [];

  return {
    getPostTitle: () => postTitle,
    setPostTitle(newPostTitle: string) {
      postTitle = newPostTitle;
      return this;
    },
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
    getPotsDate() {
      return postDate;
    },
    setPostDate(newPostDate: string) {
      postDate = newPostDate;
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
      blogPost.setPostDate(postDate);
      return blogPost;
    },
  };
};
