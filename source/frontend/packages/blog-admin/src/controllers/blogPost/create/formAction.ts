import type { CreateBlogPostFormData } from '@/controllers/blogPost/create/formSchema';
import { CreateBlogPostUseCase } from '@/usecases/create/createBlogPost';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { SubmitHandler } from 'react-hook-form';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';

export const createBlogPostAction: SubmitHandler<
  CreateBlogPostFormData
> = async (formData) => {
  // TODO thumbnail の実装
  // TODO postDate, lastUpdateDate の持ち方を考える
  const blogPostDTO: BlogPostDTO = {
    id: createUUIDv4(),
    title: formData.title,
    postDate: new Date().toISOString().split('T')[0],
    lastUpdateDate: new Date().toISOString().split('T')[0],
    thumbnail: { path: 'path/to/thumbnail' },
    contents: formData.contents.map((content) => {
      switch (content.type) {
        case ContentType.H2:
          return {
            id: createUUIDv4(),
            type: ContentType.H2,
            text: content.text,
          };
        case ContentType.H3:
          return {
            id: createUUIDv4(),
            type: ContentType.H3,
            text: content.text,
          };
        case ContentType.Paragraph:
          return {
            id: createUUIDv4(),
            type: ContentType.Paragraph,
            text: [
              { text: 'これは', styles: { bold: false } },
              { text: content.text, styles: { bold: true } },
              { text: 'です', styles: { bold: false } },
            ],
          };
        default:
          throw new Error('不正なコンテンツタイプです');
      }
    }),
  };

  const blogPostCreator = setupBlogPostCreator(blogPostDTO);
  await blogPostCreator.execute();
};

function setupBlogPostCreator(builder: BlogPostDTO) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API の URL が設定されていません');
  }
  const repository = new ApiBlogPostRepository(process.env.NEXT_PUBLIC_API_URL);
  return new CreateBlogPostUseCase(builder, repository);
}
