import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolBarButton } from '../../controllers/blogPost/create/blogPostEditor/plugins/toolBar/parts/Button';
import CommonModalOpenButton from './CommonModalOpenButton';

const openModalMock = jest.fn();

// useCommonModalContextをモックする
jest.mock('./CommonModalProvider', () => ({
  useCommonModalContext: jest.fn(() => ({
    openModal: openModalMock,
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = (isModalOpenable: boolean = true) => {
  return render(
    <CommonModalOpenButton
      isModalOpenable={isModalOpenable}
      openFailMessage="モーダルを開けませんでした"
    >
      モーダルを開く
    </CommonModalOpenButton>,
  );
};

describe('commonModalOpenButton', () => {
  it('ボタンを押すとモーダルが開く関数が発火する', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderComponent();
    const button = getByRole('button', { name: 'モーダルを開く' });
    await user.click(button);
    expect(openModalMock).toHaveBeenCalledTimes(1);
  });

  it('isModalOpenableがfalseのとき、ボタンを押してもモーダルを開く関数が発火せずに失敗メッセージが表示される', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderComponent(false);
    const button = getByRole('button', { name: 'モーダルを開く' });
    await user.click(button);
    expect(openModalMock).not.toHaveBeenCalled();
    expect(screen.getByText('モーダルを開けませんでした')).toBeInTheDocument();
  });

  describe('ToolBarButton との統合テスト', () => {
    it('render props で ToolBarButton を渡すことができる', async () => {
      const user = userEvent.setup();

      render(
        <CommonModalOpenButton
          isModalOpenable={true}
          openFailMessage="モーダルを開けませんでした"
          renderButton={({ onClick, children }) => (
            <ToolBarButton
              onClick={onClick}
              ariaLabel="モーダルを開く"
              checked={false}
            >
              {children}
            </ToolBarButton>
          )}
        >
          モーダルを開く
        </CommonModalOpenButton>,
      );

      // ToolBarButtonは role="checkbox" と aria-label="モーダルを開く" 属性を持つ
      const button = screen.getByRole('checkbox', { name: 'モーダルを開く' });
      expect(button).toBeInTheDocument();

      // ボタンをクリックしてモーダルを開く関数が呼ばれることを確認
      await user.click(button);
      expect(openModalMock).toHaveBeenCalledTimes(1);
    });
  });
});
