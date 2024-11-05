import { UsecaseError } from '@/usecases/error';
import type { ContentForDTO } from '@/usecases/view/output/dto/contentForDTO';
import { formatDate2DigitString } from '@/utils/date';
import type { BlogPost } from 'entities/src/blogPost/index';
import type { Content } from 'entities/src/blogPost/postContents/content';

export type ViewBlogPostDTO = {
  readonly title: string;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentForDTO>;
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
      throw new UsecaseError('投稿日が存在しない記事を生成しようとしました');
    }
  }

  private extractLastUpdateDateForDTO(): string {
    try {
      return formatDate2DigitString(this.blogPost.getLastUpdateDate());
    } catch {
      throw new UsecaseError(
        '最終更新日が存在しない記事を生成しようとしました',
      );
    }
  }

  private extractContentsForDTO(): ViewBlogPostDTO['contents'] {
    return this.blogPost
      .getContents()
      .map((content) => this.createContentForDTO(content));
  }

  private createContentForDTO(content: Content): ContentForDTO {
    return {
      id: content.getId(),
      text: content.getValue(),
      type: content.getType(),
    };
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
