import { rest } from 'msw';

import { LineTypes } from '../..';

import { res } from './res';

const webhookEndpoint: LineTypes.WebhookEndpointInfoResponse = {
  endpoint: 'https://www.example.com/webhook',
  active: true,
};

export const requestHandlers = [
  rest.put<{ endpoint: string }>(
    'https://api.line.me/v2/bot/channel/webhook/endpoint',
    (req, _, ctx) => {
      webhookEndpoint.endpoint = req.body.endpoint;
      return res(ctx.json({}));
    }
  ),
  rest.get<undefined>(
    'https://api.line.me/v2/bot/channel/webhook/endpoint',
    (_, __, ctx) => {
      return res(ctx.json(webhookEndpoint));
    }
  ),
  rest.post<{ endpoint?: string }>(
    'https://api.line.me/v2/bot/channel/webhook/test',
    (_, __, ctx) => {
      return res(
        ctx.json({
          success: true,
          timestamp: '2020-09-30T05:38:20.031Z',
          statusCode: 200,
          reason: 'OK',
          detail: '200',
        })
      );
    }
  ),
];
