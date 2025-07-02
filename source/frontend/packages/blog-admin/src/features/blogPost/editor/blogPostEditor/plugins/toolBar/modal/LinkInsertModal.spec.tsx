import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkInsertModal from './LinkInsertModal';

// Lexicalエディターのモック
const dispatchCommandMock = jest.fn();
const editorMock = {
  dispatchCommand: dispatchCommandMock,
};

jest.mock('@lexical/react/LexicalComposerContext', () => ({
  useLexicalComposerContext: jest.fn(() => [editorMock]),
}));

// CommonModalProviderのモック
const closeModalMock = jest.fn();
jest.mock('../../../../../../../components/modal/CommonModalProvider', () => ({
  useCommonModalContext: jest.fn(() => ({
    closeModal: closeModalMock,
  })),
}));

// CommonModalのモック（シンプルに子要素をレンダリング）
jest.mock('../../../../../../../components/modal/CommonModal', () => {
  return function MockCommonModal({ children }: { children: React.ReactNode }) {
    return <div data-testid="modal">{children}</div>;
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = () => {
  return render(<LinkInsertModal />);
};

describe('LinkInsertModal バリデーションテスト', () => {
  it('有効なURL（https）を入力してボタンを押すと、エラーメッセージが表示されない', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 有効なURLを入力
    await user.type(urlInput, 'https://example.com');
    await user.click(submitButton);

    // エラーメッセージが表示されていないことを確認
    expect(
      screen.queryByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).not.toBeInTheDocument();
  });

  it('有効なURL（http）を入力してボタンを押すと、エラーメッセージが表示されない', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 有効なURLを入力
    await user.type(urlInput, 'http://example.com');
    await user.click(submitButton);

    // エラーメッセージが表示されていないことを確認
    expect(
      screen.queryByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).not.toBeInTheDocument();
  });

  it('無効なURL（プロトコルなし）を入力してボタンを押すと、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 無効なURLを入力
    await user.type(urlInput, 'example.com');
    await user.click(submitButton);

    // エラーメッセージが表示されることを確認
    expect(
      screen.getByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).toBeInTheDocument();
  });

  it('空のURLでボタンを押すと、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 空のままボタンを押す
    await user.click(submitButton);

    // エラーメッセージが表示されることを確認
    expect(
      screen.getByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).toBeInTheDocument();
  });

  it('無効なURL（不正な形式）を入力してボタンを押すと、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 無効なURLを入力
    await user.type(urlInput, 'invalid-url');
    await user.click(submitButton);

    // エラーメッセージが表示されることを確認
    expect(
      screen.getByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).toBeInTheDocument();
  });

  it('エラーが表示された後に有効なURLを入力すると、エラーメッセージが消える', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // 最初に無効なURLを入力してエラーを表示
    await user.type(urlInput, 'invalid-url');
    await user.click(submitButton);

    // エラーメッセージが表示されることを確認
    expect(
      screen.getByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).toBeInTheDocument();

    // 入力フィールドをクリアして有効なURLを入力
    await user.clear(urlInput);
    await user.type(urlInput, 'https://example.com');

    // エラーメッセージが消えることを確認
    expect(
      screen.queryByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).not.toBeInTheDocument();
  });

  it('FTPプロトコルのURLを入力してボタンを押すと、エラーメッセージが表示されない', async () => {
    const user = userEvent.setup();
    renderComponent();

    const urlInput = screen.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    const submitButton = screen.getByRole('button', { name: 'リンクを挿入' });

    // FTPプロトコルのURLを入力
    await user.type(urlInput, 'ftp://example.com');
    await user.click(submitButton);

    // エラーメッセージが表示されていないことを確認
    expect(
      screen.queryByText(
        '有効なURL（http(s)://から始まるもの）を入力してください。',
      ),
    ).not.toBeInTheDocument();
  });
});
