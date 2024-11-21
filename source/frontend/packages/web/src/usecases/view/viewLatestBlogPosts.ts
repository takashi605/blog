import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from 'service/src/blogPostBuilder';
import { createBlogPostBuilder } from 'service/src/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { BlogPostDTOBuilder } from './output/dto';

export class ViewLatestBlogPostsUseCase {
  private blogPostRepository: BlogPostRepository;

  constructor(blogPostRepository: BlogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(): Promise<BlogPostDTO[]> {
    const fetchedData = await this.blogPostRepository.fetchLatests();
    const blogPosts = fetchedData.map((dto) => {
      return this.fetchedDataToEntity(dto);
    });
    const blogPostDTOs = blogPosts.map((blogPost) => {
      return new BlogPostDTOBuilder(blogPost).build();
    });
    return blogPostDTOs;
  }

  fetchedDataToEntity(dto: BlogPostDTO): BlogPost {
    const entityBuilder = createBlogPostBuilder()
      .setId(dto.id)
      .setPostTitle(dto.title)
      .setThumbnail(dto.thumbnail.path)
      .setPostDate(dto.postDate)
      .setLastUpdateDate(dto.lastUpdateDate);

    this.fetchedContentToEntity(dto, entityBuilder);
    return entityBuilder.build();
  }
  fetchedContentToEntity(dto: BlogPostDTO, entityBuilder: BlogPostBuilder) {
    dto.contents.forEach((content) => {
      if (content.type === 'h2') {
        entityBuilder.addH2(content.id, content.text);
      } else if (content.type === 'h3') {
        entityBuilder.addH3(content.id, content.text);
      } else if (content.type === 'paragraph') {
        entityBuilder.addParagraph(content.id, content.text);
      } else if (content.type === 'image') {
        entityBuilder.addImage(content.id, content.path);
      }
    });
  }
}
