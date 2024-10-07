export type ViewBlogPostInput = {
  getPostTitle: () => string;
  getContents: () => { type: string; contentValue: string }[];
  addH2: (contentValue: string) => ViewBlogPostInput;
  addH3: (contentValue: string) => ViewBlogPostInput;
  addParagraph: (contentValue: string) => ViewBlogPostInput;
  setPostTitle: (postTitle: string) => ViewBlogPostInput;
};

export const createViewBlogPostInput = (): ViewBlogPostInput => {
  let postTitle = '';
  const contents: {
    type: string;
    contentValue: string;
  }[] = [];

  return {
    getPostTitle: () => postTitle,
    getContents: () => contents,
    addH2(contentValue: string) {
      contents.push({ type: 'h2', contentValue });
      return this;
    },
    addH3(contentValue: string) {
      contents.push({ type: 'h3', contentValue });
      return this;
    },
    addParagraph(contentValue: string) {
      contents.push({ type: 'paragraph', contentValue });
      return this;
    },
    setPostTitle(newPostTitle: string) {
      postTitle = newPostTitle;
      return this;
    },
  };
};
