export type blogPost = {
  title: string;
};

export const createBlogPost = (title: string): blogPost => {
  return {
    title,
  };
};
