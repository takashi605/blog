import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { createUUIDv4 } from 'service/src/utils/uuid';

export type BlogPostDTOForCreate = Omit<BlogPostDTO, 'id' | 'postDate' | 'lastUpdateDate'>;

export class CreateBlogPostUseCase {
  private blogPostDTOForCreate: BlogPostDTOForCreate;
  private repository: BlogPostRepository;

  constructor(
    blogPostDTO: BlogPostDTOForCreate,
    repository: BlogPostRepository,
  ) {
    this.blogPostDTOForCreate = blogPostDTO;
    this.repository = repository;
  }

  buildBlogPost(): BlogPost {
    // YYYY-MM-DD形式の日付を取得
    // TODO 日付のフォーマットを共通化する
    const today = new Date().toISOString().split('T')[0];

    const blogPostDTO = {
      ...this.blogPostDTOForCreate,
      id: createUUIDv4(),
      postDate: today,
      lastUpdateDate: today,
    }

    const blogPostEntity = blogPostDTOToEntity(blogPostDTO);

    return blogPostEntity;
  }

  async execute(): Promise<BlogPostDTO> {
    const blogPost = this.buildBlogPost();
    const createdBlogPost = await this.repository.save(blogPost);
    return createdBlogPost;
  }
}
