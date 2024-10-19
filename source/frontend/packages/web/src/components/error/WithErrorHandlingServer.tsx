function WithErrorHandlingServer<T>(
  Component: (props: T) => Promise<JSX.Element>,
  errorMessage: string,
): (props: T) => Promise<JSX.Element> {
  return async function (props: T) {
    try {
      return await Component(props);
    } catch {
      return <div>{errorMessage}</div>;
    }
  };
}

export default WithErrorHandlingServer;
