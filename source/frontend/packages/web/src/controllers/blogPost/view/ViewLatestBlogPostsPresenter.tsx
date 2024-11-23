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
      <ul>
        {blogPosts.map((blogPost) => (
          <li key={blogPost.id}>
            <h3>{blogPost.title}</h3>
            <p>投稿日:{blogPost.postDate}</p>
            <img src={blogPost.thumbnail.path} alt="サムネイル画像" />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ViewLatestBlogPostsPresenter;
