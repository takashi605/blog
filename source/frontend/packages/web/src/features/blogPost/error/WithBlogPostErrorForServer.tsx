import { HttpError } from 'shared-lib/src/error/httpError';

function WithErrorHandlingServer<T>(
  Component: (props: T) => Promise<JSX.Element>,
): (props: T) => Promise<JSX.Element> {
  return async function (props: T) {
    try {
      return await Component(props);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 404) {
          return <div>記事が見つかりませんでした</div>;
        }
        return <div>記事データの取得に失敗しました</div>;
      }
      return <div>不明なエラーです。</div>;
    }
  };
}

export default WithErrorHandlingServer;
