import {
  createViewBlogPostInput,
  type ViewBlogPostInput,
} from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';

export type BlogPostResponse = {
  id: number;
  title: string;
  contents: {
    type: string;
    value: string;
  }[];
};

export const mapResponseContentToBlogPost = (
  response: BlogPostResponse,
  viewBlogPostInput: ViewBlogPostInput,
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

export const responseToViewBlogPost = (
  response: BlogPostResponse,
): ViewBlogPost => {
  const viewBlogPostInput = createViewBlogPostInput().setPostTitle(
    response.title,
  );

  mapResponseContentToBlogPost(response, viewBlogPostInput);

  const blobPost = viewBlogPost(viewBlogPostInput);

  return blobPost;
};
