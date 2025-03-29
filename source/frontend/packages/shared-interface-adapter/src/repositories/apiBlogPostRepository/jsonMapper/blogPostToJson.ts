import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { BlogPostDTOBuilder } from 'service/src/blogPostService/dto/blogPostDTOBuilder';

export function blogPostToJson(blogPost: BlogPost): string {
  const dto = convertDTO(blogPost);
  return JSON.stringify(dto);
}

export function blogPostsToJson(blogPosts: BlogPost[]): string {
  const dto = blogPosts.map((blogPost) => convertDTO(blogPost));
  return JSON.stringify(dto);
}

function convertDTO(blogPost: BlogPost): BlogPostDTO {
  const dtoBuilder = new BlogPostDTOBuilder(blogPost);
  const dto = dtoBuilder.build();
  // TODO postDate のフォーマット変換タイミングがここでいいのか検討
  // TODO 可能であれば readonly なプロパティに戻す
  dto.postDate = dto.postDate.replaceAll('/', '-');
  dto.lastUpdateDate = dto.lastUpdateDate.replaceAll('/', '-');

  return dto;
}
