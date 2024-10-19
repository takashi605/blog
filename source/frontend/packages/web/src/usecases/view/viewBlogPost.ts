import type { BlogPostBuilder } from '@/usecases/entityBuilder/index';
import {
  BlogPostDTOBuilder,
  type ViewBlogPostDTO,
} from '@/usecases/view/output/dto';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (
  blogPostBuilder: BlogPostBuilder,
): ViewBlogPostDTO => {
  const blogPost: BlogPost = blogPostBuilder.build();

  const dto = new BlogPostDTOBuilder(blogPost).build();
  return dto;
};
