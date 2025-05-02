import type { Metadata, ResolvingMetadata } from 'next';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
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
  const blogPostDTO = await new ViewBlogPostUseCase(blogPostRepository).execute(
    params.id,
  );

  return {
    title: blogPostDTO.title,
    description: '記事の説明文',
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
