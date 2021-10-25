import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.post('https://notify-bot.line.me/oauth/token', (_, __, ctx) => {
    return res(
      ctx.json({
        access_token: 'access_token',
      })
    );
  }),
  rest.get('https://notify-api.line.me/api/status', (_, __, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
        targetType: 'USER',
        target: 'user name',
      })
    );
  }),
  rest.post('https://notify-api.line.me/api/notify', (_, __, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
      })
    );
  }),
  rest.post('https://notify-api.line.me/api/revoke', (_, __, ctx) => {
    return res(
      ctx.json({
        status: 200,
        message: 'message',
      })
    );
  }),
];
