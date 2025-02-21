import type { BlogPostDTOForCreate } from '../../../../usecases/create/createBlogPost';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';

export function typedBlogPostWithoutContentsToDTO(
  blogPost: CreateBlogPostFormData,
): Omit<BlogPostDTOForCreate, 'contents'> {
  return {
    title: blogPost.title,
    thumbnail: {
      id:'535c8105-fd92-47b7-93ce-dc01b379ae66',
      path: 'path/to/thumbnail'
    },
  };
}
