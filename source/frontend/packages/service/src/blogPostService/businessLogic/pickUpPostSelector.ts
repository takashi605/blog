import type { BlogPost } from 'entities/src/blogPost';
import { blogPostDTOToEntity } from '../dto/blogPostDTOToEntity';
import type { BlogPostRepository } from '../repository/blogPostRepository';

export class PickUpPostSelector {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async getPickUpPosts(quantity: number): Promise<BlogPost[]> {
    const pickUpPostsDTO =
      await this.blogPostRepository.fetchPickUpPosts(quantity);
    const pickUpPostsEntity: BlogPost[] = pickUpPostsDTO.map((dto) =>
      blogPostDTOToEntity(dto),
    );
    return pickUpPostsEntity;
  }
}
