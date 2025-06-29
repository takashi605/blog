'use client';
import { useCallback, useEffect, useState } from 'react';
import type { BlogPost } from 'shared-lib/src/api';
import { api } from 'shared-lib/src/api';

interface UseAdminBlogPostReturn {
  blogPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 管理者用単一記事取得フック
 *
 * 未公開記事も含めて取得可能な管理者用APIエンドポイントを使用します
 */
export function useAdminBlogPost(postId: string): UseAdminBlogPostReturn {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/admin/blog/posts/{uuid}', {
        pathParams: { uuid: postId },
      });

      setBlogPost(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '記事の取得に失敗しました';
      setError(errorMessage);
      setBlogPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchBlogPost();
    }
  }, [postId, fetchBlogPost]);

  return {
    blogPost,
    loading,
    error,
    refetch: fetchBlogPost,
  };
}
