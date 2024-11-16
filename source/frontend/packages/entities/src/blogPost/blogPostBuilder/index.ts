import { BlogPost } from '../../blogPost';
import type { Content } from '../../blogPost/postContents/content';
import { ContentBuildStrategyContext } from './contentBuildStrategy/context';
import {
  H2Input,
  H3Input,
  ImageInput,
  ParagraphInput,
} from './contentBuildStrategy/input';

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

  addH2(id: number, contentValue: string) {
    const h2Input = new H2Input(id, contentValue);
    const builder = new ContentBuildStrategyContext(h2Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addH3(id: number, contentValue: string) {
    const h3Input = new H3Input(id, contentValue);
    const builder = new ContentBuildStrategyContext(h3Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addParagraph(id: number, contentValue: string) {
    const paragraphInput = new ParagraphInput(id, contentValue);
    const builder = new ContentBuildStrategyContext(paragraphInput);
    this.contentBuilders.push(builder);
    return this;
  }

  addImage(id: number, imagePath: string) {
    const imageInput = new ImageInput(id, imagePath);
    const builder = new ContentBuildStrategyContext(imageInput);
    this.contentBuilders.push(builder);
    return this;
  }

  injectionContentsTo(blogPost: BlogPost) {
    this.contentBuilders.forEach((contentBuilder) => {
      blogPost.addContent(contentBuilder.build());
    });
  }

  build() {
    // TODO id をメソッドチェーン等で設定できるようにする
    const blogPost = new BlogPost(1, this.postTitle)
      .setThumbnail(this.thumbnailPath)
      .setPostDate(this.postDate)
      .setLastUpdateDate(this.lastUpdateDate);
    this.injectionContentsTo(blogPost);
    return blogPost;
  }
}

export const createBlogPostBuilder = () => new BlogPostBuilder();
