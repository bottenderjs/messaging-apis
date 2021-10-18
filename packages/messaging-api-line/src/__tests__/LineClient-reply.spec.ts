import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

const { ACCESS_TOKEN, CHANNEL_SECRET } = constants;

const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';

function setup() {
  const context = getCurrentContext();
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });

  return { context, client };
}

it('should support sending request body', async () => {
  const { context, client } = setup();

  const res = await client.reply({
    replyToken: REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support sending a message array', async () => {
  const { context, client } = setup();

  const res = await client.reply(
    REPLY_TOKEN,
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support sending a message', async () => {
  const { context, client } = setup();

  const res = await client.reply(
    REPLY_TOKEN,
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
