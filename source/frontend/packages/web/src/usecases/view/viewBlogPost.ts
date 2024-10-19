import type { BlogPostBuilder } from '@/usecases/view/input/input';
import {
  createViewBlogPostDTO,
  type ViewBlogPostDTO,
} from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (
  blogPostBuilder: BlogPostBuilder,
): ViewBlogPostDTO => {
  const blogPost: BlogPost = blogPostBuilder.build();

  const dto = createViewBlogPostDTO(blogPost);
  return dto;
};
