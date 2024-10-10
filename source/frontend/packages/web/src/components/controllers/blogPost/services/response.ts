export type BlogPostResponse = {
  id: number;
  title: string;
  contents: {
    type: string;
    value: string;
  }[];
};
