import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type {
  BlogPostRepository,
  CreatedBlogPost,
} from 'service/src/blogPostRepository';

export class BlogPostCreator {
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

  async execute(): Promise<CreatedBlogPost> {
    const blogPost = this.buildBlogPost();
    const createdBlogPost = await this.repository.save(blogPost);
    return createdBlogPost;
  }
}
