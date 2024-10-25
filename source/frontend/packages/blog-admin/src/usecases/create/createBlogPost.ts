import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

export type BlogPostRepository = {
  save(blogPost: BlogPost): void;
};

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

  private buildJson(): string {
    const blogPost = this.buildBlogPost();

    return JSON.stringify({
      title: blogPost.getTitleText(),
      postDate: blogPost.getPostDate().toISOString().split('T')[0],
      lastUpdateDate: blogPost.getLastUpdateDate().toISOString().split('T')[0],
      contents: blogPost.getContents().map((content) => {
        return {
          type: content.getType(),
          text: content.getValue(),
        };
      }),
    });
  }

  execute(): void {
    const blogPost = this.buildBlogPost();
    this.repository.save(blogPost);
  }
}
