import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://192.168.1.1/api/fivesix', () => {
    return HttpResponse.json({
      num1: 5,
      num2: 6,
    });
  }),
];
