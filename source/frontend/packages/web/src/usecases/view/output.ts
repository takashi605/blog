export type ViewBlogPostOutput = {
  postTitle: {
    getText: () => string;
    getLevel: () => number;
  };
  getContents: () => {
    getId: () => number;
    getText: () => string;
    getType: () => string;
  }[];
};
