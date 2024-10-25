import {
  BlogPostDTOBuilder,
  type ViewBlogPostDTO,
} from '@/usecases/view/output/dto';
import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder/index';

export const viewBlogPost = (
  blogPostBuilder: BlogPostBuilder,
): ViewBlogPostDTO => {
  const blogPost: BlogPost = blogPostBuilder.build();

  const dto = new BlogPostDTOBuilder(blogPost).build();
  return dto;
};
