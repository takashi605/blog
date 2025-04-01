import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class SelectPopularPostsUseCase {
  private newPopularPosts: BlogPostDTO[];
  private repository: BlogPostRepository;

  constructor(blogPostsDTO: BlogPostDTO[], repository: BlogPostRepository) {
    this.newPopularPosts = blogPostsDTO;
    this.repository = repository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const blogPostsEntity = this.newPopularPosts.map((blogPostDTO) => {
      return blogPostDTOToEntity(blogPostDTO);
    });
    const createdBlogPost =
      await this.repository.updatePopularPosts(blogPostsEntity);
    return createdBlogPost;
  }
}
