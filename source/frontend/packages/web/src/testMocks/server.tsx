import { setupServer } from 'msw/node';
import { handlers } from '@/testMocks/handlers';

export const server = setupServer(...handlers);
