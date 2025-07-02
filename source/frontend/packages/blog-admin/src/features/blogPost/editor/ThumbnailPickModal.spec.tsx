import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import {
  BlogPostFormProvider,
  useBlogPostFormContext,
} from './form/BlogPostFormProvider';
import ThumbnailPickModalWithOpenButton from './ThumbnailPickModal';

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
          <CommonModalProvider>
            <ThumbnailPickModalWithOpenButton />
          </CommonModalProvider>
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

describe('ThumbnailPickModalWithOpenButton', () => {
  describe('必須バリデーション', () => {
    it('サムネイル画像が未選択の場合、エラーメッセージが表示される', async () => {
      renderWithProvider();

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      expect(
        await screen.findByText('サムネイル画像は必須です'),
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('エラーメッセージにrole="alert"が設定されている', async () => {
      renderWithProvider();

      const submitButton = screen.getByRole('button', { name: '送信' });
      await userEvent.click(submitButton);

      const errorMessage = await screen.findByText('サムネイル画像は必須です');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });
});
