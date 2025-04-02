import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ImageListProvider from '../../../../images/list/ImageListProvider';
import PopularPostsForm from './PopularPostsForm';
import PopularPostsFormProvider from './PopularPostsFormProvider';

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
      <PopularPostsFormProvider>
        <PopularPostsForm onSubmit={onSubmitMock} />
      </PopularPostsFormProvider>
    </ImageListProvider>,
  );
}

describe('PopularPostsForm', () => {
  it('人気記事を選択可能である', async () => {
    renderComponent();

    // 全てのチェックボックスを取得
    const checkboxes = await screen.findAllByRole('checkbox');

    // 4つ以上のlabelがあった方がテストに都合がいいので3より大きいことを確認
    expect(checkboxes.length).toBeGreaterThan(3);

    await clickCheckbox(0, 3);

    // 選択したチェックボックスが3つであることを確認
    expectCheckedCheckboxesLength(3);

    // 送信ボタンをクリック
    await clickSubmitButton();

    // onSubmitMockの引数に選択したチェックボックスのvalueが渡されていることを確認
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        popularPosts: getCheckedCheckboxesValue(),
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
  it('記事を3つ以上選択しないと送信できない', async () => {
    renderComponent();

    await checkTwoBoxes();

    // 送信ボタンをクリック
    await clickSubmitButton();

    // エラーメッセージが表示されていることを確認
    await expectDisplayErrorText();

    // onSubmitMock が呼ばれていないことを確認
    expect(onSubmitMock).not.toHaveBeenCalled();

    await checkFourBoxes();
    await expectDisplayErrorText();
    expect(onSubmitMock).not.toHaveBeenCalled();

    /* 以下ヘルパー関数 */
    function checkTwoBoxes() {
      return clickCheckbox(0, 2);
    }

    function checkFourBoxes() {
      return clickCheckbox(2, 5);
    }

    async function expectDisplayErrorText() {
      expect(
        await screen.findByText('人気記事は3件選択してください'),
      ).toBeInTheDocument();
    }
  });
});

/* 以下ヘルパー関数 */
async function clickSubmitButton() {
  const submitButton = screen.getByRole('button', { name: '保存' });
  await userEvent.click(submitButton);
}

async function clickCheckbox(start: number, end: number) {
  const checkboxes = await screen.findAllByRole('checkbox');
  await Promise.all(
    checkboxes.slice(start, end).map(async (checkbox) => {
      await userEvent.click(checkbox);
    }),
  );
}
