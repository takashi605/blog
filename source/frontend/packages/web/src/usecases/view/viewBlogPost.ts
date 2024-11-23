import { BlogPostDTOBuilder } from '@/usecases/view/output/dto/index';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { fetchedDataToEntity } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTOToEntity';

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
    const entity = fetchedDataToEntity(fetchedData);
    const dto = new BlogPostDTOBuilder(entity).build();
    return dto;
  }
}
