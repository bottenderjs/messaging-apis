import { SetupServerApi, setupServer } from 'msw/node';

import { requestHandlers as accountLinkRequestHandlers } from './accountLink';
import { requestHandlers as audienceRequestHandlers } from './audience';
import { requestHandlers as botRequestHandlers } from './bot';
import { getCurrentContext } from './shared';
import { requestHandlers as insightRequestHandlers } from './insight';
import { requestHandlers as messageRequestHandlers } from './message';
import { requestHandlers as userRequestHandlers } from './user';
import { requestHandlers as webhookRequestHandlers } from './webhook';

/**
 * Sets up a mock LINE server.
 *
 * @returns MSW setup server API.
 */
export function setupLineServer(): SetupServerApi {
  const server = setupServer(
    ...webhookRequestHandlers,
    ...messageRequestHandlers,
    ...audienceRequestHandlers,
    ...insightRequestHandlers,
    ...userRequestHandlers,
    ...botRequestHandlers
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

  return server;
}

export { setBotInfo } from './bot';
export { setNarrowcastProgress } from './message';

export { constants, getCurrentContext } from './shared';
