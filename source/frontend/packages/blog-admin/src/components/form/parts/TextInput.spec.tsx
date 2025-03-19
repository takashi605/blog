import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TextInput from './TextInput';

const renderComponent = () => {
  return render(<TextInput id="testId" label="ラベル" />);
};

describe('TextInput', () => {
  it('ラベルが表示されること', () => {
    const { getByText } = renderComponent();
    expect(getByText('ラベル')).toBeInTheDocument();
  });
  it('文字を入力できること', () => {
    const { getByRole } = renderComponent();
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
  it('id によりラベルと input が紐づいていること', () => {
    const { getByLabelText } = renderComponent();
    const input = getByLabelText('ラベル');
    expect(input).toBeInTheDocument();
  });
});
