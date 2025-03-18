import CommonModalProvider from "../../components/modal/CommonModalProvider";
import ImageList from "../../controllers/images/list/ImageList";

export default function CreateBlogPostPage() {
  return (
    <div>
      <CommonModalProvider>
        <ImageList />
      </CommonModalProvider>
    </div>
  );
}
