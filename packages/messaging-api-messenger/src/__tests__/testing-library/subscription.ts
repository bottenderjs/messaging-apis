import { rest } from 'msw';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://graph.facebook.com/:version/${constants.APP_ID}/subscriptions`,
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.get(
    `https://graph.facebook.com/:version/${constants.APP_ID}/subscriptions`,
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              object: 'page',
              callback_url: 'https://mycallback.com',
              active: true,
              fields: [
                {
                  name: 'messages',
                  version: 'v2.12',
                },
              ],
            },
          ],
        })
      );
    }
  ),
];
