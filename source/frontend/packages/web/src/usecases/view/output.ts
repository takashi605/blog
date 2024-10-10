export type ViewBlogPost = {
  title: string;
  contents: {
    id: number;
    value: string;
    type: string;
  }[];
};
