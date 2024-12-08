import type { BlogPost } from 'entities/src/blogPost';
import { blogPostDTOToEntity } from '../dto/blogPostDTOToEntity';
import type { BlogPostRepository } from '../repository/blogPostRepository';

export class PopularPostSelector {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async getPopularPosts(quantity: number | undefined): Promise<BlogPost[]> {
    const popularPostsDTO =
      await this.blogPostRepository.fetchPopularPosts(quantity);
    const popularPostsEntity: BlogPost[] = popularPostsDTO.map((dto) =>
      blogPostDTOToEntity(dto),
    );
    return popularPostsEntity;
  }
}
