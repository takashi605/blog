import type { BlogPostDTOForCreate } from '../../../../usecases/create/createBlogPost';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';

export function typedBlogPostWithoutContentsToDTO(
  blogPost: CreateBlogPostFormData,
): Omit<BlogPostDTOForCreate, 'contents'> {
  return {
    title: blogPost.title,
    thumbnail: { path: 'path/to/thumbnail' },
  };
}
