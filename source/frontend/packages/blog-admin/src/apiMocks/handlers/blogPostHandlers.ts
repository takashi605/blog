import { http, HttpResponse } from 'msw';

export const blogPostHandlers = [
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, async ({ request }) => {
    const newPost = await request.json();

    return HttpResponse.json(newPost, { status: 200 });
  }),
];
