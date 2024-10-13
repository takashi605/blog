import BlogPostDate from '@/components/models/blogPost/ui/BlogPostDate';
import type { ViewBlogPost } from '@/usecases/view/output';

export type ContentProps = {
  type: string;
  value: string;
};

type ContentComponentType = (props: ContentProps) => JSX.Element | null;

export type BlogPostTitleProps = {
  children: React.ReactNode;
};

type BlogPostTitleComponent = (props: BlogPostTitleProps) => JSX.Element | null;

function ViewBlogPostController({
  blogPost,
  BlogPostTitleComponent,
  ContentComponent,
}: {
  blogPost: ViewBlogPost | null;
  BlogPostTitleComponent: BlogPostTitleComponent;
  ContentComponent: ContentComponentType;
}) {
  return (
    <div>
      <div>
        <BlogPostDate label="投稿日" date="2024/10/03" />
        <BlogPostDate label="更新日" date="2024/10/04" />
      </div>
      <BlogPostTitleComponent>{blogPost?.title}</BlogPostTitleComponent>
      {blogPost?.contents.map((content) => (
        <ContentComponent
          key={content.id}
          type={content.type}
          value={content.value}
        />
      ))}
    </div>
  );
}

export default ViewBlogPostController;
