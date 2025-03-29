'use client';
import { useCallback, useEffect, useState } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewPickUpPostUseCase } from '../../../usecases/view/viewPickUpPost';

function PickUpPostList() {
  const [posts, setPosts] = useState<BlogPostDTO[]>([]);

  const fetchPickUpPosts = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const usecase = new ViewPickUpPostUseCase(repository).setQuantity(3);
    const postsDTO: BlogPostDTO[] = await usecase.execute();
    setPosts(postsDTO);
  }, []);

  useEffect(() => {
    fetchPickUpPosts();
  }, [fetchPickUpPosts]);

  return (
    <section>
      <h3>現在設定中のピックアップ記事</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>{post.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PickUpPostList;
