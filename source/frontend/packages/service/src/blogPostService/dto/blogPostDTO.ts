import type { ContentDTO } from './contentDTO';

export type BlogPostDTO = {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: thumbnailDTO;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentDTO>;
};

export type thumbnailDTO = {
  readonly path: string;
};
