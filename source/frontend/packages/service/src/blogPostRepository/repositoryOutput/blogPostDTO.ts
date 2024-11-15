import type { BlogPost } from 'entities/src/blogPost/index';
import type { Content } from 'entities/src/blogPost/postContents/content';
import { createContentToDTOContext } from './contentToDTO';
import type { ContentForDTO } from './contentToDTO/types';

export type BlogPostDTO = {
  readonly title: string;
  readonly thumbnail: thumbnailDTO;
  readonly postDate: string;
  readonly lastUpdateDate: string;
  readonly contents: ReadonlyArray<ContentForDTO>;
};

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
      throw new Error('サムネイル画像が存在しない記事を生成しようとしました');
    }
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
      title: this.blogPost.getTitleText(),
      thumbnail: this.extractThumbnailForDTO(),
      postDate: this.extractPostDateForDTO(),
      lastUpdateDate: this.extractLastUpdateDateForDTO(),
      contents: this.extractContentsForDTO(),
    };
  }
}

// TODO この関数は共通化できる
export const formatDate2DigitString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('ja-JP', options);
};
