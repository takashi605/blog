import WithBlogPostErrorForServer from '@/components/models/blogPost/error/WithBlogPostErrorForServer';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import ViewBlogPostController from '@/components/models/blogPost/view/controllers/ViewBlogPostController';
import BlogPostDate from '@/components/models/blogPost/view/ui/BlogPostDate';
import BlogPostTitle from '@/components/models/blogPost/view/ui/BlogPostTitle';
import ContentRenderer from '@/components/models/blogPost/view/ui/contents/Content';

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
      <ViewBlogPostController
        blogPost={blogPostResponse}
        Title={BlogPostTitle}
        Date={BlogPostDate}
        Content={ContentRenderer}
      />
    </div>
  );
}

export default WithBlogPostErrorForServer(ViewBlogPost);
