import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #setWebhookEndpointUrl', async () => {
  const client = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await client.setWebhookEndpointUrl(
    'https://www.example.com/webhook'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/channel/webhook/endpoint'
  );
  expect(request?.body).toEqual({
    endpoint: 'https://www.example.com/webhook',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getWebhookEndpointInfo', async () => {
  const client = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await client.setWebhookEndpointUrl('https://www.example.com/webhook');
  const res = await client.getWebhookEndpointInfo();

  expect(res).toEqual({
    endpoint: 'https://www.example.com/webhook',
    active: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/channel/webhook/endpoint'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #testWebhookEndpoint', async () => {
  const client = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await client.testWebhookEndpoint();

  expect(res).toEqual({
    success: true,
    timestamp: '2020-09-30T05:38:20.031Z',
    statusCode: 200,
    reason: 'OK',
    detail: '200',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/channel/webhook/test'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
