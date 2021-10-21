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

export const constants = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHANNEL_SECRET: 'CHANNEL_SECRET',
  REPLY_TOKEN: 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA',
  MESSAGE_ID: '1234567890',
};

/**
 * Sets up a mock LINE server.
 *
 * @returns MSW setup server API.
 */
export function setupLineServer(): SetupServerApi {
  const server = setupServer(
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
    rest.get(
      `https://api-data.line.me/v2/bot/message/${constants.MESSAGE_ID}/content`,
      (req, res, ctx) => {
        currentContext.request = req;

        return res(
          ctx.body(Buffer.from('a content buffer')),
          ctx.set('X-Line-Request-Id', uuidv4())
        );
      }
    ),
    ...webhookRequestHandlers
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

    currentContext.request = undefined;
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  return server;
}

export { setBotInfo } from './bot';
export { setNarrowcastProgress } from './narrowcast';
