import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from 'shared-lib/src/api';
import { HttpError } from 'shared-lib/src/error/httpError';
import type { components } from 'shared-lib/src/generated/api-types';
import { z } from 'zod';
import ViewBlogPostController from '../../../features/blogPost/viewBlogPost/ViewBlogPostController';

type BlogPost = components['schemas']['BlogPost'];

/**
 * BlogPostから最初の段落のテキストを抜粋する
 * @param blogPost 記事データ
 * @returns 抜粋されたテキスト
 */
function extractFirstParagraphText(blogPost: BlogPost): string {
  const firstParagraph = blogPost.contents.find(
    (content) => content.type === 'paragraph',
  );
  const excerptedText = firstParagraph?.text?.map((text) => text.text).join('') ?? '';
  return excerptedText;
}

type ViewBlogPostParams = {
  params: {
    id: string;
  };
};

export async function generateMetadata(
  { params }: ViewBlogPostParams,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  let blogPost: BlogPost;
  try {
    // APIクライアントを直接使用して記事を取得
    blogPost = await api.get('/api/v2/blog/posts/{uuid}', {
      pathParams: { uuid: params.id },
    });
  } catch (e) {
    if (e instanceof HttpError || e instanceof z.ZodError) notFound();
    throw e;
  }
  const excerptedText = extractFirstParagraphText(blogPost);

  return {
    title: blogPost.title,
    description: excerptedText,
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
