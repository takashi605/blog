import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewPopularPostUseCase } from '../../../usecases/view/viewPopularBlogPosts';
import ViewPopularPostsPresenter from './ViewPopularPostsPresenter';

async function ViewPopularPostsController() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const usecase = new ViewPopularPostUseCase(blogPostRepository);
  const blogPostsDTO = await usecase.setQuantity(3).execute();

  return <ViewPopularPostsPresenter blogPostsDTO={blogPostsDTO} />;
}

export default ViewPopularPostsController;
