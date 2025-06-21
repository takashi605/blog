'use client';
import { usePopularPostList } from './usePopularPostList';

function PopularPostList() {
  const { getAllPopularPosts } = usePopularPostList();

  return (
    <>
      <h2>現在の人気記事</h2>
      <ul>
        {getAllPopularPosts().map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PopularPostList;
