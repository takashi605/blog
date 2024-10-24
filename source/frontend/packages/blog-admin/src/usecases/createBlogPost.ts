import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

export class BlogPostCreator {
  private builder: BlogPostBuilder;
  constructor(builder: BlogPostBuilder) {
    this.builder = builder;
  }

  buildBlogPost(): BlogPost {
    return this.builder.build();
  }
}
