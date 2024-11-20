import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewBlogPostUseCase } from '../../../../../usecases/view/viewBlogPost';
import WithBlogPostErrorForServer from '../../error/WithBlogPostErrorForServer';
import ViewBlogPostPresenter from '../ui/ViewBlogPostPresenter';

type ViewBlogPostControllerProps = {
  postId: string;
};

async function ViewBlogPostController({ postId }: ViewBlogPostControllerProps) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const blogPostDTO = await new ViewBlogPostUseCase(blogPostRepository).execute(
    postId,
  );

  return <ViewBlogPostPresenter blogPost={blogPostDTO} />;
}

export default WithBlogPostErrorForServer(ViewBlogPostController);
