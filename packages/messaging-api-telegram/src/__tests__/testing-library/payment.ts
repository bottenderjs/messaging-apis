import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendInvoice`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 1,
              from: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              chat: {
                id: 427770117,
                firstName: 'first',
                lastName: 'last',
                type: 'private',
              },
              date: 1499403678,
              invoice: {
                title: 'product name',
                description: 'product description',
                startParameter: 'pay',
                currency: 'USD',
                totalCount: 22000,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/answerShippingQuery`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/answerPreCheckoutQuery`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
];
