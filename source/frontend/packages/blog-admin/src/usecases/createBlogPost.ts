import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

export class BlogPostCreator {
  private builder: BlogPostBuilder;
  constructor(builder: BlogPostBuilder) {
    this.builder = builder;
  }
}
