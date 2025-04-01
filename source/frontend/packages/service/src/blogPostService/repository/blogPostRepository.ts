import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from '../dto/blogPostDTO';

export type BlogPostRepository = {
  save(blogPost: BlogPost): Promise<BlogPostDTO>;
  fetch(id: string): Promise<BlogPostDTO>;
  fetchLatests: (quantity: number | undefined) => Promise<BlogPostDTO[]>;
  fetchTopTechPick: () => Promise<BlogPostDTO>;
  // TODO undefined を許容する
  fetchPickUpPosts: (quantity: number) => Promise<BlogPostDTO[]>;
  fetchPopularPosts: (quantity: number | undefined) => Promise<BlogPostDTO[]>;
  updatePickUpPosts: (pickUpPosts: BlogPost[]) => Promise<BlogPostDTO[]>;
};
