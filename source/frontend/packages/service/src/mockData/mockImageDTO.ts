import type { ImageDTO } from '../imageService/dto/imageDTO';

export const mockImageDTO1: ImageDTO = {
  id: '1931b310-3e1d-44c6-887c-e15ea193c433',
  path: 'path/to/image',
};

const mockImageDTO2: ImageDTO = {
  id: '7c7fe33b-c6a3-41f6-a770-6c86b20da53c',
  path: 'path/to/image2',
};

const mockImageDTO3: ImageDTO = {
  id: '5aee663b-57e3-461a-8ad0-a93628d1c772',
  path: 'path/to/image3',
};

export const mockImageListDTO: ImageDTO[] = [
  mockImageDTO1,
  mockImageDTO2,
  mockImageDTO3,
];
