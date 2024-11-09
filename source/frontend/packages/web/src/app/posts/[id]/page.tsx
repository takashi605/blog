import WithBlogPostErrorForServer from '@/components/models/blogPost/error/WithBlogPostErrorForServer';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import ViewBlogPostController from '@/components/models/blogPost/view/controllers/ViewBlogPostController';

type ViewBlogPostParams = {
  params: {
    id: number;
  };
};

async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;
  const blogPostResponse = await fetchBlogPost(postId);

  return (
    <div>
      <ViewBlogPostController blogPost={blogPostResponse} />
    </div>
  );
}

export default WithBlogPostErrorForServer(ViewBlogPost);
