import ViewBlogPostController from '@/components/models/blogPost/controllers/ViewBlogPostController';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import BlogPostTitle from '@/components/models/blogPost/ui/BlogPostTitle';
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
      <p>test</p>
      <ViewBlogPostController
        blogPost={blogPostResponse}
        BlogPostTitleComponent={BlogPostTitle}
        ContentComponent={ContentRenderer}
      />
    </div>
  );
}
