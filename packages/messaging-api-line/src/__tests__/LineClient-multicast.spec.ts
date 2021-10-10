import { RestRequest, rest } from 'msw';

import { LineClient } from '..';

import { setupLineServer } from './testing-library';

const lineServer = setupLineServer();

const RECIPIENT_ID = 'U00000000000000000000000000000000';

function setup() {
  const context: { request: RestRequest | undefined } = {
    request: undefined,
  };
  lineServer.use(
    rest.post(
      'https://api.line.me/v2/bot/message/multicast',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    )
  );

  const client = new LineClient({
    accessToken: 'ACCESS_TOKEN',
    channelSecret: 'CHANNEL_SECRET',
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
