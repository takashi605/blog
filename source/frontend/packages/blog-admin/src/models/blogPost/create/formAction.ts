'use server';
import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import { BlogPostCreator } from '@/usecases/create/createBlogPost';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

export const createBlogPostAction = async () => {
  const blogPostBuilder = createBlogPostBuilder()
    .setPostTitle('記事タイトル')
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
