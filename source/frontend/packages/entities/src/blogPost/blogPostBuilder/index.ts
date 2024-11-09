import { BlogPost } from '../../blogPost';
import type { Content } from '../../blogPost/postContents/content';
import {
  ContentBuildStrategyContext,
  H2Input,
  H3Input,
  ImageInput,
  ParagraphInput,
} from './contentBuilder';

export class BlogPostBuilder {
  private postTitle = '';
  private thumbnailPath = '';
  private postDate = '';
  private lastUpdateDate = '';
  private contentBuilders: ContentBuildStrategyContext<Content>[] = [];

  setPostTitle(postTitle: string) {
    this.postTitle = postTitle;
    return this;
  }

  setThumbnail(thumbnailPath: string) {
    this.thumbnailPath = thumbnailPath;
    return this;
  }

  setPostDate(postDate: string) {
    this.postDate = postDate;
    return this;
  }

  setLastUpdateDate(lastUpdateDate: string) {
    this.lastUpdateDate = lastUpdateDate;
    return this;
  }

  addH2(contentValue: string) {
    const h2Input = new H2Input(contentValue);
    const builder = new ContentBuildStrategyContext(h2Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addH3(contentValue: string) {
    const h3Input = new H3Input(contentValue);
    const builder = new ContentBuildStrategyContext(h3Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addParagraph(contentValue: string) {
    const paragraphInput = new ParagraphInput(contentValue);
    const builder = new ContentBuildStrategyContext(paragraphInput);
    this.contentBuilders.push(builder);
    return this;
  }

  addImage(imagePath: string) {
    const imageInput = new ImageInput(imagePath);
    const builder = new ContentBuildStrategyContext(imageInput);
    this.contentBuilders.push(builder);
    return this;
  }

  injectionContentsTo(blogPost: BlogPost) {
    this.contentBuilders.forEach((contentBuilder) => {
      blogPost.addContent(
        contentBuilder.build(blogPost.getContents().length + 1),
      );
    });
  }

  build() {
    const blogPost = new BlogPost(this.postTitle)
      .setThumbnail(this.thumbnailPath)
      .setPostDate(this.postDate)
      .setLastUpdateDate(this.lastUpdateDate);
    this.injectionContentsTo(blogPost);
    return blogPost;
  }
}

export const createBlogPostBuilder = () => new BlogPostBuilder();
