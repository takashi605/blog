'use client';
import PostList from '../../list/PostList';
import { usePopularPostList } from './usePopularPostList';

function PopularPostList() {
  const { getAllPopularPosts } = usePopularPostList();

  return (
    <PostList
      title="現在の人気記事"
      posts={getAllPopularPosts()}
      emptyMessage="人気記事が設定されていません"
    />
  );
}

export default PopularPostList;
