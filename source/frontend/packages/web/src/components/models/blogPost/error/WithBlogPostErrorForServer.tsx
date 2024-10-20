function WithErrorHandlingServer<T>(
  Component: (props: T) => Promise<JSX.Element>,
): (props: T) => Promise<JSX.Element> {
  return async function (props: T) {
    try {
      return await Component(props);
    } catch {
      return <div>不明なエラーです。</div>;
    }
  };
}

export default WithErrorHandlingServer;
