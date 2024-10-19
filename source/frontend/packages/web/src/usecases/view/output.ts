import { formatDate2DigitString } from '@/utils/date';
import type { BlogPost } from 'entities/src/blogPost/index';

export type ViewBlogPostDTO = {
  readonly title: string;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<{
    readonly id: number;
    readonly value: string;
    readonly type: string;
  }>;
};

export class BlogPostDTOBuilder {
  private blogPost: BlogPost;

  constructor(blogPost: BlogPost) {
    this.blogPost = blogPost;
  }

  private extractPostDateForDTO(): string {
    try {
      return formatDate2DigitString(this.blogPost.getPostDate());
    } catch {
      throw new Error('投稿日が存在しない記事を生成しようとしました');
    }
  }

  private extractLastUpdateDateForDTO(): string {
    try {
      return formatDate2DigitString(this.blogPost.getLastUpdateDate());
    } catch {
      throw new Error('最終更新日が存在しない記事を生成しようとしました');
    }
  }

  private extractContentsForDTO(): ViewBlogPostDTO['contents'] {
    return this.blogPost.getContents().map((content, index) => {
      return {
        id: index + 1,
        value: content.getValue(),
        type: content.getType(),
      };
    });
  }

  build(): ViewBlogPostDTO {
    return {
      title: this.blogPost.getTitleText(),
      postDate: this.extractPostDateForDTO(),
      lastUpdateDate: this.extractLastUpdateDateForDTO(),
      contents: this.extractContentsForDTO(),
    };
  }
}
