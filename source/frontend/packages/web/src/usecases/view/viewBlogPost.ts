import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';
import { formatDate2DigitString } from '@/utils/date';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = input.generateBlogPost();

  const postDateValue = blogPost.getPostDate();
  if (!postDateValue) {
    throw new Error(
      '投稿日は必須ですが、投稿日が存在しない記事を生成しようとしました',
    );
  }
  const postDate = formatDate2DigitString(postDateValue);

  const lastUpdateDateValue = blogPost.getLastUpdateDate();
  if (!lastUpdateDateValue) {
    throw new Error(
      '最終更新日は必須ですが、最終更新日が存在しない記事を生成しようとしました',
    );
  }
  const lastUpdateDate = formatDate2DigitString(lastUpdateDateValue);

  return {
    title: blogPost.getTitleText(),
    postDate,
    lastUpdateDate,
    contents: blogPost.getContents().map((content, index) => {
      return {
        id: index + 1,
        value: content.getValue(),
        type: content.getType(),
      };
    }),
  };
};
