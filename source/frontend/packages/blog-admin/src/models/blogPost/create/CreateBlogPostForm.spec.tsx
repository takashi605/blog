import CreateBlogPostForm from '@/models/blogPost/create/CreateBlogPostForm';
import { render } from '@testing-library/react';

describe('CreateBlogPostForm', () => {
  it('レンダーできる', () => {
    const { baseElement } = render(<CreateBlogPostForm />);
    expect(baseElement).toBeTruthy();
  });
});
