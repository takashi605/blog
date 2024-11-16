import type { DefaultBodyType, HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { blogPostResponseSchema } from '../../repositories/apiBlogPostRepository';

export const createdBlogPosts: BlogPostDTO[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const createBlogPostHandlers = (baseUrl: string): HttpHandler[] => {
  const blogPostHandlers = [
    http.post(`${baseUrl}/posts`, async ({ request }) => {
      let newPost: DefaultBodyType;
      try {
        newPost = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }
      createdBlogPosts.push(blogPostResponseSchema.parse(newPost));
      return HttpResponse.json(newPost, { status: 200 });
    }),
    http.get(`${baseUrl}/blog/posts/1`, () => {
      return HttpResponse.json(successResponseForGet);
    }),
    http.get(`${baseUrl}/blog/posts/2`, () => {
      return HttpResponse.json({
        ...successResponseForGet,
        postDate: '',
        lastUpdateDate: '',
      });
    }),
    http.get(`${baseUrl}/blog/posts/1000`, () => {
      return new HttpResponse('Not found', {
        status: 404,
      });
    }),
  ];
  return blogPostHandlers;
};

const successResponseForGet = {
  id: 1,
  title: '初めての技術スタックへの挑戦',
  thumbnail: {
    path: 'test-coffee',
  },
  postDate: '2022-01-01',
  lastUpdateDate: '2022-01-02',
  contents: [
    {
      id: 1,
      type: 'paragraph',
      text: '新しい技術スタックに挑戦することは、いつも冒険と学びの場です。\
            未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。\
            未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。',
    },
    {
      id: 2,
      type: 'h2',
      text: '最初のステップ',
    },
    {
      id: 3,
      type: 'h3',
      text: '学習環境の準備',
    },
    {
      id: 4,
      type: 'paragraph',
      text: 'すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。\
            最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。\
            一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。\
            学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。\
            最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。',
    },
    {
      id: 5,
      type: 'h2',
      text: '学びの中での気づき',
    },
    {
      id: 6,
      type: 'h3',
      text: '試行錯誤の重要性',
    },
    {
      id: 7,
      type: 'paragraph',
      text: '試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。\
            新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。\
            このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。繰り返しの実践が技術力を向上させる鍵です。\
            新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。',
    },
    {
      id: 8,
      type: 'h3',
      text: '課題に対処するプロセス',
    },
    {
      id: 9,
      type: 'image',
      path: 'test-book',
    },
    {
      id: 10,
      type: 'paragraph',
      text: '技術の習得には多くの時間と試行錯誤が必要です。\
            途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。\
            失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。\
            問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。\
            このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。',
    },
  ],
};
