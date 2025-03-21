import type { BlogPost } from 'entities/src/blogPost/index';
import type { Content } from 'entities/src/blogPost/postContents/content';
import type { ImageDTO } from '../../../imageService/dto/imageDTO';
import { formatDate2DigitString } from '../../../utils/date';
import type { BlogPostDTO } from '../blogPostDTO';
import type { ContentDTO } from '../contentDTO';
import { createContentToDTOContext } from './contentToDTO';

export class BlogPostDTOBuilder {
  private blogPost: BlogPost;

  constructor(blogPost: BlogPost) {
    this.blogPost = blogPost;
  }

  build(): BlogPostDTO {
    return {
      id: this.blogPost.getId(),
      title: this.blogPost.getTitleText(),
      thumbnail: this.extractImageDTO(),
      postDate: this.extractPostDateDTO(),
      lastUpdateDate: this.extractLastUpdateDateDTO(),
      contents: this.extractContentsDTO(),
    };
  }

  private extractImageDTO(): ImageDTO {
    try {
      return {
        id: this.blogPost.getThumbnail().getId(),
        path: this.blogPost.getThumbnail().getPath(),
      };
    } catch {
      throw new Error('サムネイル画像が存在しない記事を生成しようとしました');
    }
  }

  private extractPostDateDTO(): string {
    try {
      return formatDate2DigitString(this.blogPost.getPostDate());
    } catch {
      throw new Error('投稿日が存在しない記事を生成しようとしました');
    }
  }

  private extractLastUpdateDateDTO(): string {
    try {
      return formatDate2DigitString(this.blogPost.getLastUpdateDate());
    } catch {
      throw new Error('最終更新日が存在しない記事を生成しようとしました');
    }
  }

  private extractContentsDTO(): BlogPostDTO['contents'] {
    return this.blogPost
      .getContents()
      .map((content) => this.createContentDTO(content));
  }

  private createContentDTO(content: Content): ContentDTO {
    const dtoCreator = createContentToDTOContext(content);
    return dtoCreator.toDTO();
  }
}
