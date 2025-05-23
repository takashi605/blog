import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { extractFirstParagraphText } from 'service/src/blogPostService/dto/blogPostDTOProcessor/excerptedBlogPostDTO';
import { HttpError } from 'shared-interface-adapter/src/error/httpError';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { z } from 'zod';
import ViewBlogPostController from '../../../controllers/blogPost/viewBlogPost/ViewBlogPostController';
import { ViewBlogPostUseCase } from '../../../usecases/view/viewBlogPost';

type ViewBlogPostParams = {
  params: {
    id: string;
  };
};

export async function generateMetadata(
  { params }: ViewBlogPostParams,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  let blogPostDTO: BlogPostDTO;
  try {
    blogPostDTO = await new ViewBlogPostUseCase(blogPostRepository).execute(
      params.id,
    );
  } catch (e) {
    if (e instanceof HttpError || e instanceof z.ZodError) notFound();
    throw e;
  }
  const excerptedText = extractFirstParagraphText(blogPostDTO);

  return {
    title: blogPostDTO.title,
    description: excerptedText,
  };
}

async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;

  return (
    <div>
      <ViewBlogPostController postId={postId} />
    </div>
  );
}

export default ViewBlogPost;
