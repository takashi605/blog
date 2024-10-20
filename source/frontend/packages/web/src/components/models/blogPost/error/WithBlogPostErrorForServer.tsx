import { HttpError } from '@/components/models/error/httpError';
import { UsecaseError } from '@/usecases/error';
import { EntityError } from 'entities/src/error/error';

function WithErrorHandlingServer<T>(
  Component: (props: T) => Promise<JSX.Element>,
): (props: T) => Promise<JSX.Element> {
  return async function (props: T) {
    try {
      return await Component(props);
    } catch (error) {
      if (error instanceof UsecaseError || error instanceof EntityError) {
        return <div>記事データを生成できませんでした</div>;
      }
      if (error instanceof HttpError) {
        return <div>記事データの取得に失敗しました</div>;
      }
      return <div>不明なエラーです。</div>;
    }
  };
}

export default WithErrorHandlingServer;
