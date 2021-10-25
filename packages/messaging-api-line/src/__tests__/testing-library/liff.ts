import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.post('https://api.line.me/liff/v1/apps', (_, __, ctx) => {
    return res(
      ctx.json({
        liffId: 'liff-12345',
      })
    );
  }),
  rest.put('https://api.line.me/liff/v1/apps/:appId', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.get('https://api.line.me/liff/v1/apps', (_, __, ctx) => {
    return res(
      ctx.json({
        apps: [
          {
            liffId: 'liff-12345',
            view: {
              type: 'full',
              url: 'https://example.com/myservice',
            },
          },
          {
            liffId: 'liff-67890',
            view: {
              type: 'tall',
              url: 'https://example.com/myservice2',
            },
          },
        ],
      })
    );
  }),
  rest.delete('https://api.line.me/liff/v1/apps/:appId', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
];
