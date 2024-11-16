import { setupServer } from 'msw/node';
import { createAllHandlers } from './handlers';

export const setupMockApiForServer = (baseUrl: string) => {
  return setupServer(...createAllHandlers(baseUrl));
}
