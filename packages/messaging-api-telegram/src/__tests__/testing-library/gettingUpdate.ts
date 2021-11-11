import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getUpdates`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: [
              {
                updateId: 513400512,
                message: {
                  messageId: 3,
                  from: {
                    id: 313534466,
                    firstName: 'first',
                    lastName: 'last',
                    username: 'username',
                  },
                  chat: {
                    id: 313534466,
                    firstName: 'first',
                    lastName: 'last',
                    username: 'username',
                    type: 'private',
                  },
                  date: 1499402829,
                  text: 'hi',
                },
              },
            ],
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setWebhook`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
            description: 'Webhook was set',
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/deleteWebhook`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
            description: 'Webhook is already deleted',
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getWebhookInfo`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              url: 'https://4a16faff.ngrok.io/',
              hasCustomCertificate: false,
              pendingUpdateCount: 0,
              maxConnections: 40,
            },
          })
        )
      );
    }
  ),
];
