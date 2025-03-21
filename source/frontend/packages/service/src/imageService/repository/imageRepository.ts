import type { Image } from 'entities/src/blogPost/image';
import type { ImageDTO } from '../dto/imageDTO';

export type ImageRepository = {
  save(image: Image): Promise<ImageDTO>;
};
