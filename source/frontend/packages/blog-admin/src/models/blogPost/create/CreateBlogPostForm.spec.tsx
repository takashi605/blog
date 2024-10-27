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

    expect(getOnceH2Input()).not.toBeInTheDocument();
    await userEvent.click(getH2Button());
    expect(getOnceH2Input()).toBeInTheDocument();

    await userEvent.click(getH2Button());

    await userEvent.type(getH2Inputs()[0], '入力された h2');
    await userEvent.type(getH2Inputs()[1], '再度入力された h2');

    await userEvent.click(getSubmitButton());

    expect(createdBlogPosts[0].contents[0].type).toEqual('h2');
    expect(createdBlogPosts[0].contents[0].text).toEqual('入力された h2');
    expect(createdBlogPosts[0].contents[1].type).toEqual('h2');
    expect(createdBlogPosts[0].contents[1].text).toEqual('再度入力された h2');

    function getH2Button(): HTMLButtonElement {
      return screen.getByRole('button', { name: 'h2' });
    }

    function getOnceH2Input(): HTMLElement | null {
      return screen.queryByRole('textbox', { name: 'h2' });
    }

    function getH2Inputs(): HTMLElement[] {
      return screen.getAllByRole('textbox', { name: 'h2' });
    }

    function getSubmitButton(): HTMLButtonElement {
      return screen.getByRole('button', { name: '投稿' });
    }
  });
});
