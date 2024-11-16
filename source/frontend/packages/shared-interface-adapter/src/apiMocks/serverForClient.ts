import { setupWorker } from 'msw/browser';
import { createAllHandlers } from './handlers';

export const setupMockApiForServer = (baseUrl: string) => {
  return setupWorker(...createAllHandlers(baseUrl));
};
