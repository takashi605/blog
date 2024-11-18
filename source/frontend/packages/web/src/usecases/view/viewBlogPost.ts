import {
  BlogPostDTOBuilder,
  type ViewBlogPostDTO,
} from '@/usecases/view/output/dto/index';
import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'service/src/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostRepository';

export class ViewBlogPostUseCase {
  private blogPostBuilder: BlogPostBuilder | null;
  private blogPostRepository: BlogPostRepository | null;

  constructor(
    blogPostBuilder: BlogPostBuilder | null = null,
    blogPostRepository: BlogPostRepository | null = null,
  ) {
    this.blogPostBuilder = blogPostBuilder;
    this.blogPostRepository = blogPostRepository;
  }

  old__execute(): ViewBlogPostDTO {
    const blogPost: BlogPost = this.blogPostBuilder!.build();

    const dto = new BlogPostDTOBuilder(blogPost).build();
    return dto;
  }

  async execute(id: string): Promise<ViewBlogPostDTO> {
    if (this.blogPostRepository === null) {
      throw new Error('Repository is not set');
    }

    const blogPostDTO = await this.blogPostRepository.fetch(id);
    return blogPostDTO;
  }
}
