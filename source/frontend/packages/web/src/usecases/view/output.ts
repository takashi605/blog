export type ViewBlogPost = {
  getTitle: () => string;
  getContents: () => {
    getId: () => number;
    getText: () => string;
    getType: () => string;
  }[];
};
