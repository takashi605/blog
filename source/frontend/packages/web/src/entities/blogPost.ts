export type Heading = {
  text: string;
  level: number;
};

export type BlogPost = {
  title: Heading;
};

export const createBlogPost = (title: Heading): BlogPost => {
  return {
    title,
  };
};
