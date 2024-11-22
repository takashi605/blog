import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';

type ViewLatestBlogPostsPresenterProps = {
  blogPosts: BlogPostDTO[];
};

function ViewLatestBlogPostsPresenter({
  blogPosts,
}: ViewLatestBlogPostsPresenterProps) {
  return (
    <div>
      <h2>新着記事一覧</h2>
    </div>
  );
}
export default ViewLatestBlogPostsPresenter;
