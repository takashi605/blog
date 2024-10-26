import CreateBlogPostForm from '@/models/blogPost/create/CreateBlogPostForm';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/models/blogPost/create/formAction', () => ({
  // サーバーアクションのモック
  // jest によるテストでは action に文字列以外設定できないため、
  // 代替案として文字列でモックしている
  createBlogPostAction: '/mocked-action',
}));

describe('CreateBlogPostForm', () => {
  it('レンダーできる', () => {
    const { baseElement } = render(<CreateBlogPostForm />);
    expect(baseElement).toBeTruthy();
  });

  it('投稿ボタンがある', () => {
    render(<CreateBlogPostForm />);
    const submitButton = screen.getByRole('button', { name: '投稿' });
    expect(submitButton).toBeInTheDocument();
  });

  it('投稿ボタンにサーバーアクションが適用されている', () => {
    render(<CreateBlogPostForm />);
    const form = screen.getByRole('form');

    // jest 環境では action 属性に関数を設定できない関係上文字列でモックしているため、文字列で比較
    expect(form).toHaveAttribute('action', '/mocked-action');
  });
});
