import { BlogPost } from 'entities/src/blogPost';
import type { Content } from 'entities/src/blogPost/postContents/content';
import { uuidv4Regex } from '../../utils/uuid';
import type { RichTextForDTO } from '../dto/contentDTO';
import { ContentBuildStrategyContext } from './contentBuildStrategy/context';
import {
  H2Input,
  H3Input,
  ImageInput,
  ParagraphInput,
} from './contentBuildStrategy/input';

export class BlogPostBuilder {
  private id: string | null = null;
  private postTitle = '';
  private thumbnailPath = '';
  private postDate = '';
  private lastUpdateDate = '';
  private contentBuilders: ContentBuildStrategyContext<Content>[] = [];

  setId(id: string) {
    this.id = id;
    return this;
  }

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

  addH2(id: string, contentValue: string) {
    const h2Input = new H2Input(id, contentValue);
    const builder = new ContentBuildStrategyContext(h2Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addH3(id: string, contentValue: string) {
    const h3Input = new H3Input(id, contentValue);
    const builder = new ContentBuildStrategyContext(h3Input);
    this.contentBuilders.push(builder);
    return this;
  }

  addParagraph(id: string, contentValue: RichTextForDTO) {
    const paragraphInput = new ParagraphInput(id, contentValue);
    const builder = new ContentBuildStrategyContext(paragraphInput);
    this.contentBuilders.push(builder);
    return this;
  }

  addImage(id: string, imagePath: string) {
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
    this.validateId();
    const blogPost = new BlogPost(this.id!, this.postTitle)
      .setThumbnail(this.thumbnailPath)
      .setPostDate(this.postDate)
      .setLastUpdateDate(this.lastUpdateDate);
    this.injectionContentsTo(blogPost);
    this.validateBlogPostId(blogPost);
    return blogPost;
  }

  validateId() {
    if (!this.id) {
      throw new Error('記事の id は必須です');
    }
    if (!uuidv4Regex().test(this.id)) {
      throw new Error('記事の id は UUIDv4 の形式で設定してください');
    }
  }

  validateBlogPostId(blogPost: BlogPost) {
    blogPost.getContents().forEach((content) => {
      if (!uuidv4Regex().test(content.getId())) {
        throw new Error('コンテントの id は UUIDv4 の形式で設定してください');
      }
    });
  }
}

export const createBlogPostBuilder = () => new BlogPostBuilder();
