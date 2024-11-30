import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import Thumbnail from '../ui/Thumbnail';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  return <div>
    <h2>{blogPostDTO.title}</h2>
    <Thumbnail thumbnail={blogPostDTO.thumbnail} />
    <p>{blogPostDTO.postDate}</p>
  </div>;
}

export default ViewTopTechPickPresenter;
