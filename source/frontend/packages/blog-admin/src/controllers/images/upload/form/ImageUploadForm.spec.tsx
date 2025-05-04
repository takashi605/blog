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
  it('入力した画像名,パスが送信関数に渡されている', async () => {
    renderComponent();
    const fileInput = screen.getByLabelText('ファイルを選択');
    const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    const nameInput = screen.getByLabelText('画像名');
    await userEvent.type(nameInput, 'テスト画像');

    const pathInput = screen.getByLabelText('パス');
    await userEvent.type(pathInput, 'test-image');

    const submitButton = screen.getByRole('button', { name: 'アップロード' });
    await userEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        image: expect.any(FileList),
        imageName: 'テスト画像',
        imagePath: 'test-image',
      },
      expect.any(Object),
    );
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
