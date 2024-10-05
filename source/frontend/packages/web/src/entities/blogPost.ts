export type Heading = {
  text: string;
  level: number;
};

export type BlogPost = {
  getTitle: () => string;
};

export const createBlogPost = (initialTitle: Heading): BlogPost => {
  // setter 等が必要になった時のために title を変数に保持しておく
  const title = initialTitle;

  return {
    getTitle: () => title.text,
  };
};
