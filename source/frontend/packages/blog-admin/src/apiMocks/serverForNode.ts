import { allHandlers } from '@/apiMocks/handlers';
import { setupServer } from 'msw/node';

export const mockApiForServer = setupServer(...allHandlers);
