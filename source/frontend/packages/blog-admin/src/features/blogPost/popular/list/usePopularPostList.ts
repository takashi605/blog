import { useCallback, useEffect } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import { ViewPopularPostUseCase } from '../../../../usecases/view/viewPopularPost';
import { usePopularPostListContext } from './PopularPostListProvider';

export function usePopularPostList() {
  const { getAllPopularPosts, updatePopularPosts } =
    usePopularPostListContext();

  const fetchPopularPosts = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const usecase = new ViewPopularPostUseCase(repository).setQuantity(3);
    const postsDTO: BlogPostDTO[] = await usecase.execute();
    updatePopularPosts(postsDTO);
  }, [updatePopularPosts]);

  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  return {
    getAllPopularPosts,
  };
}
