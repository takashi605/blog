import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { useExcerpted } from '../hooks/useExcerpted';
import Thumbnail from '../ui/Thumbnail';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  const excerpted = useExcerpted(blogPostDTO.contents);
  return (
    <div>
      <h2>{blogPostDTO.title}</h2>
      <Thumbnail thumbnail={blogPostDTO.thumbnail} />
      <time>{blogPostDTO.postDate}</time>
      <p>{excerpted}</p>
    </div>
  );
}

export default ViewTopTechPickPresenter;
