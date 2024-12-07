import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { BlogPostDTOBuilder } from 'service/src/blogPostService/dto/blogPostDTOBuilder';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class ViewLatestBlogPostsUseCase {
  private blogPostRepository: BlogPostRepository;
  private quantity: number | undefined = undefined;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    console.log('quantity:', this.quantity);
    const fetchedData = await this.blogPostRepository.fetchLatests(this.quantity);
    const blogPosts = fetchedData.map((dto) => {
      return blogPostDTOToEntity(dto);
    });
    const blogPostDTOs = blogPosts.map((blogPost) => {
      return new BlogPostDTOBuilder(blogPost).build();
    });
    return blogPostDTOs;
  }

  setQuantity(quantity: number | undefined): ViewLatestBlogPostsUseCase {
    this.quantity = quantity;
    return this;
  }
}
