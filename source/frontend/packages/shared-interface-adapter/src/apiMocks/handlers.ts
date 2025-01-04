import type { HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import { createBlogPostHandlers, createProtTypeBlogPostHandlers } from './handlers/blogPostHandlers';

export const createAllHandlers = (baseUrl: string): HttpHandler[] => {
  return [
    http.get(`${baseUrl}/fivesix`, () => {
      return HttpResponse.json({
        num1: 5,
        num2: 6,
      });
    }),
    ...createBlogPostHandlers(baseUrl),
  ];
};

export const createProtTypeAllHandlers = (baseUrl: string): HttpHandler[] => {
  return [
    http.get(`${baseUrl}/fivesix`, () => {
      return HttpResponse.json({
        num1: 5,
        num2: 6,
      });
    }),
    ...createProtTypeBlogPostHandlers(baseUrl),
  ];
};
