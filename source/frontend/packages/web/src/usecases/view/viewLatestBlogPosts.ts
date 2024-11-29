import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { BlogPostDTOBuilder } from './output/dto';

export class ViewLatestBlogPostsUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const fetchedData = await this.blogPostRepository.fetchLatests();
    const blogPosts = fetchedData.map((dto) => {
      return blogPostDTOToEntity(dto);
    });
    const blogPostDTOs = blogPosts.map((blogPost) => {
      return new BlogPostDTOBuilder(blogPost).build();
    });
    return blogPostDTOs;
  }
}
