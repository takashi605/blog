import type { Image } from 'entities/src/blogPost/image';

export function imageToJson(image: Image): string {
  return JSON.stringify({
    id: image.getId(),
    path: image.getPath(),
  });
}
