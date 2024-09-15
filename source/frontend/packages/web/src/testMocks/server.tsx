import { handlers } from '@/testMocks/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);
