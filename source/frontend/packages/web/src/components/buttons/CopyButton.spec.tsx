import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyButton from './CopyButton';

// Clipboard API をモックする
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

document.execCommand = jest.fn();

describe('CopyButton', () => {
  it('クリックすると文字列を clipboard に書き込む', async () => {
    render(<CopyButton textForCopy="hello world" label="Copy" />);

    // ボタンをクリック
    await userEvent.click(screen.getByRole('button', { name: /copy/i }));

    // Clipboard API が呼び出されたことを確認
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
  });

  it('コピー成功後に "Copied!" 表示が出る', async () => {
    render(<CopyButton textForCopy="hello world" label="Copy" />);

    const button = screen.getByRole('button', { name: /copy/i });
    await userEvent.click(button);

    // コピー成功メッセージが表示されるまで待機
    await screen.findByText('Copied!');
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(button).toHaveTextContent('Copied!');
  });
});
