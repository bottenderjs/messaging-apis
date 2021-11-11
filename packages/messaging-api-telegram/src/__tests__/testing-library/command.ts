import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setMyCommands`,
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
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/deleteMyCommands`,
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
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getMyCommands`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: [
              {
                command: 'command',
                description: 'my command',
              },
            ],
          })
        )
      );
    }
  ),
];
