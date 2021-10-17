import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { snakecaseKeys } from 'messaging-api-common';

import {
  requestHandlers as mediaRequestHandlers,
  reset as resetMedia,
} from './media';

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
  APP_ID: 'APP_ID',
  APP_SECRET: 'APP_SECRET',
  ACCESS_TOKEN: '1234567890',
};

export function setConstants(dict: Partial<typeof constants>): void {
  for (const [key, val] of Object.entries(dict)) {
    constants[key] = val;
  }
}

/**
 * Sets up a mock Wechat server.
 *
 * @returns MSW setup server API.
 */
export function setupWechatServer(): SetupServerApi {
  const server = setupServer(
    rest.get('https://api.weixin.qq.com/cgi-bin/token', (req, res, ctx) => {
      currentContext.request = req;
      return res(
        ctx.json(
          snakecaseKeys({
            accessToken: constants.ACCESS_TOKEN,
            expiresIn: 7200,
          })
        )
      );
    }),
    ...mediaRequestHandlers,
    rest.post(
      'https://api.weixin.qq.com/cgi-bin/message/custom/send',
      (req, res, ctx) => {
        currentContext.request = req;

        return res(ctx.json({ errcode: 0, errmsg: 'ok' }));
      }
    ),
    rest.post(
      'https://api.weixin.qq.com/cgi-bin/message/custom/typing',
      (req, res, ctx) => {
        currentContext.request = req;

        return res(ctx.json({ errcode: 0, errmsg: 'ok' }));
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

    currentContext.request = undefined;

    resetMedia();
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  return server;
}
