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

export const createViewBlogPostDTO = (blogPost: BlogPost): ViewBlogPostDTO => {
  return {
    title: blogPost.getTitleText(),
    postDate: extractPostDateForDTO(blogPost),
    lastUpdateDate: extractLastUpdateDateForDTO(blogPost),
    contents: extractContentsForDTO(blogPost),
  };
};

const extractPostDateForDTO = (blogPost: BlogPost): string => {
  try {
    return formatDate2DigitString(blogPost.getPostDate());
  } catch {
    throw new Error('投稿日が存在しない記事を生成しようとしました');
  }
};

const extractLastUpdateDateForDTO = (blogPost: BlogPost): string => {
  try {
    return formatDate2DigitString(blogPost.getLastUpdateDate());
  } catch {
    throw new Error('最終更新日が存在しない記事を生成しようとしました');
  }
};

const extractContentsForDTO = (
  blogPost: BlogPost,
): ViewBlogPostDTO['contents'] => {
  return blogPost.getContents().map((content, index) => {
    return {
      id: index + 1,
      value: content.getValue(),
      type: content.getType(),
    };
  });
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
