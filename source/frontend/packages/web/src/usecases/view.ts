export type Input = {
  blogTitle: string;
}

export type Output = {
  blogTitle: string;
};

export const createBlogPost = (input: Input): Output => {
  return {
    blogTitle: input.blogTitle,
  }
}
