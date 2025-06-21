import { useCallback, useEffect, useState } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import { ViewLatestBlogPostsUseCase } from '../../../usecases/view/viewLatestBlogPosts';

export function useBlogPostList() {
  const [blogPosts, setBlogPosts] = useState<BlogPostDTO[]>([]);

  const getAllBlogPosts = useCallback(() => {
    return blogPosts;
  }, [blogPosts]);

  const updateBlogPosts = useCallback(
    (blogPosts: BlogPostDTO[]) => {
      setBlogPosts(blogPosts);
    },
    [setBlogPosts],
  );

  const fetchBlogPosts = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const usecase = new ViewLatestBlogPostsUseCase(repository);
    const postsDTO: BlogPostDTO[] = await usecase.execute();
    updateBlogPosts(postsDTO);
  }, [updateBlogPosts]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return {
    getAllBlogPosts,
  };
}
