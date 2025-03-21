import type { Image } from 'entities/src/blogPost/image';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import type { ImageRepository } from 'service/src/imageService/repository/imageRepository';
import { imageSchema } from './jsonMapper/imageSchema';
import { imageToJson } from './jsonMapper/imageToJson';

export class ApiImageRepository implements ImageRepository {
  private baseUrl: string;
  private baseFetchOptions = {
    mode: 'cors' as const,
    headers: {
      Authorization: `${process.env.NEXT_PUBLIC_BASIC_AUTHENTICATION}`,
      'Content-Type': 'application/json',
    },
  };

  constructor(url: string) {
    this.baseUrl = url;
  }

  async save(image: Image): Promise<ImageDTO> {
    const body = imageToJson(image);
    const response = await this.post(body);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `画像の保存に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }

    const validatedResponse = imageSchema.parse(await response.json());

    return validatedResponse;
  }

  // TODO ヘッダー等の設定を blogpostRepository と共通化する
  private async post(image: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/blog/images`, {
      method: 'POST',
      body: image,
      ...this.baseFetchOptions,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `画像の保存に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }
    return response;
  }
}
