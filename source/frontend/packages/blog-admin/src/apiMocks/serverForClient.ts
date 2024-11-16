import { setupWorker } from 'msw/browser';
import { allHandlers } from './handlers';

export const mockApiForClient = setupWorker(...allHandlers);
