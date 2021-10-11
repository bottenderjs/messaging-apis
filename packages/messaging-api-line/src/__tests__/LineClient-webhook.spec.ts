import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

const { ACCESS_TOKEN, CHANNEL_SECRET } = constants;

function setup() {
  const context = getCurrentContext();
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });

  return { context, client };
}

it('#setWebhookEndpointUrl should call api', async () => {
  const { context, client } = setup();

  const res = await client.setWebhookEndpointUrl(
    'https://www.example.com/webhook'
  );

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/channel/webhook/endpoint'
  );
  expect(request?.body).toEqual({
    endpoint: 'https://www.example.com/webhook',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getWebhookEndpointInfo should call api', async () => {
  const { context, client } = setup();

  await client.setWebhookEndpointUrl('https://www.example.com/webhook');
  const res = await client.getWebhookEndpointInfo();

  expect(res).toEqual({
    endpoint: 'https://www.example.com/webhook',
    active: true,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/channel/webhook/endpoint'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#testWebhookEndpoint should call api', async () => {
  const { context, client } = setup();

  const res = await client.testWebhookEndpoint();

  expect(res).toEqual({
    success: true,
    timestamp: '2020-09-30T05:38:20.031Z',
    statusCode: 200,
    reason: 'OK',
    detail: '200',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/channel/webhook/test'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
