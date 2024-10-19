import {
  createContentByInput,
  type ContentInput,
} from '@/usecases/view/input/content';
import { BlogPost } from 'entities/src/blogPost/index';
import { ContentType } from 'entities/src/blogPost/postContents/content';

export type ViewBlogPostInput = {
  getPostTitle: () => string;
  setPostTitle: (postTitle: string) => ViewBlogPostInput;

  getContents: () => ContentInput[];
  addH2: (contentValue: string) => ViewBlogPostInput;
  addH3: (contentValue: string) => ViewBlogPostInput;
  addParagraph: (contentValue: string) => ViewBlogPostInput;

  getPotsDate: () => string;
  setPostDate: (postDate: string) => ViewBlogPostInput;

  getLastUpdateDate: () => string;
  setLastUpdateDate: (lastUpdateDate: string) => ViewBlogPostInput;

  injectionContentsTo: (blogPost: BlogPost) => void;
  generateBlogPost: () => BlogPost;
};

export const createViewBlogPostInput = (): ViewBlogPostInput => {
  let postTitle = '';
  let postDate = '';
  let lastUpdateDate = '';
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

    getLastUpdateDate() {
      return lastUpdateDate;
    },
    setLastUpdateDate(newLastUpdateDate: string) {
      lastUpdateDate = newLastUpdateDate;
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
      const blogPost = new BlogPost(postTitle);
      this.injectionContentsTo(blogPost);
      blogPost.setPostDate(postDate);
      blogPost.setLastUpdateDate(lastUpdateDate);
      return blogPost;
    },
  };
};

export class BlogPostBuilder {
  private postTitle = '';
  private postDate = '';
  private lastUpdateDate = '';
  private contents: ContentInput[] = [];

  setPostTitle(postTitle: string) {
    this.postTitle = postTitle;
    return this;
  }

  setPostDate(postDate: string) {
    this.postDate = postDate;
    return this;
  }

  setLastUpdateDate(lastUpdateDate: string) {
    this.lastUpdateDate = lastUpdateDate;
    return this;
  }

  addH2(contentValue: string) {
    this.contents.push({ type: ContentType.H2, contentValue });
    return this;
  }

  addH3(contentValue: string) {
    this.contents.push({ type: ContentType.H3, contentValue });
    return this;
  }

  addParagraph(contentValue: string) {
    this.contents.push({ type: ContentType.Paragraph, contentValue });
    return this;
  }

  injectionContentsTo(blogPost: BlogPost) {
    this.contents.forEach((content) => {
      blogPost.addContent(
        createContentByInput(blogPost.getContents().length + 1, content),
      );
    });
  }

  build() {
    const blogPost = new BlogPost(this.postTitle)
      .setPostDate(this.postDate)
      .setLastUpdateDate(this.lastUpdateDate);
    this.injectionContentsTo(blogPost);
    return blogPost;
  }
}
