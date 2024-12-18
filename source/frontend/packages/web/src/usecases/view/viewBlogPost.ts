import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { BlogPostDTOBuilder } from 'service/src/blogPostService/dto/blogPostDTOBuilder';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class ViewBlogPostUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(id: string): Promise<BlogPostDTO> {
    const fetchedData = await this.blogPostRepository.fetch(id);
    const entity = blogPostDTOToEntity(fetchedData);
    const dto = new BlogPostDTOBuilder(entity).build();
    return dto;
  }
}
