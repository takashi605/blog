import { createdBlogPosts } from '@/apiMocks/handlers/blogPostHandlers';
import { mockApiForServer } from '@/apiMocks/serverForNode';
import CreateBlogPostForm from '@/models/blogPost/create/CreateBlogPostForm';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('CreateBlogPostForm', () => {
  it('入力されたタイトルが投稿記事に反映される', async () => {
    render(<CreateBlogPostForm />);
    const titleInput = screen.getByRole('textbox', { name: 'タイトル' });
    const submitButton = screen.getByRole('button', { name: '投稿' });

    await userEvent.type(titleInput, '入力されたタイトル');
    await userEvent.click(submitButton);
    expect(createdBlogPosts[0].title).toEqual('入力されたタイトル');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '再度入力されたタイトル');
    await userEvent.click(submitButton);
    expect(createdBlogPosts[1].title).toEqual('再度入力されたタイトル');
  });
});
