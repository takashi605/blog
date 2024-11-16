import { setupServer } from 'msw/node';
import { allHandlers } from './handlers';

export const mockApiForServer = setupServer(...allHandlers);
