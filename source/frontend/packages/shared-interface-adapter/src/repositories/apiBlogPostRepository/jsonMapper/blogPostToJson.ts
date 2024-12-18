import type { BlogPost } from 'entities/src/blogPost';
import { BlogPostDTOBuilder } from 'service/src/blogPostService/dto/blogPostDTOBuilder';

export function blogPostToJson(blogPost: BlogPost): string {
  const dtoBuilder = new BlogPostDTOBuilder(blogPost);
  const dto = dtoBuilder.build();
  return JSON.stringify(dto);
}
