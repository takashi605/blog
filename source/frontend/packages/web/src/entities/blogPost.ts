export type BlogPost = {
  title: string;
};

export const createBlogPost = (title: string): BlogPost => {
  return {
    title,
  };
};
