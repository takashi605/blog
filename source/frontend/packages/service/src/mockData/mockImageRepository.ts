import type { ImageRepository } from '../imageService/repository/imageRepository';

export const mockImageRepository: ImageRepository = {
  save: jest.fn(),
};
