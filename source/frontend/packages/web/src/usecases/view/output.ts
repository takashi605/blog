import { formatDate2DigitString } from '@/utils/date';
import type { BlogPost } from 'entities/src/blogPost';

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
  const postDateValue = blogPost.getPostDate();
  if (!postDateValue) {
    throw new Error(
      '投稿日は必須ですが、投稿日が存在しない記事を生成しようとしました',
    );
  }
  const postDate = formatDate2DigitString(postDateValue);
  return postDate;
};

const extractLastUpdateDateForDTO = (blogPost: BlogPost): string => {
  const lastUpdateDateValue = blogPost.getLastUpdateDate();
  if (!lastUpdateDateValue) {
    throw new Error(
      '最終更新日は必須ですが、最終更新日が存在しない記事を生成しようとしました',
    );
  }
  const lastUpdateDate = formatDate2DigitString(lastUpdateDateValue);
  return lastUpdateDate;
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
