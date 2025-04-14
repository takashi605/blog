'use client';
import { useTopTechPickPostList } from './useTopTechPickPostView';

function TopTechPickPostList() {
  const { getTopTechPickPost } = useTopTechPickPostList();
  const post = getTopTechPickPost();

  return (
    <>
      <h2>現在のトップテックピック記事</h2>
      <h3>{post?.title}</h3>
    </>
  );
}

export default TopTechPickPostList;
