import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = input.generateBlogPost();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return {
    title: blogPost.getTitleText(),
    postDate:
      blogPost.getPostDate()?.toLocaleDateString('ja-JP', options) ?? '',
    lastUpdateDate:
      blogPost.getLastUpdateDate()?.toLocaleDateString('ja-JP', options) ?? '',
    contents: blogPost.getContents().map((content, index) => {
      return {
        id: index + 1,
        value: content.getValue(),
        type: content.getType(),
      };
    }),
  };
};
