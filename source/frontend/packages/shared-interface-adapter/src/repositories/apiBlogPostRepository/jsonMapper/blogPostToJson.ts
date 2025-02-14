import type { BlogPost } from 'entities/src/blogPost';
import { BlogPostDTOBuilder } from 'service/src/blogPostService/dto/blogPostDTOBuilder';

export function blogPostToJson(blogPost: BlogPost): string {
  const dtoBuilder = new BlogPostDTOBuilder(blogPost);
  const dto = dtoBuilder.build();
  // TODO postDate のフォーマット変換タイミングがここでいいのか検討
  // TODO 可能であれば readonly なプロパティに戻す
  dto.postDate = dto.postDate.replaceAll('/', '-');
  dto.lastUpdateDate = dto.lastUpdateDate.replaceAll('/', '-');
  return JSON.stringify(dto);
}
