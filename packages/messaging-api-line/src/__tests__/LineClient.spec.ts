import MockAdapter from 'axios-mock-adapter';
import { rest } from 'msw';

import LineClient from '../LineClient';
import * as Line from '../Line';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

const RECIPIENT_ID = '1QAZ2WSX';
const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
  dataMock: MockAdapter;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
} => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });
  const mock = new MockAdapter(client.axios);
  const dataMock = new MockAdapter(client.dataAxios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, dataMock, headers };
};

const lineServer = setupLineServer();

it('should support origin', async () => {
  lineServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const line = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
    origin: 'https://mydummytestserver.com',
  });

  await line.reply(constants.REPLY_TOKEN, {
    type: 'text',
    text: 'Hello, world',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.href).toBe(
    'https://mydummytestserver.com/v2/bot/message/reply'
  );
});

it.todo('should support dataOrigin');

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const line = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
    onRequest,
  });

  await line.reply(REPLY_TOKEN, {
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
      Authorization: 'Bearer 1234567890',
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
});

describe('Profile', () => {
  describe('#getUserProfile', () => {
    it('should respond user profile', async () => {
      const { client, mock, headers } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
        statusMessage: 'Hello, LINE!',
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual(`/v2/bot/profile/${RECIPIENT_ID}`);
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });

    it('should return null when no user found', async () => {
      const { client, mock } = createMock();

      mock.onGet().reply(404, {
        message: 'Not found',
      });

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(null);
    });
  });
});

describe('Account link', () => {
  describe('#getLinkToken', () => {
    it('should respond data with link token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
      };

      mock.onPost().reply((config) => {
        expect(config.url).toEqual(`/v2/bot/user/${RECIPIENT_ID}/linkToken`);
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getLinkToken(RECIPIENT_ID);

      expect(res).toEqual('NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY');
    });
  });
});

it('should handle errors', async () => {
  lineServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.status(400),
        ctx.json({
          message: 'The request body has 2 error(s)',
        })
      );
    })
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await expect(
    line.reply(REPLY_TOKEN, [Line.text('Hello!')])
  ).rejects.toThrowError('LINE API - The request body has 2 error(s)');
});

it('should handle errors when details exist', async () => {
  lineServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.status(400),
        ctx.json({
          message: 'The request body has 2 error(s)',
          details: [
            {
              message: 'May not be empty',
              property: 'messages[0].text',
            },
            {
              message:
                'Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]',
              property: 'messages[1].type',
            },
          ],
        })
      );
    })
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await expect(line.reply(REPLY_TOKEN, [Line.text('Hello!')])).rejects
    .toThrowError(`LINE API - The request body has 2 error(s)
- messages[0].text: May not be empty
- messages[1].type: Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]`);
});
