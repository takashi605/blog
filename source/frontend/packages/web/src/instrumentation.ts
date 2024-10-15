export async function register() {
  // "msw/node"がNode.jsランタイムでのみ利用可能なため、
  // ランタイムがNode.jsの場合のみサーバー側のモックを有効にする
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { mockApiForServer } = await import('@/apiMock/serverForNode');
    mockApiForServer.listen();
  }
}
