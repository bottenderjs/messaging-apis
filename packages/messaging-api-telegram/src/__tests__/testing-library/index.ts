import { SetupServerApi, setupServer } from 'msw/node';
import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants, getCurrentContext } from './shared';
import { requestHandlers as messageRequestHandlers } from './message';

/**
 * Sets up a mock Telegram server.
 *
 * @returns MSW setup server API.
 */
export function setupTelegramServer(): SetupServerApi {
  const server = setupServer(
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getMe`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json(
            snakecaseKeysDeep({
              ok: true,
              result: {
                id: 313534466,
                isBot: true,
                firstName: 'Bot',
                username: 'a_bot',
                canJoinGroups: true,
                canReadAllGroupMessages: true,
                supportsInlineQueries: true,
              },
            })
          )
        );
      }
    ),
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/logOut`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json({
            ok: true,
            result: true,
          })
        );
      }
    ),
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/close`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json({
            ok: true,
            result: true,
          })
        );
      }
    ),
    ...messageRequestHandlers
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
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  return server;
}

export { constants, getCurrentContext } from './shared';
