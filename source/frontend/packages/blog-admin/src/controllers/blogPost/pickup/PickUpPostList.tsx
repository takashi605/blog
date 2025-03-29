'use client';
import { usePickUpPostList } from './usePickUpPostList';

function PickUpPostList() {
  const { getAllPickUpPosts } = usePickUpPostList();

  return (
    <>
      <h2>現在のピックアップ記事</h2>
      <ul>
        {getAllPickUpPosts().map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PickUpPostList;
