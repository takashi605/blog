import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BlogPostFormProvider,
  useBlogPostFormContext,
} from './BlogPostFormProvider';
import TitleInput from './TitleInput';

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
          <TitleInput />
          <button type="submit">送信</button>
        </form>
      );
    };

    return (
      <BlogPostFormProvider>
        <TestForm />
      </BlogPostFormProvider>
    );
  };

  return render(<TestWrapper />);
};

describe('TitleInput', () => {
  it('タイトル入力フィールドが表示される', () => {
    renderWithProvider();

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('タイトルを入力できる', async () => {
    renderWithProvider();

    const titleInput = screen.getByLabelText('タイトル');
    await userEvent.type(titleInput, 'テストタイトル');

    expect(titleInput).toHaveValue('テストタイトル');
  });

  it('タイトル入力フィールドがフォームに正しく登録されている', () => {
    renderWithProvider();

    const titleInput = screen.getByLabelText('タイトル');
    expect(titleInput).toHaveAttribute('name', 'title');
    expect(titleInput).toHaveAttribute('id', 'title');
  });

  describe('必須バリデーション', () => {
    it('タイトルが未入力の場合、エラーメッセージが表示される', async () => {
      renderWithProvider();

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('タイトルが入力されている場合、エラーメッセージが表示されない', async () => {
      renderWithProvider();

      const titleInput = screen.getByLabelText('タイトル');
      await userEvent.type(titleInput, 'テストタイトル');

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      expect(screen.queryByText('タイトルは必須です')).not.toBeInTheDocument();
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'テストタイトル',
        }),
        expect.any(Object),
      );
    });
  });
});
