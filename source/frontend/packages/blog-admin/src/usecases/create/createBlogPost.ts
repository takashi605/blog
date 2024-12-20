import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';

export class CreateBlogPostUseCase {
  private blogPostDTO: BlogPostDTO;
  private repository: BlogPostRepository;

  constructor(blogPostDTO: BlogPostDTO, repository: BlogPostRepository) {
    this.blogPostDTO = blogPostDTO;
    this.repository = repository;
  }

  buildBlogPost(): BlogPost {
    // YYYY-MM-DD形式の日付を取得
    // TODO 日付のフォーマットを共通化する
    const today = new Date().toISOString().split('T')[0];

    this.blogPostDTO = {
      ...this.blogPostDTO,
      postDate: today,
      lastUpdateDate: today,
    };

    const blogPostEntity = blogPostDTOToEntity(this.blogPostDTO);

    return blogPostEntity;
  }

  async execute(): Promise<BlogPostDTO> {
    const blogPost = this.buildBlogPost();
    const createdBlogPost = await this.repository.save(blogPost);
    return createdBlogPost;
  }
}
