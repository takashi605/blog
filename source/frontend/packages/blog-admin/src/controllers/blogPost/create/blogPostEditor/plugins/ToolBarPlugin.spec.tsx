import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ToolBarPlugin from './ToolBarPlugin';

describe('ToolBarPlugin', () => {
  it('h2 ボタンが存在している', () => {
    render(<ToolBarPlugin />);
    const h2Button = screen.getByRole('button', { name: 'h2' });
    expect(h2Button).toBeInTheDocument();
  });
});
