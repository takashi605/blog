import type { ViewBlogPost } from '@/usecases/view/output';

export type ContentProps = {
  type: string;
  value: string;
};

type ContentComponentType = (props: ContentProps) => JSX.Element | null;

function ViewBlogPostController({
  blogPost,
  ContentComponent,
}: {
  blogPost: ViewBlogPost | null;
  ContentComponent: ContentComponentType;
}) {
  return (
    <div>
      <h1>{blogPost?.title}</h1>
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
