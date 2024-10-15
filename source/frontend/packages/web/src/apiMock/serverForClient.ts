import { allHandlers } from '@/apiMock/handlers';
import { setupWorker } from 'msw/browser';

export const mockApiForClient = setupWorker(...allHandlers);
