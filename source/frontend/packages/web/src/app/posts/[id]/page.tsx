import type { Metadata, ResolvingMetadata } from 'next';
import ViewBlogPostController from '../../../controllers/blogPost/viewBlogPost/ViewBlogPostController';

type ViewBlogPostParams = {
  params: {
    id: string;
  };
};

export async function generateMetadata(
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  // const post = await getBlogPost(params.id);

  return {
    title: '記事タイトル',
    description: '記事の説明文',
  };
}

async function ViewBlogPost({ params }: ViewBlogPostParams) {
  const { id: postId } = params;

  return (
    <div>
      <ViewBlogPostController postId={postId} />
    </div>
  );
}

export default ViewBlogPost;
