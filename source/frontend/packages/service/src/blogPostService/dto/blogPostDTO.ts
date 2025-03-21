import type { ContentDTO } from './contentDTO';

export type BlogPostDTO = {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: ImageDTO;
  postDate: string;
  lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentDTO>;
};

export type ImageDTO = {
  readonly id: string;
  readonly path: string;
};
