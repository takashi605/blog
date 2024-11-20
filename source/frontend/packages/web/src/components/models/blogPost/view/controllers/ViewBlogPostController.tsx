import Thumbnail from '@/components/models/blogPost/view/controllers/Thumbnail';
import BlogPostDate from '@/components/models/blogPost/view/ui/BlogPostDate';
import BlogPostTitle from '@/components/models/blogPost/view/ui/BlogPostTitle';
import ContentRenderer from '@/components/models/blogPost/view/ui/contents/Content';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { ViewBlogPostUseCase } from '../../../../../usecases/view/viewBlogPost';
import styles from './viewBlogPostController.module.scss';

type ViewBlogPostControllerProps = {
  postId: string;
};

async function ViewBlogPostController({ postId }: ViewBlogPostControllerProps) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL が設定されていません');
  }
  const blogPostRepository = new ApiBlogPostRepository(
    process.env.NEXT_PUBLIC_API_URL,
  );
  const blogPostDTO = await new ViewBlogPostUseCase(blogPostRepository).execute(
    postId,
  );

  return <ViewBlogPostPresenter blogPost={blogPostDTO} />;
}

export default ViewBlogPostController;

type ViewBlogPostPresenterProps = {
  blogPost: BlogPostDTO;
};

// TODO メモ化する
export function ViewBlogPostPresenter({
  blogPost,
}: ViewBlogPostPresenterProps) {
  return (
    <article className={styles.article}>
      <div className={styles.datesWrapper}>
        <BlogPostDate label="投稿日" date={blogPost.postDate} />
        <BlogPostDate label="更新日" date={blogPost.lastUpdateDate} />
      </div>
      <div className={styles.blogTitle}>
        <BlogPostTitle>{blogPost?.title}</BlogPostTitle>
      </div>
      <Thumbnail thumbnail={blogPost.thumbnail} />
      {blogPost?.contents.map((content) => (
        <div key={content.id} className={generateContentClass(content.type)}>
          <ContentRenderer content={content} />
        </div>
      ))}
    </article>
  );
}

function generateContentClass(type: string): string | undefined {
  switch (type) {
    case 'paragraph':
      return styles.paragraph;
    case 'h2':
      return styles.h2;
    case 'h3':
      return styles.h3;
    default:
      return undefined;
  }
}
