import { createBlogPostAction } from '@/models/blogPost/create/formAction';

function CreateBlogPostForm() {
  return (
    <form role="form" onSubmit={createBlogPostAction}>
      <label htmlFor="title">タイトル</label>
      <input type="text" id="title" name="title" />
      <button type="submit">投稿</button>
    </form>
  );
}

export default CreateBlogPostForm;
