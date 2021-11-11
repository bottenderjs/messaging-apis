import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.post('https://notify-bot.line.me/oauth/token', (_req, _res, ctx) => {
    return res(
      ctx.json({
        access_token: 'access_token',
      })
    );
  }),
  rest.get('https://notify-api.line.me/api/status', (_req, _res, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
        targetType: 'USER',
        target: 'user name',
      })
    );
  }),
  rest.post('https://notify-api.line.me/api/notify', (_req, _res, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
      })
    );
  }),
  rest.post('https://notify-api.line.me/api/revoke', (_req, _res, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
      })
    );
  }),
];
