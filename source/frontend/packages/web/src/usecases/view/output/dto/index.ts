import { UsecaseError } from '@/usecases/error';
import { createContentToDTOContext } from '@/usecases/view/output/dto/contentToDTO';
import type { ContentForDTO } from '@/usecases/view/output/dto/contentToDTO/types';
import { formatDate2DigitString } from '@/utils/date';
import type { BlogPost } from 'entities/src/blogPost/index';
import type { Content } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from 'service/src/blogPostService/repository/repositoryOutput/blogPostDTO';

export type thumbnailDTO = {
  readonly path: string;
};

export class BlogPostDTOBuilder {
  private blogPost: BlogPost;

  constructor(blogPost: BlogPost) {
    this.blogPost = blogPost;
  }

  private extractThumbnailForDTO(): thumbnailDTO {
    try {
      return {
        path: this.blogPost.getThumbnail().getPath(),
      };
    } catch {
      throw new UsecaseError(
        'サムネイル画像が存在しない記事を生成しようとしました',
      );
    }
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

  private extractContentsForDTO(): BlogPostDTO['contents'] {
    return this.blogPost
      .getContents()
      .map((content) => this.createContentForDTO(content));
  }

  private createContentForDTO(content: Content): ContentForDTO {
    const dtoCreator = createContentToDTOContext(content);
    return dtoCreator.toDTO();
  }

  build(): BlogPostDTO {
    return {
      id: this.blogPost.getId(),
      title: this.blogPost.getTitleText(),
      thumbnail: this.extractThumbnailForDTO(),
      postDate: this.extractPostDateForDTO(),
      lastUpdateDate: this.extractLastUpdateDateForDTO(),
      contents: this.extractContentsForDTO(),
    };
  }
}
