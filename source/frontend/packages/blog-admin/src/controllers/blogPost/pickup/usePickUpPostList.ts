import { useCallback, useEffect } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewPickUpPostUseCase } from '../../../usecases/view/viewPickUpPost';
import { usePickUpPostListContext } from './PickUpPostsListProvider';

export function usePickUpPostList() {
  const { getAllPickUpPosts, updatePickUpPosts } = usePickUpPostListContext();

  const fetchPickUpPosts = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const usecase = new ViewPickUpPostUseCase(repository).setQuantity(3);
    const postsDTO: BlogPostDTO[] = await usecase.execute();
    updatePickUpPosts(postsDTO);
  }, [updatePickUpPosts]);

  useEffect(() => {
    fetchPickUpPosts();
  }, [fetchPickUpPosts]);

  return {
    getAllPickUpPosts,
  };
}
