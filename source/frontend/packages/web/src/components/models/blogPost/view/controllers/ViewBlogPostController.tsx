import type { ViewBlogPost } from '@/usecases/view/output';

function ViewBlogPostController({
  blogPost,
  BlogPostTitleComponent,
  BlogPostDateComponent,
  ContentComponent,
}: {
  blogPost: ViewBlogPost | null;
  BlogPostTitleComponent: BlogPostTitleComponent;
  BlogPostDateComponent: BlogPostDateComponent;
  ContentComponent: ContentComponentType;
}) {
  return (
    <div>
      <div>
        <BlogPostDateComponent label="投稿日" date="2024/10/03" />
        <BlogPostDateComponent label="更新日" date="2024/10/04" />
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

export type ContentProps = {
  type: string;
  value: string;
};
type ContentComponentType = (props: ContentProps) => JSX.Element | null;

export type BlogPostTitleProps = {
  children: React.ReactNode;
};
type BlogPostTitleComponent = (props: BlogPostTitleProps) => JSX.Element;

export type BlogPostDateProps = {
  label: string;
  date: string;
};
type BlogPostDateComponent = (props: BlogPostDateProps) => JSX.Element;

export default ViewBlogPostController;
