import { handlers } from '@/apiMock/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);
