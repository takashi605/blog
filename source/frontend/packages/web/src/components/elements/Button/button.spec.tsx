import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('コンポーネント: Button', () => {
  it('children で受け取った buttonText が表示されている', () => {
    render(<Button onClick={jest.fn()}>押下</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('押下');
  });

  it('指定した name を通じて要素を取得できる', () => {
    render(
      <Button onClick={jest.fn()} name="test">
        押下
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'test' });
    expect(button).toHaveAttribute('name', 'test');
  });

  it('ボタンをクリックすると handleClick が発火する', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>押下</Button>);
    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
