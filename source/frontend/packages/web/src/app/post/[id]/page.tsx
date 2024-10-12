type ViewBlogPostParams = {
  params: {
    id: number;
  };
};

export default function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;

  return (
    <div>
      <h1>Post {postId}</h1>
    </div>
  );
}
