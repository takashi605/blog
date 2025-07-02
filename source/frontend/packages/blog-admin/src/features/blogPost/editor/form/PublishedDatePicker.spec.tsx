import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BlogPostFormProvider,
  useBlogPostFormContext,
} from './BlogPostFormProvider';
import PublishedDatePicker from './PublishedDatePicker';

const onSubmitMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const renderWithProvider = () => {
  const TestWrapper = () => {
    const TestForm = () => {
      const { handleSubmit } = useBlogPostFormContext();

      return (
        <form onSubmit={handleSubmit(onSubmitMock)}>
          <PublishedDatePicker />
          <button type="submit">送信</button>
        </form>
      );
    };

    return (
      <BlogPostFormProvider
        defaultValues={{
          title: '',
          thumbnail: { id: '', path: '' },
          publishedDate: '',
        }}
      >
        <TestForm />
      </BlogPostFormProvider>
    );
  };

  return render(<TestWrapper />);
};

describe('PublishedDatePicker', () => {
  it('公開日のラベルとinputが表示される', () => {
    renderWithProvider();

    expect(screen.getByLabelText('公開日')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('form contextに登録される', () => {
    renderWithProvider();

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('name', 'publishedDate');
  });

  describe('必須バリデーション', () => {
    it('公開日が未入力の場合、エラーメッセージが表示される', async () => {
      renderWithProvider();

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      expect(
        await screen.findByText('公開日を選択してください'),
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('公開日が入力されている場合、エラーメッセージが表示されない', async () => {
      renderWithProvider();

      const input = screen.getByRole('combobox');
      await userEvent.clear(input);
      await userEvent.type(input, '2023-12-31');

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      expect(
        screen.queryByText('公開日を選択してください'),
      ).not.toBeInTheDocument();
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          publishedDate: '2023-12-31',
        }),
        expect.any(Object),
      );
    });
  });
});
