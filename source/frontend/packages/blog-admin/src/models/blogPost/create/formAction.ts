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
    .addH2('h2見出し1')
    .addH3('h3見出し1')
    .addParagraph('段落1');

  const blogPostRepository = new ApiBlogPostRepository();
  const blogPostCreator = new BlogPostCreator(
    blogPostBuilder,
    blogPostRepository,
  );
  await blogPostCreator.execute();
};
