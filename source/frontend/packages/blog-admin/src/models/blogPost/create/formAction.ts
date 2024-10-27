import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';
import { BlogPostCreator } from '@/usecases/create/createBlogPost';
import type { BlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import type { SubmitHandler } from 'react-hook-form';

export const createBlogPostAction: SubmitHandler<
  CreateBlogPostFormData
> = async (formData) => {
  const blogPostBuilder = createBlogPostBuilder();
  injectFormDataToBuilder(formData, blogPostBuilder);

  const blogPostCreator = setupBlogPostCreator(blogPostBuilder);
  await blogPostCreator.execute();
};

function setupBlogPostCreator(builder: BlogPostBuilder) {
  const repository = new ApiBlogPostRepository();
  return new BlogPostCreator(builder, repository);
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
  formData.contents.forEach((content) => {
    switch (content.type) {
      case 'h2':
        builder.addH2(content.text);
        break;
      case 'h3':
        builder.addH3(content.text);
        break;
      case 'paragraph':
        builder.addParagraph(content.text);
        break;
    }
  });
}
