import { blogPostHandlers } from '@/apiMock/handlers/blogPostHandler';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/fivesix`, () => {
    return HttpResponse.json({
      num1: 5,
      num2: 6,
    });
  }),
];

export const allHandlers = [...handlers, ...blogPostHandlers];
