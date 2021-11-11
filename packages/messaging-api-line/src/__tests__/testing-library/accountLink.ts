import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.post<undefined>(
    'https://api.line.me/v2/bot/user/:userId/linkToken',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
        })
      );
    }
  ),
];
