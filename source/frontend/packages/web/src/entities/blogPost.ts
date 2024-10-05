import { createH1 } from "./postContants/heading";

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
};

export const createBlogPost = (initialTitle: string): BlogPost => {
  // setter 等が必要になった時のために title を変数に保持しておく
  const title = createH1(initialTitle);

  return {
    getTitleText: () => title.getText(),
    getTitleLevel: () => title.getLevel(),
  };
};
