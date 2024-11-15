import type { ContentForDTO } from './contentToDTO/types';

export type BlogPostDTO = {
  readonly title: string;
  readonly thumbnail: thumbnailDTO;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentForDTO>;
};

export type thumbnailDTO = {
  readonly path: string;
};
