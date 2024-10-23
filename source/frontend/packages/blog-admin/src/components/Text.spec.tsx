import Text from '@/components/Text';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('text', () => {
  it('「Hello World!」と表示される', () => {
    const screen = render(<Text />);
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });
});
