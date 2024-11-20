import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from './repositoryOutput/blogPostDTO';

export type BlogPostRepository = {
  save(blogPost: BlogPost): Promise<BlogPostDTO>;
  fetch(id: string): Promise<BlogPostDTO>;
};
