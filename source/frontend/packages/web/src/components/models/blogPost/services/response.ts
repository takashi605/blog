import type { ViewBlogPostDTO } from '@/usecases/view/output/dto/index';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';
import {
  createBlogPostBuilder,
  type BlogPostBuilder,
} from 'entities/src/blogPost/blogPostBuilder/index';

export type BlogPostResponse = {
  id: number;
  title: string;
  thumbnail: {
    path: string;
  };
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
  const viewBlogPostInput = createBlogPostBuilder()
    .setPostTitle(response.title)
    .setThumbnail(response.thumbnail.path)
    .setPostDate(response.postDate)
    .setLastUpdateDate(response.lastUpdateDate);

  responseContentToBlogPost(response, viewBlogPostInput);

  return viewBlogPostInput;
};

const responseContentToBlogPost = (
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
