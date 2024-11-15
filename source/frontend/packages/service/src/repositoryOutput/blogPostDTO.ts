export type BlogPostDTO = {
  title: string;
  postDate: string;
  lastUpdateDate: string;
  contents: {
    type: string;
    text: string;
  }[];
};
