import { allHandlers } from '@/apiMocks/handlers';
import { setupWorker } from 'msw/browser';

export const mockApiForClient = setupWorker(...allHandlers);
