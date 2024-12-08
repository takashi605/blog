import type { BlogPostRepository } from '../blogPostService/repository/blogPostRepository';

export const mockBlogPostRepository: BlogPostRepository = {
  save: jest.fn(),
  fetch: jest.fn(),
  fetchLatests: jest.fn(),
  fetchTopTechPick: jest.fn(),
  fetchPickUpPosts: jest.fn(),
  fetchPopularPosts: jest.fn(),
};
