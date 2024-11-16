import { createBlogPostHandlers } from './handlers/blogPostHandlers';

export const createAllHandlers = (baseUrl: string) => {
  return [...createBlogPostHandlers(baseUrl)];
}
