import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants, getCurrentContext } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setMyCommands`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
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
    (req, res, ctx) => {
      getCurrentContext().request = req;
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
    (req, res, ctx) => {
      getCurrentContext().request = req;
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
