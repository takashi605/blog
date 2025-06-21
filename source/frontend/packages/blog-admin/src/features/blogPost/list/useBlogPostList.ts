import { useCallback, useEffect, useState } from 'react';
import type { BlogPost } from 'shared-lib/src/api';
import { api, HttpError } from 'shared-lib/src/api';

export function useBlogPostList() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const getAllBlogPosts = useCallback(() => {
    return blogPosts;
  }, [blogPosts]);

  const updateBlogPosts = useCallback(
    (blogPosts: BlogPost[]) => {
      setBlogPosts(blogPosts);
    },
    [setBlogPosts],
  );

  const fetchBlogPosts = useCallback(async () => {
    try {
      const response = await api.get('/api/v2/blog/posts/latest');
      updateBlogPosts(response);
    } catch (error) {
      console.error('記事一覧の取得に失敗しました:', error);
      
      if (error instanceof HttpError) {
        // 必要に応じて、より詳細なエラーハンドリングを追加
        console.error(`HTTPエラー: ${error.status}`);
      }
      
      // エラー時は空配列を設定
      updateBlogPosts([]);
    }
  }, [updateBlogPosts]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return {
    getAllBlogPosts,
  };
}
