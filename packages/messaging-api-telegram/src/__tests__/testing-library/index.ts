import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { snakecaseKeysDeep } from 'messaging-api-common';

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
  ACCESS_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
};

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
        currentContext.request = req;
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
        currentContext.request = req;
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
        currentContext.request = req;
        return res(
          ctx.json({
            ok: true,
            result: true,
          })
        );
      }
    )
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
