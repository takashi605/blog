import { Image } from 'entities/src/blogPost/image';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import type { ImageRepository } from 'service/src/imageService/repository/imageRepository';

export class CreateImageUseCase {
  private imageDTO: ImageDTO;
  private repository: ImageRepository;

  constructor(imageDTO: ImageDTO, repository: ImageRepository) {
    this.imageDTO = imageDTO;
    this.repository = repository;
  }

  buildImage(): Image {
    const image = new Image(this.imageDTO.id, this.imageDTO.path);

    return image;
  }

  async execute(): Promise<ImageDTO> {
    const blogPost = this.buildImage();
    const createdBlogPost = await this.repository.save(blogPost);
    return createdBlogPost;
  }
}
