import CreateBlogPostForm from '@/models/blogPost/create/CreateBlogPostForm';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
});
