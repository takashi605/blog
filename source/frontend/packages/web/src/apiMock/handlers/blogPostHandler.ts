import { http, HttpResponse } from 'msw';

export const blogPostHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/1`, () => {
    return HttpResponse.json(successResponse);
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/2`, () => {
    return HttpResponse.json({
      ...successResponse,
      postDate: '',
      lastUpdateDate: '',
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/1000`, () => {
    return new HttpResponse('Not found', {
      status: 404,
    });
  }),
];

const successResponse = {
  id: 1,
  title: '初めての技術スタックへの挑戦',
  thumbnail: {
    path: 'test-coffee',
  },
  postDate: '2022-01-01',
  lastUpdateDate: '2022-01-02',
  contents: [
    {
      type: 'paragraph',
      value:
        '新しい技術スタックに挑戦することは、いつも冒険と学びの場です。\
            未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。\
            未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。',
    },
    {
      type: 'h2',
      value: '最初のステップ',
    },
    {
      type: 'h3',
      value: '学習環境の準備',
    },
    {
      type: 'paragraph',
      value:
        'すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。\
            最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。\
            一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。\
            学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。\
            最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。',
    },
    {
      type: 'h2',
      value: '学びの中での気づき',
    },
    {
      type: 'h3',
      value: '試行錯誤の重要性',
    },
    {
      type: 'paragraph',
      value:
        '試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。\
            新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。\
            このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。繰り返しの実践が技術力を向上させる鍵です。\
            新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。',
    },
    {
      type: 'h3',
      value: '課題に対処するプロセス',
    },
    {
      type: 'paragraph',
      value:
        '技術の習得には多くの時間と試行錯誤が必要です。\
            途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。\
            失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。\
            問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。\
            このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。',
    },
  ],
};
