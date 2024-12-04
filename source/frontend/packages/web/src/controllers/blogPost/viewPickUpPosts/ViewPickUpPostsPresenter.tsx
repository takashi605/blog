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
