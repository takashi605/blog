import type { ImageDTO } from '../../ImageService/dto/imageDTO';
import type { ContentDTO } from './contentDTO';

export type BlogPostDTO = {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: ImageDTO;
  postDate: string;
  lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentDTO>;
};
