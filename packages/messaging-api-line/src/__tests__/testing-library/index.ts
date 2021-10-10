import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

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

const narrowcastProgressMap: Record<
  string,
  LineTypes.NarrowcastProgressResponse
> = {};

/**
 * Set progress of the narrowcast request.
 *
 * @param requestId - Request ID.
 * @param progress - progress of the narrowcast request.
 */
export function setNarrowcastProgress(
  requestId: string,
  progress: LineTypes.NarrowcastProgressResponse
): void {
  narrowcastProgressMap[requestId] = progress;
}

/**
 * Sets up a mock LINE server.
 *
 * @returns MSW setup server API.
 */
export function setupLineServer(): SetupServerApi {
  const lineServer = setupServer(
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
    rest.post(
      'https://api.line.me/v2/bot/message/narrowcast',
      (req, res, ctx) => {
        const requestId = uuidv4();
        currentContext.request = req;
        narrowcastProgressMap[requestId] = { phase: 'waiting' };
        return res(
          ctx.status(202),
          ctx.json({}),
          ctx.set('X-Line-Request-Id', requestId)
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/message/progress/narrowcast',
      (req, res, ctx) => {
        currentContext.request = req;
        const requestId = req.url.searchParams.get('requestId');
        if (requestId in narrowcastProgressMap) {
          return res(
            ctx.json(narrowcastProgressMap[requestId]),
            ctx.set('X-Line-Request-Id', uuidv4())
          );
        }

        return res(ctx.status(400), ctx.set('X-Line-Request-Id', uuidv4()));
      }
    )
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
