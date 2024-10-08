export type ViewBlogPost = {
  getTitle: () => string;
  getContents: () => {
    getId: () => number;
    getValue: () => string;
    getType: () => string;
  }[];
};
