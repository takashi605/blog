import { allHandlers } from '@/apiMock/handlers';
import { setupServer } from 'msw/node';

export const mockApiForServer = setupServer(...allHandlers);
