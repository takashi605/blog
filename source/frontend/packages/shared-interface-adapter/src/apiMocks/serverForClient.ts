import { setupWorker } from 'msw/browser';
import { createAllHandlers, createProtTypeAllHandlers } from './handlers';

export const setupMockApiForClient = (baseUrl: string) => {
  return setupWorker(...createAllHandlers(baseUrl));
};

export const setupProtTypeMockApiForClient = (baseUrl: string) => {
  return setupWorker(...createProtTypeAllHandlers(baseUrl));
};
