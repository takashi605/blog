export type ViewBlogPost = {
  title: string;
  getContents: () => {
    getId: () => number;
    getValue: () => string;
    getType: () => string;
  }[];
};
