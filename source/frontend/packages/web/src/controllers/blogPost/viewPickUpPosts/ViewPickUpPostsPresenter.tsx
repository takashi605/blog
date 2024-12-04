import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type ViewPickUpPostsPresenterProps = {
  blogPostsDTO: BlogPostDTO[];
};

function ViewPickUpPostsPresenter({ blogPostsDTO }: ViewPickUpPostsPresenterProps) {
  console.log(blogPostsDTO);
  return <div>ViewPickUpPostsPresenter</div>;
}

export default ViewPickUpPostsPresenter;
