import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class ViewPickUpPostUseCase {
  private blogPostRepository: BlogPostRepository;
  private quantity: number = 1;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  setQuantity(quantity: number): ViewPickUpPostUseCase {
    this.quantity = quantity;
    return this;
  }

  async execute() {
    const fetchedDTO = await this.blogPostRepository.fetchPickUpPosts(
      this.quantity,
    );
    return fetchedDTO;
  }
}
