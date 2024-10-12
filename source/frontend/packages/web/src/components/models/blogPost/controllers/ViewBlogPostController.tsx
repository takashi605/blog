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
