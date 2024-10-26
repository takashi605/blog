import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import { BlogPostCreator } from '@/usecases/create/createBlogPost';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type { FormEvent } from 'react';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';

const createBlogPostFormDataSchema = z.object({
  title: z.string(),
});

export const createBlogPostAction = async (event: FormEvent) => {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const submission = parseWithZod(formData, {
    schema: createBlogPostFormDataSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const blogPostBuilder = createBlogPostBuilder()
    .setPostTitle(submission.value.title)
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
