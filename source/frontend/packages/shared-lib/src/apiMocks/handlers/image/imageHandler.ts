import type { DefaultBodyType } from 'msw';
import { http, HttpResponse, type HttpHandler } from 'msw';
import type { Image } from '../../../api/types';
import { createdImages } from './imageHandlerReponse';

export const createImageHandlers = (baseUrl: string): HttpHandler[] => {
  return [
    // API endpoints
    http.post(`${baseUrl}/admin/blog/images`, async ({ request }) => {
      let newImage: DefaultBodyType;
      try {
        newImage = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }
      createdImages.push(newImage as Image);
      return HttpResponse.json(newImage, { status: 200 });
    }),
    http.get(`${baseUrl}/blog/images`, async () => {
      return HttpResponse.json(createdImages, { status: 200 });
    }),
  ];
};
