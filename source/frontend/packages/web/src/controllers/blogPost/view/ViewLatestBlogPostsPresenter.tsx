import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import Thumbnail from './ui/Thumbnail';

type ViewLatestBlogPostsPresenterProps = {
  blogPosts: BlogPostDTO[];
};

function ViewLatestBlogPostsPresenter({
  blogPosts,
}: ViewLatestBlogPostsPresenterProps) {
  return (
    <div>
      <h2>新着記事一覧</h2>
      <ul>
        {blogPosts.map((blogPost) => (
          <li key={blogPost.id}>
            <h3>{blogPost.title}</h3>
            <p>投稿日:{blogPost.postDate}</p>
            <Thumbnail thumbnail={blogPost.thumbnail} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ViewLatestBlogPostsPresenter;
