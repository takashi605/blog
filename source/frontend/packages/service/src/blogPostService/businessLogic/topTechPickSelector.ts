import { fetchedDataToEntity } from '../dto/blogPostDTOToEntity';
import type { BlogPostRepository } from '../repository/blogPostRepository';

export class TopTechPickSelector {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute() {
    const fetchedDTO = await this.blogPostRepository.fetchTopTechPick();
    return fetchedDataToEntity(fetchedDTO);
  }
}
