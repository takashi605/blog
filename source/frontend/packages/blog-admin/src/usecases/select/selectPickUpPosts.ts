import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class SelectPickUpPostsUseCase {
  private newPickUpPostsDTO: BlogPostDTO[];
  private repository: BlogPostRepository;

  constructor(blogPostsDTO: BlogPostDTO[], repository: BlogPostRepository) {
    this.newPickUpPostsDTO = blogPostsDTO;
    this.repository = repository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const blogPostsEntity = this.newPickUpPostsDTO.map((blogPostDTO) => {
      return blogPostDTOToEntity(blogPostDTO);
    });
    const createdBlogPost =
      await this.repository.updatePickUpPosts(blogPostsEntity);
    return createdBlogPost;
  }
}
