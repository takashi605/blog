import type { CreateBlogPostFormData } from '../CreateBlogPostForm';
import { typedBlogPostWithoutContentsToDTO } from './typedBlogPostToDTO';

describe('typedBlogPostToDTO', () => {
  it('フォームに入力されたコンテンツ以外のデータを DTO に変換する', () => {
    const formData: CreateBlogPostFormData = {
      title: 'ブログ記事のタイトル',
      thumbnail: {
        id: '535c8105-fd92-47b7-93ce-dc01b379ae66',
        path: 'path/to/thumbnail',
      }
    };
    const formDataDTO = typedBlogPostWithoutContentsToDTO(formData);
    expect(formDataDTO).toEqual({
      title: 'ブログ記事のタイトル',

      // thumbnail は未実装のため、固定の値を入れている
      thumbnail: {
        id: '535c8105-fd92-47b7-93ce-dc01b379ae66',
        path: 'path/to/thumbnail',
      },
    });
  });
});
