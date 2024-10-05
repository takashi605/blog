import { createH1, createH2 } from "./postContants/heading";
import type { Heading } from "./postContants/heading";

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getH2List: () => Heading[];
};

export const createBlogPost = (initialTitle: string, initialH2List:string[]): BlogPost => {
  // setter 等が必要になった時のために title を変数に保持しておく
  const title = createH1(initialTitle);
  const h2List = initialH2List.map((h2) => createH2(h2));

  return {
    getTitleText: () => title.getText(),
    getTitleLevel: () => title.getLevel(),
    getH2List: () => h2List,
  };
};
