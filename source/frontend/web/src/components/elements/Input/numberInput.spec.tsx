import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberInput from './NumberInput';
import { useInputState } from './numberInputHooks';

describe('コンポーネント: NumberInput', () => {
  it('渡した value が input に表示される', async () => {
    const handleChange = jest.fn();
    render(<NumberInput value="123" onChange={handleChange} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    expect(input).toHaveValue(123);
  });

  it('文字を入力すると onChange が発火する', async () => {
    const handleChange = jest.fn();
    render(<NumberInput value="123" onChange={handleChange} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    await userEvent.type(input, '123');

    // 123 と入力したので、onChange は 3 回発火する
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  describe('useInputState との連携', () => {
    it('useInputState で生成したデータを props に渡して連携できる', async () => {
      function InputWithUseInputState() {
        const { inputValue, handleChange } = useInputState('123');
        return <NumberInput value={inputValue} onChange={handleChange} />;
      }

      render(<InputWithUseInputState />);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      await userEvent.type(input, '456');

      // 渡したデータと合わせて、 123456 が表示される
      expect(input).toHaveValue(123456);
    });
  });
});
