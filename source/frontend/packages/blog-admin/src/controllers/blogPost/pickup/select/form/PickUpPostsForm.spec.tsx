import { render, screen } from '@testing-library/react';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ImageListProvider from '../../../../images/list/ImageListProvider';
import PickUpPostsForm from './PickUpPostsForm';

const mockApiForServer = setupMockApiForServer(
  process.env.NEXT_PUBLIC_API_URL!,
);
beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('PickUpPostsForm', () => {
  it('ピックアップ記事を選択可能である', async () => {
    render(
      <ImageListProvider>
        <PickUpPostsForm />
      </ImageListProvider>,
    );

    // 全てのチェックボックスを取得
    const checkboxes = await screen.findAllByRole('checkbox');

    // 4つ以上のlabelがあった方がテストに都合がいいので3より大きいことを確認
    expect(checkboxes.length).toBeGreaterThan(3);

    // 上から3つまでのチェックボックスを選択
    checkboxes.slice(0, 3).forEach((checkbox) => {
      checkbox.click();
    });

    // 選択したチェックボックスが3つであることを確認
    const checkedCheckboxes = screen.getAllByRole('checkbox', {
      checked: true,
    });
    expect(checkedCheckboxes.length).toBe(3);
  });
});
