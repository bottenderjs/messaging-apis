import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

import { getCurrentContext } from './shared';
import { res } from './res';

const webhookEndpoint: LineTypes.WebhookEndpointInfoResponse = {
  endpoint: 'https://www.example.com/webhook',
  active: true,
};

export const requestHandlers = [
  rest.put<{ endpoint: string }>(
    'https://api.line.me/v2/bot/channel/webhook/endpoint',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      webhookEndpoint.endpoint = req.body.endpoint;
      return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
    }
  ),
  rest.get<undefined>(
    'https://api.line.me/v2/bot/channel/webhook/endpoint',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(webhookEndpoint),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.post<{ endpoint?: string }>(
    'https://api.line.me/v2/bot/channel/webhook/test',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          success: true,
          timestamp: '2020-09-30T05:38:20.031Z',
          statusCode: 200,
          reason: 'OK',
          detail: '200',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
];
