import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewTopTechPickUseCase } from '../../../usecases/view/viewTopTechPick';
import ViewTopTechPickPresenter from './ViewTopTechPickPresenter';

async function ViewTopTechPickController() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const usecase = new ViewTopTechPickUseCase(blogPostRepository);
  const dto = await usecase.execute();

  return <ViewTopTechPickPresenter blogPostDTO={dto} />;
}

export default ViewTopTechPickController;
