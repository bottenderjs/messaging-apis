import { RestRequest, rest } from 'msw';
import { setupServer } from 'msw/node';

import { LineClient } from '..';

const lineServer = setupServer();
beforeAll(() => {
  // Establish requests interception layer before all tests.
  lineServer.listen();
});
afterEach(() => {
  // Reset any runtime handlers tests may use.
  lineServer.resetHandlers();
});
afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  lineServer.close();
});

function setup() {
  const context: { request: RestRequest | undefined } = {
    request: undefined,
  };
  lineServer.use(
    rest.post(
      'https://api.line.me/v2/bot/message/broadcast',
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

  await client.broadcast({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
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

  await client.broadcast(
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
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

  await client.broadcast(
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
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
