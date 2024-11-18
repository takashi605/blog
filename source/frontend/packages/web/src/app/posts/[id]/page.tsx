import WithBlogPostErrorForServer from '@/components/models/blogPost/error/WithBlogPostErrorForServer';
import ViewBlogPostController from '@/components/models/blogPost/view/controllers/ViewBlogPostController';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewBlogPostUseCase } from '../../../usecases/view/viewBlogPost';

type ViewBlogPostParams = {
  params: {
    id: string;
  };
};

async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;
  // const blogPostResponse = await fetchBlogPost(postId);
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const blogPostDTO = await new ViewBlogPostUseCase(
    null,
    blogPostRepository,
  ).execute(postId);

  return (
    <div>
      <ViewBlogPostController blogPost={blogPostDTO} />
    </div>
  );
}

export default WithBlogPostErrorForServer(ViewBlogPost);
