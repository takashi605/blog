import type { HttpHandler } from 'msw';
import { createBlogPostHandlers } from './handlers/blogPost/blogPostHandlers';
import { createImageHandlers } from './handlers/image/imageHandler';

export const createAllHandlers = (baseUrl: string): HttpHandler[] => {
  return [
    ...createBlogPostHandlers(baseUrl),
    ...createImageHandlers(baseUrl),
  ];
};
