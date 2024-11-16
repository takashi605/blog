export async function register() {
  // "msw/node"がNode.jsランタイムでのみ利用可能なため、
  // ランタイムがNode.jsの場合のみサーバー側のモックを有効にする
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupMockApiForServer } = await import(
      'shared-interface-adapter/src/apiMocks/serverForNode'
    );
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL が設定されていません');
    }
    const mockApiForServer = setupMockApiForServer(
      process.env.NEXT_PUBLIC_API_URL,
    );
    mockApiForServer.listen();
  }
}
