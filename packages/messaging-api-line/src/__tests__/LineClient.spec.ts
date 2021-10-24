import { rest } from 'msw';

import LineClient from '../LineClient';
import * as Line from '../Line';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

const lineServer = setupLineServer();

it('should support origin', async () => {
  lineServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
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

it('should support dataOrigin', async () => {
  lineServer.use(
    rest.get('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
    dataOrigin: 'https://mydummytestserver.com',
  });

  await line.getMessageContent(constants.MESSAGE_ID);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.href).toBe(
    'https://mydummytestserver.com/v2/bot/message/1234567890/content'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
    onRequest,
  });

  await line.reply(constants.REPLY_TOKEN, {
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
    line.reply(constants.REPLY_TOKEN, [Line.text('Hello!')])
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

  await expect(line.reply(constants.REPLY_TOKEN, [Line.text('Hello!')])).rejects
    .toThrowError(`LINE API - The request body has 2 error(s)
- messages[0].text: May not be empty
- messages[1].type: Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]`);
});
