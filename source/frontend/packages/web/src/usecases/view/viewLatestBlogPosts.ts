import type { BlogPostRepository } from 'service/src/blogPostService/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostService/blogPostRepository/repositoryOutput/blogPostDTO';
import { fetchedDataToEntity } from 'service/src/blogPostService/blogPostRepository/repositoryOutput/blogPostDTOToEntity';
import { BlogPostDTOBuilder } from './output/dto';

export class ViewLatestBlogPostsUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const fetchedData = await this.blogPostRepository.fetchLatests();
    const blogPosts = fetchedData.map((dto) => {
      return fetchedDataToEntity(dto);
    });
    const blogPostDTOs = blogPosts.map((blogPost) => {
      return new BlogPostDTOBuilder(blogPost).build();
    });
    return blogPostDTOs;
  }
}
