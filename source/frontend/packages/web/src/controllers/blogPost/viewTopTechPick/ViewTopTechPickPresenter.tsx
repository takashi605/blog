import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  console.log(blogPostDTO);
  return <div></div>;
}

export default ViewTopTechPickPresenter;
