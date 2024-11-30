import ViewTopTechPickController from '../controllers/blogPost/viewTopTechPick/ViewTopTechPickController';

export default async function Home() {
  return (
    <main>
      <h2>トップページ</h2>
      <ViewTopTechPickController />
    </main>
  );
}
