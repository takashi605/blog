import { useCallback, useEffect } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewTopTechPickUseCase } from '../../../../usecases/view/viewTopTechPick';
import { useTopTechPickPostViewContext } from './TopTechPickViewProvider';

export function useTopTechPickPostList() {
  const { getTopTechPickPost, updateTopTechPickPost } =
    useTopTechPickPostViewContext();

  const fetchTopTechPickPost = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const usecase = new ViewTopTechPickUseCase(repository);
    const postDTO: BlogPostDTO = await usecase.execute();
    updateTopTechPickPost(postDTO);
  }, [updateTopTechPickPost]);

  useEffect(() => {
    fetchTopTechPickPost();
  }, [fetchTopTechPickPost]);

  return {
    getTopTechPickPost,
  };
}
