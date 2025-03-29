import type { BlogPostDTOForCreate } from '../../../../usecases/create/createBlogPost';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';

export function formDataToDTO(
  formData: CreateBlogPostFormData,
): Omit<BlogPostDTOForCreate, 'contents'> {
  return {
    title: formData.title,
    thumbnail: formData.thumbnail,
  };
}
