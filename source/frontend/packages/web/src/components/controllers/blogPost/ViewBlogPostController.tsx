import { useViewBlogPostController } from '@/components/controllers/blogPost/viewBlogPostControllerHooks';

function ViewBlogPostController() {
  const { title } = useViewBlogPostController();

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

export default ViewBlogPostController;
