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
  it('投稿ボタンをクリックすると記事の投稿処理が発火する', async () => {
    render(<CreateBlogPostForm />);
    const submitButton = screen.getByRole('button', { name: '投稿' });
    await userEvent.click(submitButton);

    const today = new Date().toISOString().split('T')[0];
    expect(createdBlogPosts[0]).toEqual({
      title: '記事タイトル',
      postDate: today,
      lastUpdateDate: today,
      contents: [
        { type: 'h2', text: 'h2見出し1' },
        { type: 'h3', text: 'h3見出し1' },
        { type: 'paragraph', text: '段落1' },
      ],
    });
  });
});
