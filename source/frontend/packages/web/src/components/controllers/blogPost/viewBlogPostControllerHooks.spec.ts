import { useViewBlogPostController } from '@/components/controllers/blogPost/viewBlogPostControllerHooks';
import { renderHook } from '@testing-library/react';

describe('カスタムフック: useViewBlogPostController', () => {
  it('記事タイトルが取得できる', () => {
    const { result } = renderHook(() => useViewBlogPostController());
    expect(result.current.title).toBe('記事タイトル');
  });
});
