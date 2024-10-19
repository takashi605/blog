import {
  createContentForBlogPostBuilder,
  type ContentForBlogPostBuilder,
} from '@/usecases/entityBuilder/content';
import { BlogPost } from 'entities/src/blogPost/index';
import { ContentType } from 'entities/src/blogPost/postContents/content';

export class BlogPostBuilder {
  private postTitle = '';
  private postDate = '';
  private lastUpdateDate = '';
  private contents: ContentForBlogPostBuilder[] = [];

  setPostTitle(postTitle: string) {
    this.postTitle = postTitle;
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
    this.contents.push({ type: ContentType.H2, contentValue });
    return this;
  }

  addH3(contentValue: string) {
    this.contents.push({ type: ContentType.H3, contentValue });
    return this;
  }

  addParagraph(contentValue: string) {
    this.contents.push({ type: ContentType.Paragraph, contentValue });
    return this;
  }

  injectionContentsTo(blogPost: BlogPost) {
    this.contents.forEach((content) => {
      blogPost.addContent(
        createContentForBlogPostBuilder(
          blogPost.getContents().length + 1,
          content,
        ),
      );
    });
  }

  build() {
    const blogPost = new BlogPost(this.postTitle)
      .setPostDate(this.postDate)
      .setLastUpdateDate(this.lastUpdateDate);
    this.injectionContentsTo(blogPost);
    return blogPost;
  }
}
