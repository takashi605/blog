import { BlogPostBuilder } from '@/usecases/entityBuilder/index';
import type { ViewBlogPostDTO } from '@/usecases/view/output/dto';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';

export type BlogPostResponse = {
  id: number;
  title: string;
  postDate: string;
  lastUpdateDate: string;
  contents: {
    type: string;
    value: string;
  }[];
};

export const responseToViewBlogPost = (
  response: BlogPostResponse,
): ViewBlogPostDTO => {
  const viewBlogPostInput = responseToViewBlogPostInput(response);

  const blogPost = viewBlogPost(viewBlogPostInput);

  return blogPost;
};

const responseToViewBlogPostInput = (response: BlogPostResponse) => {
  const viewBlogPostInput = new BlogPostBuilder()
    .setPostTitle(response.title)
    .setPostDate(response.postDate)
    .setLastUpdateDate(response.lastUpdateDate);

  mapResponseContentToBlogPost(response, viewBlogPostInput);

  return viewBlogPostInput;
};

const mapResponseContentToBlogPost = (
  response: BlogPostResponse,
  viewBlogPostInput: BlogPostBuilder,
) => {
  response.contents.forEach((content) => {
    if (content.type === 'h2') {
      viewBlogPostInput.addH2(content.value);
    } else if (content.type === 'h3') {
      viewBlogPostInput.addH3(content.value);
    } else if (content.type === 'paragraph') {
      viewBlogPostInput.addParagraph(content.value);
    }
  });
};
