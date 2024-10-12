import ViewBlogPostController from '@/components/models/blogPost/controllers/ViewBlogPostController';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import ContentRenderer from '@/components/models/blogPost/ui/contents/Content';

type ViewBlogPostParams = {
  params: {
    id: number;
  };
};

export default async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;
  const blogPostResponse = await fetchBlogPost(postId);

  return (
    <div>
      <ViewBlogPostController
        blogPost={blogPostResponse}
        ContentComponent={ContentRenderer}
      />
    </div>
  );
}
