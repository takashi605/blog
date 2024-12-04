import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from '../dto/blogPostDTO';

export type BlogPostRepository = {
  save(blogPost: BlogPost): Promise<BlogPostDTO>;
  fetch(id: string): Promise<BlogPostDTO>;
  fetchLatests: () => Promise<BlogPostDTO[]>;
  fetchTopTechPick: () => Promise<BlogPostDTO>;
  fetchPickUpPosts: (quantity: number) => Promise<BlogPostDTO[]>;
};
