import {
  clearCreatedBlogPosts,
  createdBlogPosts,
} from '@/apiMocks/handlers/blogPostHandlers';
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
  clearCreatedBlogPosts();
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

  it('h2 ボタンをクリックすると h2 入力インプットが表示され、入力された内容が投稿記事に反映される', async () => {
    render(<CreateBlogPostForm />);
    const h2Button = screen.getByRole('button', { name: 'h2' });

    expect(
      screen.queryByRole('textbox', { name: 'h2' }),
    ).not.toBeInTheDocument();
    await userEvent.click(h2Button);
    expect(screen.getByRole('textbox', { name: 'h2' })).toBeInTheDocument();

    await userEvent.click(h2Button);

    const h2Inputs = screen.getAllByRole('textbox', { name: 'h2' });
    await userEvent.type(h2Inputs[0], '入力された h2');
    await userEvent.type(h2Inputs[1], '再度入力された h2');

    const submitButton = screen.getByRole('button', { name: '投稿' });
    await userEvent.click(submitButton);

    console.log(createdBlogPosts);
    expect(createdBlogPosts[0].contents[0].type).toEqual('h2');
    expect(createdBlogPosts[0].contents[0].text).toEqual('入力された h2');
    expect(createdBlogPosts[0].contents[1].type).toEqual('h2');
    expect(createdBlogPosts[0].contents[1].text).toEqual('再度入力された h2');
  });
});
