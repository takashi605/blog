import type { BlogPostRepository } from '../repository/blogPostRepository';
import { fetchedDataToEntity } from '../repository/repositoryOutput/blogPostDTOToEntity';

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
