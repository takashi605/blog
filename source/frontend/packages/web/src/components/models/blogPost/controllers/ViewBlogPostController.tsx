import { useViewBlogPostController } from '@/components/models/blogPost/controllers/viewBlogPostControllerHooks';

export type ContentProps = {
  type: string;
  value: string;
};

function ViewBlogPostController() {
  const { title, contents } = useViewBlogPostController(1);

  return (
    <div>
      <h1>{title}</h1>
      {contents.map((content) =>
        content.type === 'h2' ? (
          <div key={content.id}>
            <h2>{content.value}</h2>
          </div>
        ) : content.type === 'h3' ? (
          <div key={content.id}>
            <h3>{content.value}</h3>
          </div>
        ) : content.type === 'paragraph' ? (
          <div key={content.id}>
            <p>{content.value}</p>
          </div>
        ) : null,
      )}
    </div>
  );
}

export default ViewBlogPostController;
