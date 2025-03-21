import type { DefaultBodyType } from 'msw';
import { http, HttpResponse, type HttpHandler } from 'msw';
import { imageSchema } from '../../../repositories/apiImageRepository/jsonMapper/imageSchema';
import { createdImages } from './imageHandlerReponse';

export const createImageHandlers = (baseUrl: string): HttpHandler[] => {
  return [
    http.post(`${baseUrl}/images`, async ({ request }) => {
      let newImage: DefaultBodyType;
      try {
        newImage = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }
      createdImages.push(imageSchema.parse(newImage));
      return HttpResponse.json(newImage, { status: 200 });
    }),
  ];
};
