import { RestRequest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';

import { getCurrentContext } from './shared';
import { requestHandlers as messageRequestHandlers } from './message';

/**
 * Sets up a mock Messenger server.
 *
 * @returns MSW setup server API.
 */
export function setupMessengerServer(): SetupServerApi {
  const server = setupServer(...messageRequestHandlers);

  if (typeof beforeAll === 'function') {
    beforeAll(() => {
      // Establish requests interception layer before all tests.
      server.listen();
    });
  }

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();

    getCurrentContext().request = undefined;
  });

  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  server.events.on('request:start', (req) => {
    getCurrentContext().request = req as RestRequest;
  });

  return server;
}

export { constants, getCurrentContext } from './shared';
