import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import { ViewPickUpPostUseCase } from '../../../usecases/view/viewPickUpPost';
import ViewPickUpPostsPresenter from './ViewPickUpPostsPresenter';

async function ViewPickUpPostsController() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const usecase = new ViewPickUpPostUseCase(blogPostRepository);
  const blogPostsDTO = await usecase.setQuantity(3).execute();

  return <ViewPickUpPostsPresenter blogPostsDTO={blogPostsDTO} />;
}

export default ViewPickUpPostsController;
