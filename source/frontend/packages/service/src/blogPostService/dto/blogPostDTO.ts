import type { ImageDTO } from '../../imageService/dto/imageDTO';
import type { ContentDTO } from './contentDTO';

export type BlogPostDTO = {
  id: string;
  title: string;
  thumbnail: ImageDTO;
  postDate: string;
  lastUpdateDate: string;
  contents: ContentDTO[];
};
