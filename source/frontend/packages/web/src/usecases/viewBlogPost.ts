export type ViewBlogPostInput = {
  postTitle: string;
};

export type ViewBlogPostOutput = {
  postTitle: string;
};

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  return {
    postTitle: input.postTitle,
  };
};
