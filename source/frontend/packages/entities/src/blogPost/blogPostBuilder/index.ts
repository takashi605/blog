import { BlogPost } from '../../blogPost';
import { ContentBuilder } from '../../blogPost/blogPostBuilder/content';
import { ContentType } from '../../blogPost/postContents/content';

export class BlogPostBuilder {
  private postTitle = '';
  private postDate = '';
  private lastUpdateDate = '';
  private contentBuilders: ContentBuilder[] = [];

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
    this.contentBuilders.push(
      new ContentBuilder({ type: ContentType.H2, contentValue }),
    );
    return this;
  }

  addH3(contentValue: string) {
    this.contentBuilders.push(
      new ContentBuilder({ type: ContentType.H3, contentValue }),
    );
    return this;
  }

  addParagraph(contentValue: string) {
    this.contentBuilders.push(
      new ContentBuilder({ type: ContentType.Paragraph, contentValue }),
    );
    return this;
  }

  injectionContentsTo(blogPost: BlogPost) {
    this.contentBuilders.forEach((content) => {
      blogPost.addContent(
        content.createContent(blogPost.getContents().length + 1),
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

export const createBlogPostBuilder = () => new BlogPostBuilder();
