export type ViewBlogPost = {
  readonly title: string;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<{
    readonly id: number;
    readonly value: string;
    readonly type: string;
  }>;
};
