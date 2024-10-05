export type Input = {
  postTitle: string;
};

export type Output = {
  postTitle: string;
};

export const createBlogPost = (input: Input): Output => {
  return {
    postTitle: input.postTitle,
  };
};
