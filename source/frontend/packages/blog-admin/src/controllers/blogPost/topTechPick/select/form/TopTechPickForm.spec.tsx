import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ImageListProvider from '../../../../images/list/ImageListProvider';
import TopTechPickForm from './TopTechPickForm';
import TopTechPickFormProvider from './TopTechPickFormProvider';

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

function renderComponent() {
  render(
    <ImageListProvider>
      <TopTechPickFormProvider>
        <TopTechPickForm onSubmit={onSubmitMock} />
      </TopTechPickFormProvider>
    </ImageListProvider>,
  );
}

describe('TopTechPickForm', () => {
  it('トップテック記事を選択可能である', async () => {
    renderComponent();

    // 全てのチェックボックスを取得
    const checkboxes = await screen.findAllByRole('checkbox');

    // 4つ以上のlabelがあった方がテストに都合がいいので3より大きいことを確認
    expect(checkboxes.length).toBeGreaterThan(3);

    await clickFirstCheckbox();

    // 選択したチェックボックスが1つであることを確認
    expectCheckedCheckboxesLength(1);

    // 送信ボタンをクリック
    await clickSubmitButton();

    // onSubmitMockの引数に選択したチェックボックスのvalueが渡されていることを確認
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        topTechPickPosts: getCheckedCheckboxesValue(),
      },
      expect.any(Object),
    );

    /* 以下ヘルパー関数 */
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
  });
  it('記事を1つのみ選択しないと送信できない', async () => {
    renderComponent();

    // 送信ボタンをクリック
    await clickSubmitButton();

    // エラーメッセージが表示されていることを確認
    await expectDisplayErrorText();

    // onSubmitMock が呼ばれていないことを確認
    expect(onSubmitMock).not.toHaveBeenCalled();

    // チェックボックスを2つ選択
    await checkTwoBoxes();

    // エラーメッセージが表示されていることを確認
    await expectDisplayErrorText();
    expect(onSubmitMock).not.toHaveBeenCalled();

    /* 以下ヘルパー関数 */
    async function checkTwoBoxes() {
      const checkboxes = await screen.findAllByRole('checkbox');
      await userEvent.click(checkboxes[0]);
      await userEvent.click(checkboxes[1]);
    }

    async function expectDisplayErrorText() {
      expect(
        await screen.findByText(
          'トップテック記事は必ず1つのみ選択してください',
        ),
      ).toBeInTheDocument();
    }
  });
});

/* 以下ヘルパー関数 */
async function clickSubmitButton() {
  const submitButton = screen.getByRole('button', { name: '保存' });
  await userEvent.click(submitButton);
}

async function clickFirstCheckbox() {
  const checkboxes = await screen.findAllByRole('checkbox');
  await userEvent.click(checkboxes[0]);
}
