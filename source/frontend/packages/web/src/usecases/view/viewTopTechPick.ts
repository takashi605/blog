import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { TopTechPickSelector } from 'service/src/blogPostService/businessLogic/topTechPickSelector';

export class ViewTopTechPickUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute() {
    const selector = new TopTechPickSelector(this.blogPostRepository);
    return await selector.execute();
  }
}
