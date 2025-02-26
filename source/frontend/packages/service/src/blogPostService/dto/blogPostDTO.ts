import type { ContentDTO } from './contentDTO';

export type BlogPostDTO = {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: thumbnailDTO;
  postDate: string;
  lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentDTO>;
};

export type thumbnailDTO = {
  readonly id: string;
  readonly path: string;
};
