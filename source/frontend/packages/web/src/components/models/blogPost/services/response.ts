import type { ContentForDTO } from '@/usecases/view/output/dto/contentToDTO/types';
import type { ViewBlogPostDTO } from '@/usecases/view/output/dto/index';
import type { BlogPostBuilder } from 'service/src/blogPostBuilder';
import { createBlogPostBuilder } from 'service/src/blogPostBuilder';
import { ViewBlogPostUseCase } from '../../../../usecases/view/viewBlogPost';

export type BlogPostResponse = {
  id: string;
  title: string;
  thumbnail: {
    path: string;
  };
  postDate: string;
  lastUpdateDate: string;
  contents: ContentForDTO[];
};

export const responseToViewBlogPost = (
  response: BlogPostResponse,
): ViewBlogPostDTO => {
  const viewBlogPostInput = responseToViewBlogPostInput(response);

  const blogPost = new ViewBlogPostUseCase(viewBlogPostInput).execute();

  return blogPost;
};

const responseToViewBlogPostInput = (response: BlogPostResponse) => {
  const viewBlogPostInput = createBlogPostBuilder()
    .setId(response.id)
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
      viewBlogPostInput.addH2(content.id, content.text);
    } else if (content.type === 'h3') {
      viewBlogPostInput.addH3(content.id, content.text);
    } else if (content.type === 'paragraph') {
      viewBlogPostInput.addParagraph(content.id, content.text);
    } else if (content.type === 'image') {
      viewBlogPostInput.addImage(content.id, content.path);
    }
  });
};
