import type { BlogPostRepository } from '../repository/blogPostRepository';

export class TopTechPickSelector {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute() {
    return this.blogPostRepository.fetchTopTechPick();
  }
}
