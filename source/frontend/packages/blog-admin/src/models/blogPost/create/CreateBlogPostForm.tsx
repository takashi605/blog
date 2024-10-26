import { createBlogPostAction } from '@/models/blogPost/create/formAction';

function CreateBlogPostForm() {
  return (
    <form role="form" onSubmit={createBlogPostAction}>
      <button type="submit">投稿</button>
    </form>
  );
}

export default CreateBlogPostForm;
