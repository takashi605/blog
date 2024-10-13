import type { ViewBlogPost } from '@/usecases/view/output';

function ViewBlogPostController({
  blogPost,
  Title,
  Date,
  Content,
}: {
  blogPost: ViewBlogPost | null;
  Title: Title;
  Date: Date;
  Content: Content;
}) {
  return (
    <div>
      <div>
        <Date label="投稿日" date="2024/10/03" />
        <Date label="更新日" date="2024/10/04" />
      </div>
      <Title>{blogPost?.title}</Title>
      {blogPost?.contents.map((content) => (
        <Content key={content.id} type={content.type} value={content.value} />
      ))}
    </div>
  );
}

// render props するコンポーネントのインターフェースを定義
export type ContentProps = {
  type: string;
  value: string;
};
type Content = (props: ContentProps) => JSX.Element | null;

export type BlogPostTitleProps = {
  children: React.ReactNode;
};
type Title = (props: BlogPostTitleProps) => JSX.Element;

export type BlogPostDateProps = {
  label: string;
  date: string;
};
type Date = (props: BlogPostDateProps) => JSX.Element;

export default ViewBlogPostController;
