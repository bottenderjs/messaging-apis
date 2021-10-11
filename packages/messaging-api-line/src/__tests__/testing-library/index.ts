import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { v4 as uuidv4 } from 'uuid';

import { requestHandlers as botRequestHandlers } from './bot';
import { requestHandlers as narrowcastRequestHandlers } from './narrowcast';
import { requestHandlers as webhookRequestHandlers } from './webhook';

type Context = { request: RestRequest | undefined };

const currentContext: { request: RestRequest | undefined } = {
  request: undefined,
};

/**
 * Gets current HTTP request context.
 *
 * @returns current HTTP request context.
 */
export function getCurrentContext(): Context {
  return currentContext;
}

/**
 * Sets up a mock LINE server.
 *
 * @returns MSW setup server API.
 */
export function setupLineServer(): SetupServerApi {
  const lineServer = setupServer(
    ...botRequestHandlers,
    rest.post('https://api.line.me/v2/bot/message/reply', (req, res, ctx) => {
      currentContext.request = req;
      return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
    }),
    rest.post('https://api.line.me/v2/bot/message/push', (req, res, ctx) => {
      currentContext.request = req;
      return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
    }),
    rest.post(
      'https://api.line.me/v2/bot/message/multicast',
      (req, res, ctx) => {
        currentContext.request = req;
        return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
      }
    ),
    rest.post(
      'https://api.line.me/v2/bot/message/broadcast',
      (req, res, ctx) => {
        currentContext.request = req;
        return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
      }
    ),
    ...narrowcastRequestHandlers,
    ...webhookRequestHandlers
  );
  if (typeof beforeAll === 'function') {
    beforeAll(() => {
      // Establish requests interception layer before all tests.
      lineServer.listen();
    });
  }

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    lineServer.resetHandlers();
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    lineServer.close();
  });

  return lineServer;
}

export const constants = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHANNEL_SECRET: 'CHANNEL_SECRET',
};

export { setBotInfo } from './bot';
export { setNarrowcastProgress } from './narrowcast';
