import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

describe('/', () => {
  it('数値を入力できる input が2つ存在する', async () => {
    render(<Home />);

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(inputs).toHaveLength(2);

    await userEvent.type(inputs[0], '123');
    expect(inputs[0]).toHaveValue(123);

    await userEvent.type(inputs[1], '456');
    expect(inputs[1]).toHaveValue(456);
  });

  it('「5・6」と書かれたボタンをクリックすると、input それぞれに「5」「6」といった数値が入る', async () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: 'fivesix' });
    expect(button).toHaveTextContent('5・6');
    await userEvent.click(button);

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(inputs[0]).toHaveValue(5);
    expect(inputs[1]).toHaveValue(6);
  })

  it('「計算」と書かれたボタンをクリックすると、計算結果が表示される', async () => {
    render(<Home />);
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const button = screen.getByRole('button',{ name: 'calc' });

    // 計算1
    await userEvent.type(inputs[0], '101');
    await userEvent.type(inputs[1], '202');
    await userEvent.click(button);

    expect(screen.getByText('303')).toBeInTheDocument();

    await userEvent.clear(inputs[0]);
    await userEvent.clear(inputs[1]);

    // 計算2
    await userEvent.type(inputs[0], '12');
    await userEvent.type(inputs[1], '23');
    await userEvent.click(button);

    expect(screen.getByText('35')).toBeInTheDocument();
  });
});
