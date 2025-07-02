import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUploadForm from './ImageUploadForm';
import ImageUploadFormProvider from './ImageUploadFormProvider';

const onSubmitMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

type OptionProps = {
  errorMessage?: string;
};

const renderComponent = (optionProps?: OptionProps) => {
  return render(<ImageUploadFormWithProvider {...optionProps} />);
};

function ImageUploadFormWithProvider(optionProps: OptionProps = {}) {
  return (
    <ImageUploadFormProvider>
      <ImageUploadForm
        onSubmit={onSubmitMock}
        errorMessage={optionProps.errorMessage}
      />
    </ImageUploadFormProvider>
  );
}

describe('ImageUploadForm', () => {
  it('入力した画像ファイルと画像名が送信関数に渡されている', async () => {
    renderComponent();
    const fileInput = screen.getByLabelText('ファイルを選択');
    const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    const nameInput = screen.getByLabelText('画像名');
    await userEvent.type(nameInput, 'test-image');

    const submitButton = screen.getByRole('button', { name: 'アップロード' });
    await userEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        image: expect.any(FileList),
        imagePath: 'test-image',
      },
      expect.any(Object),
    );
  });

  describe('必須項目のバリデーション', () => {
    it('画像ファイルが選択されていない場合、エラーメッセージが表示される', async () => {
      renderComponent();

      const nameInput = screen.getByLabelText('画像名');
      await userEvent.type(nameInput, 'test-image');

      const submitButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(submitButton);

      expect(
        await screen.findByText('画像ファイルを選択してください'),
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('画像名が入力されていない場合、エラーメッセージが表示される', async () => {
      renderComponent();

      const fileInput = screen.getByLabelText('ファイルを選択');
      const file = new File(['(⌐□_□)'], 'test-image.png', {
        type: 'image/png',
      });
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(submitButton);

      expect(
        await screen.findByText('画像名を入力してください'),
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('画像ファイルと画像名の両方が未入力の場合、両方のエラーメッセージが表示される', async () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(submitButton);

      expect(
        await screen.findByText('画像ファイルを選択してください'),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('画像名を入力してください'),
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  describe('エラーメッセージの表示・非表示', () => {
    it('props でわたっていれば表示', () => {
      renderComponent({ errorMessage: 'エラーメッセージ' });
      const errorMessageElement = screen.getByRole('alert');
      expect(errorMessageElement).toHaveTextContent('エラーメッセージ');
    });

    it('props でわたっていなければ非表示', () => {
      renderComponent();
      const errorMessageElement = screen.queryByRole('alert');
      expect(errorMessageElement).not.toBeInTheDocument();
    });
  });
});
