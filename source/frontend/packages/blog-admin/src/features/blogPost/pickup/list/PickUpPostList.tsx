'use client';
import PostList from '../../list/PostList';
import { usePickUpPostList } from './usePickUpPostList';

function PickUpPostList() {
  const { getAllPickUpPosts } = usePickUpPostList();

  return (
    <PostList
      title="現在のピックアップ記事"
      posts={getAllPickUpPosts()}
      emptyMessage="ピックアップ記事が設定されていません"
    />
  );
}

export default PickUpPostList;
