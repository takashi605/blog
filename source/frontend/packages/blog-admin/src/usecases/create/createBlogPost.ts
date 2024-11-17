import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'service/src/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';

export class CreateBlogPostUseCase {
  private builder: BlogPostBuilder;
  private repository: BlogPostRepository;

  constructor(builder: BlogPostBuilder, repository: BlogPostRepository) {
    this.builder = builder;
    this.repository = repository;
  }

  buildBlogPost(): BlogPost {
    // YYYY-MM-DD形式の日付を取得
    // TODO 日付のフォーマットを共通化する
    const today = new Date().toISOString().split('T')[0];
    const builder = this.builder.setPostDate(today).setLastUpdateDate(today);

    return builder.build();
  }

  async execute(): Promise<BlogPostDTO> {
    const blogPost = this.buildBlogPost();
    const createdBlogPost = await this.repository.save(blogPost);
    return createdBlogPost;
  }
}
