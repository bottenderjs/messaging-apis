import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

const { ACCESS_TOKEN, CHANNEL_SECRET } = constants;

const RECIPIENT_ID = 'U00000000000000000000000000000000';

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

  const res = await client.multicast({
    to: [RECIPIENT_ID],
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
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
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

  const res = await client.multicast(
    [RECIPIENT_ID],
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
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
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

  const res = await client.multicast(
    [RECIPIENT_ID],
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
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
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
