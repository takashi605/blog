import {
  BlogPostDTOBuilder,
  type ViewBlogPostDTO,
} from '@/usecases/view/output/dto/index';
import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder/index';

export class ViewBlogPostUseCase {
  private blogPostBuilder: BlogPostBuilder;

  constructor(blogPostBuilder: BlogPostBuilder) {
    this.blogPostBuilder = blogPostBuilder;
  }

  execute(): ViewBlogPostDTO {
    const blogPost: BlogPost = this.blogPostBuilder.build();

    const dto = new BlogPostDTOBuilder(blogPost).build();
    return dto;
  }
}
