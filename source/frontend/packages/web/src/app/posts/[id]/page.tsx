import ViewBlogPostController from '../../../controllers/blogPost/viewBlogPost/ViewBlogPostController';

type ViewBlogPostParams = {
  params: {
    id: string;
  };
};

async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;

  return (
    <div>
      <ViewBlogPostController postId={postId} />
    </div>
  );
}

export default ViewBlogPost;
