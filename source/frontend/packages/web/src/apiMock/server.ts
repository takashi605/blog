import { handlers } from '@/apiMock/handlers';
import { blogPostHandlers } from '@/apiMock/handlers/blogPostHandler';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers, ...blogPostHandlers);
