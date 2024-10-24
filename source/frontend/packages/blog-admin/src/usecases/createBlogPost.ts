import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

export class BlogPostCreator {
  private builder: BlogPostBuilder;
  constructor(builder: BlogPostBuilder) {
    this.builder = builder;
  }

  buildBlogPost(): BlogPost {
    // YYYY-MM-DD形式の日付を取得
    // TODO 日付のフォーマットを共通化する
    const today = new Date().toISOString().split('T')[0];
    const builder = this.builder.setPostDate(today).setLastUpdateDate(today);

    return builder.build();
  }
}
