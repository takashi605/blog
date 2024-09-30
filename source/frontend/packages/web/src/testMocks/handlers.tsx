import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://api.blog.example/fivesix', () => {
    return HttpResponse.json({
      num1: 5,
      num2: 6,
    });
  }),
];
