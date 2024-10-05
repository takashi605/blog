import { createH1, type Heading } from "./postContants/heading";

export type BlogPost = {
  getTitle: () => string;
};

export const createBlogPost = (initialTitle: string): BlogPost => {
  // setter 等が必要になった時のために title を変数に保持しておく
  const title = createH1(initialTitle);

  return {
    getTitle: () => title.getText(),
  };
};
