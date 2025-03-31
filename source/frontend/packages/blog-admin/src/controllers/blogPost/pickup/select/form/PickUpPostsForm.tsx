'use client';
import { useBlogPostList } from '../../../list/useBlogPostList';

function PickUpPostsForm() {
  const { getAllBlogPosts } = useBlogPostList();

  return (
    <>
      <h2>ピックアップ記事を選択</h2>
      <ul>
        {getAllBlogPosts().map((blogPost) => (
          <label key={blogPost.id}>
            <input
              type="checkbox"
              value={blogPost.id}
              // {...register('pickupPosts')}
            />
            <h3>{blogPost.title}</h3>
            <br />
          </label>
        ))}
      </ul>
    </>
  );
}

export default PickUpPostsForm;
