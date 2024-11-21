import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';

export class ViewLatestBlogPostsUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const fetchedData = await this.blogPostRepository.fetchLatests();
    return fetchedData;
  }
}
