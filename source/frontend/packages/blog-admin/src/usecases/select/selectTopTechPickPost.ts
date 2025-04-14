import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class SelectTopTechPickPostUseCase {
  private newTopTechPickPost: BlogPostDTO;
  private repository: BlogPostRepository;

  constructor(blogPostDTO: BlogPostDTO, repository: BlogPostRepository) {
    this.newTopTechPickPost = blogPostDTO;
    this.repository = repository;
  }

  async execute(): Promise<BlogPostDTO> {
    const blogPostEntity = blogPostDTOToEntity(this.newTopTechPickPost);
    const createdBlogPost =
      await this.repository.updateTopTechPickPost(blogPostEntity);
    return createdBlogPost;
  }
}
