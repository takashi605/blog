import { setupWorker } from 'msw/browser';
import { createAllHandlers } from './handlers';

export const setupMockApiForClient = (baseUrl: string) => {
  return setupWorker(...createAllHandlers(baseUrl));
};
