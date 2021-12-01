import { RestRequest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';

import { getCurrentContext } from './shared';
import { requestHandlers as handoverRequestHandlers } from './handover';
import { requestHandlers as identityRequestHandlers } from './identity';
import { requestHandlers as insightsRequestHandlers } from './insights';
import { requestHandlers as messageRequestHandlers } from './message';
import { requestHandlers as nlpRequestHandlers } from './nlp';
import { requestHandlers as personaRequestHandlers } from './persona';
import { requestHandlers as profileRequestHandlers } from './profile';

/**
 * Sets up a mock Messenger server.
 *
 * @returns MSW setup server API.
 */
export function setupMessengerServer(): SetupServerApi {
  const server = setupServer(
    ...messageRequestHandlers,
    ...handoverRequestHandlers,
    ...profileRequestHandlers,
    ...personaRequestHandlers,
    ...insightsRequestHandlers,
    ...nlpRequestHandlers,
    ...identityRequestHandlers
  );

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
