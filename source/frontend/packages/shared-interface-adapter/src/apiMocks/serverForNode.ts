import { setupServer } from 'msw/node';
import { createAllHandlers, createProtTypeAllHandlers } from './handlers';

export const setupMockApiForServer = (baseUrl: string) => {
  return setupServer(...createAllHandlers(baseUrl));
};

export const setupProtTypeMockApiForServer = (baseUrl: string) => {
  return setupServer(...createProtTypeAllHandlers(baseUrl));
};
