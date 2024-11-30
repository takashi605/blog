import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewLatestBlogPostsUseCase } from '../../../usecases/view/viewLatestBlogPosts';
import ViewLatestBlogPostsPresenter from './ViewLatestBlogPostsPresenter';

async function ViewLatestBlogPostsController() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const viewLatestsUseCase = new ViewLatestBlogPostsUseCase(blogPostRepository);
  const blogPosts = await viewLatestsUseCase.execute();
  return <ViewLatestBlogPostsPresenter blogPosts={blogPosts} />;
}

export default ViewLatestBlogPostsController;
