import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class ViewPopularPostUseCase {
  private blogPostRepository: BlogPostRepository;
  private quantity: number = 1;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  setQuantity(quantity: number): ViewPopularPostUseCase {
    this.quantity = quantity;
    return this;
  }

  async execute() {
    const fetchedDTO = await this.blogPostRepository.fetchPopularPosts(
      this.quantity,
    );
    return fetchedDTO;
  }
}
