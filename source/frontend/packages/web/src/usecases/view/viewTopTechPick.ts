import { TopTechPickSelector } from 'service/src/blogPostService/businessLogic/topTechPickSelector';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { BlogPostDTOBuilder } from './output/dto';

export class ViewTopTechPickUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute() {
    const selector = new TopTechPickSelector(this.blogPostRepository);
    const entity = await selector.execute();
    const dto = new BlogPostDTOBuilder(entity).build();
    return dto;
  }
}
