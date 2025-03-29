'use client';
import { useBlogPostList } from '../../../list/useBlogPostList';

function PickUpPostsForm() {
  const { getAllBlogPosts } = useBlogPostList();

  return (
    <>
      <h2>ピックアップ記事を選択</h2>
      <ul>
        {getAllBlogPosts().map((blogPost) => (
          <li key={blogPost.id}>
            <h3>{blogPost.title}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PickUpPostsForm;
