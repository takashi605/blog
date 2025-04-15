import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const { getByRole } = renderComponent();
    const button = getByRole('button', { name: 'モーダルを開く' });
    await userEvent.click(button);
    expect(openModalMock).toHaveBeenCalledTimes(1);
  });

  it('isModalOpenableがfalseのとき、ボタンを押してもモーダルを開く関数が発火せずに失敗メッセージが表示される', async () => {
    const { getByRole } = renderComponent(false);
    const button = getByRole('button', { name: 'モーダルを開く' });
    await userEvent.click(button);
    expect(openModalMock).not.toHaveBeenCalled();
    expect(screen.getByText('モーダルを開けませんでした')).toBeInTheDocument();
  });
});
