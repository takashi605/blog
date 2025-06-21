import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import { ViewLatestBlogPostsUseCase } from '../../../usecases/view/viewLatestBlogPosts';
import ViewLatestBlogPostsPresenter from './ViewLatestBlogPostsPresenter';

type ViewLatestBlogPostsControllerProps = {
  quantity?: number;
};

async function ViewLatestBlogPostsController({
  quantity,
}: ViewLatestBlogPostsControllerProps) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const viewLatestsUseCase = new ViewLatestBlogPostsUseCase(
    blogPostRepository,
  ).setQuantity(quantity);
  const blogPosts = await viewLatestsUseCase.execute();
  return <ViewLatestBlogPostsPresenter blogPosts={blogPosts} />;
}

export default ViewLatestBlogPostsController;
