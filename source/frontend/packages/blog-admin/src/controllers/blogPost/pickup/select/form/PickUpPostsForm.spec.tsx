import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ImageListProvider from '../../../../images/list/ImageListProvider';
import PickUpPostsForm from './PickUpPostsForm';
import PickUpPostsFormProvider from './PickUpPostsFormProvider';

const onSubmitMock = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
});

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
        <PickUpPostsFormProvider>
          <PickUpPostsForm onSubmit={onSubmitMock} />
        </PickUpPostsFormProvider>
      </ImageListProvider>,
    );

    // 全てのチェックボックスを取得
    const checkboxes = await screen.findAllByRole('checkbox');

    // 4つ以上のlabelがあった方がテストに都合がいいので3より大きいことを確認
    expect(checkboxes.length).toBeGreaterThan(3);

    clickFirstThreeCheckboxes(checkboxes);

    // 選択したチェックボックスが3つであることを確認
    expectCheckedCheckboxesLength(3);

    // 送信ボタンをクリック
    await clickSubmitButton();

    // onSubmitMockの引数に選択したチェックボックスのvalueが渡されていることを確認
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        pickUpPosts: getCheckedCheckboxesValue(),
      },
      expect.any(Object),
    );

    /* 以下ヘルパー関数 */
    function clickFirstThreeCheckboxes(checkboxes: HTMLElement[]) {
      checkboxes.slice(0, 3).forEach((checkbox) => {
        checkbox.click();
      });
    }

    function expectCheckedCheckboxesLength(expected: number) {
      const checkedCheckboxes = screen.getAllByRole('checkbox', {
        checked: true,
      });
      expect(checkedCheckboxes.length).toBe(expected);
    }

    function getCheckedCheckboxesValue() {
      return screen
        .getAllByRole('checkbox', { checked: true })
        .map((checkbox) => checkbox.getAttribute('value'));
    }

    async function clickSubmitButton() {
      const submitButton = screen.getByRole('button', { name: '保存' });
      await userEvent.click(submitButton);
    }
  });
});
