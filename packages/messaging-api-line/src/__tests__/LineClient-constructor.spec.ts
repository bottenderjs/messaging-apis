import { rest } from 'msw';

import LineClient from '../LineClient';

import { constants, setupLineServer } from './testing-library';

const server = setupLineServer();

const { ACCESS_TOKEN, CHANNEL_SECRET } = constants;

it('should support origin', async () => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
    origin: 'https://mydummytestserver.com',
  });

  server.use(
    rest.post('https://mydummytestserver.com/path', (_, res, ctx) => {
      return res(ctx.json({ y: 2 }));
    })
  );

  const res = await client.axios.post('/path', { x: 1 });

  expect(res.data).toEqual({ y: 2 });
});

it('#accessToken should return underlying access token', () => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });

  expect(client.accessToken).toBe(ACCESS_TOKEN);
});

it('#onRequest should intercept API calls', async () => {
  const onRequest = jest.fn();

  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
    onRequest,
  });

  const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';

  await client.reply(REPLY_TOKEN, {
    type: 'text',
    text: 'Hello, world',
  });

  expect(onRequest).toBeCalledWith({
    method: 'post',
    url: 'https://api.line.me/v2/bot/message/reply',
    body: {
      messages: [
        {
          text: 'Hello, world',
          type: 'text',
        },
      ],
      notificationDisabled: false,
      replyToken: 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA',
    },
    headers: {
      Authorization: 'Bearer ACCESS_TOKEN',
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
});
