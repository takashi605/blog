import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';

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
      <h1>{blogPostResponse.title}</h1>
    </div>
  );
}
