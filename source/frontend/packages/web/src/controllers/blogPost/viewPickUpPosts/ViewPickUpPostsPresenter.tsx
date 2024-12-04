import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import Thumbnail from '../ui/Thumbnail';

type ViewPickUpPostsPresenterProps = {
  blogPostsDTO: BlogPostDTO[];
};

function ViewPickUpPostsPresenter({
  blogPostsDTO,
}: ViewPickUpPostsPresenterProps) {
  return (
    <div>
      <div>
        <span>PICK UP!!</span>
        <h2>注目記事</h2>
        <div>
          <p>幅広い人におすすめの記事です。</p>
          <p>このブログの雰囲気を掴んでいただけると思います。</p>
        </div>
      </div>
      {blogPostsDTO.map((blogPostDTO) => (
        <div key={blogPostDTO.id}>
          <h3>{blogPostDTO.title}</h3>
          <Thumbnail thumbnail={blogPostDTO.thumbnail} />
        </div>
      ))}
    </div>
  );
}

export default ViewPickUpPostsPresenter;
