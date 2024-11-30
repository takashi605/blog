import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  return <div>
    <h2>{blogPostDTO.title}</h2>
  </div>;
}

export default ViewTopTechPickPresenter;
