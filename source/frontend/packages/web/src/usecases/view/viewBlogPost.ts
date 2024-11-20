import { BlogPostDTOBuilder } from '@/usecases/view/output/dto/index';
import type { BlogPost } from 'entities/src/blogPost';
import {
  createBlogPostBuilder,
  type BlogPostBuilder,
} from 'service/src/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';

export class ViewBlogPostUseCase {
  private blogPostRepository: BlogPostRepository | null;

  constructor(blogPostRepository: BlogPostRepository | null = null) {
    this.blogPostRepository = blogPostRepository;
  }

  async execute(id: string): Promise<BlogPostDTO> {
    if (this.blogPostRepository === null) {
      throw new Error('Repository is not set');
    }

    const fetchedData = await this.blogPostRepository.fetch(id);
    const entity = this.fetchedDataToEntity(fetchedData);
    const dto = new BlogPostDTOBuilder(entity).build();
    return dto;
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
