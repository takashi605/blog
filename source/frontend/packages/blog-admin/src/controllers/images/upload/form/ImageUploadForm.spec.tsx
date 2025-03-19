import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUploadForm from './ImageUploadForm';
import ImageUploadFormProvider from './ImageUploadFormProvider';

const onSubmitMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = () => {
  return render(<ImageUploadFormWithProvider />);
};

function ImageUploadFormWithProvider() {
  return (
    <ImageUploadFormProvider>
      <ImageUploadForm onSubmit={onSubmitMock} />
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
});
