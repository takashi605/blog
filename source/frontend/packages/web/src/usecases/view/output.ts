export type ViewBlogPostOutput = {
  getTitle: () => string;
  getContents: () => {
    getId: () => number;
    getText: () => string;
    getType: () => string;
  }[];
};
