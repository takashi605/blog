import type { CreateBlogPostFormData } from '@/controllers/blogPost/create/formSchema';
import { CreateBlogPostUseCase } from '@/usecases/create/createBlogPost';
import type { SubmitHandler } from 'react-hook-form';
import type { BlogPostBuilder } from 'service/src/blogPostBuilder';
import { createBlogPostBuilder } from 'service/src/blogPostBuilder';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';

export const createBlogPostAction: SubmitHandler<
  CreateBlogPostFormData
> = async (formData) => {
  const blogPostBuilder = createBlogPostBuilder();

  blogPostBuilder.setId(createUUIDv4());
  injectFormDataToBuilder(formData, blogPostBuilder);

  const blogPostCreator = setupBlogPostCreator(blogPostBuilder);
  await blogPostCreator.execute();
};

function setupBlogPostCreator(builder: BlogPostBuilder) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API の URL が設定されていません');
  }
  const repository = new ApiBlogPostRepository(process.env.NEXT_PUBLIC_API_URL);
  return new CreateBlogPostUseCase(builder, repository);
}

function injectFormDataToBuilder(
  formData: CreateBlogPostFormData,
  builder: BlogPostBuilder,
) {
  builder.setPostTitle(formData.title);
  injectContentsToBuilder(formData, builder);
}

function injectContentsToBuilder(
  formData: CreateBlogPostFormData,
  builder: BlogPostBuilder,
) {
  formData.contents.forEach((content, index) => {
    switch (content.type) {
      case 'h2':
        builder.addH2(index.toString(), content.text);
        break;
      case 'h3':
        builder.addH3(index.toString(), content.text);
        break;
      case 'paragraph':
        builder.addParagraph(index.toString(), content.text);
        break;
    }
  });
}
