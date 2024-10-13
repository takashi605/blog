import type {
  BlogPostContentProps,
  BlogPostDateProps,
  BlogPostTitleProps,
} from '@/components/models/blogPost/view/controllers/types';
import type { ViewBlogPost } from '@/usecases/view/output';

type ViewBlogPostControllerProps = {
  blogPost: ViewBlogPost | null;
  Title: Title;
  Date: Date;
  Content: Content;
};

// render props するコンポーネントのインターフェースを定義
type Content = (props: BlogPostContentProps) => JSX.Element | null;
type Title = (props: BlogPostTitleProps) => JSX.Element;
type Date = (props: BlogPostDateProps) => JSX.Element;

function ViewBlogPostController({
  blogPost,
  Title,
  Date,
  Content,
}: ViewBlogPostControllerProps) {
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

export default ViewBlogPostController;
