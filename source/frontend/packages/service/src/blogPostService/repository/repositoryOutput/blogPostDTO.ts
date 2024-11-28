import type { ContentForDTO } from './contentDTO';

export type BlogPostDTO = {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: thumbnailDTO;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentForDTO>;
};

export type thumbnailDTO = {
  readonly path: string;
};
