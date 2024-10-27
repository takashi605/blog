import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import { BlogPostCreator } from '@/usecases/create/createBlogPost';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

export const createBlogPostFormSchema = z.object({
  title: z.string(),
  contents: z
    .object({
      type: z.enum(['h2', 'h3', 'paragraph']),
      text: z.string(),
    })
    .array(),
});

export type CreateBlogPostFormData = z.infer<typeof createBlogPostFormSchema>;

export const createBlogPostAction: SubmitHandler<
  CreateBlogPostFormData
> = async (formData) => {
  const blogPostBuilder = createBlogPostBuilder()
    .setPostTitle(formData.title)

  formData.contents.forEach((content) => {
    if (content.type === 'h2') {
      blogPostBuilder.addH2(content.text);
    } else if (content.type === 'h3') {
      blogPostBuilder.addH3(content.text);
    } else if (content.type === 'paragraph') {
      blogPostBuilder.addParagraph(content.text);
    }
  });

  const blogPostRepository = new ApiBlogPostRepository();
  const blogPostCreator = new BlogPostCreator(
    blogPostBuilder,
    blogPostRepository,
  );
  await blogPostCreator.execute();
};
