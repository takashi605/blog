import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import type { ImageRepository } from 'service/src/imageService/repository/imageRepository';

export class ViewImagesUseCase {
  private repository: ImageRepository;

  constructor(repository: ImageRepository) {
    this.repository = repository;
  }

  async execute(): Promise<ImageDTO[]> {
    const AllImages = await this.repository.findAll();
    return AllImages;
  }
}
