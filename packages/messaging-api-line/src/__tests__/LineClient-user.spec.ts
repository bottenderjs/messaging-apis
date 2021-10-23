import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import LineClient from '../LineClient';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

const lineServer = setupLineServer();

it('should support #getUserProfile', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getUserProfile(constants.USER_ID);

  expect(res).toEqual({
    displayName: 'LINE taro',
    userId: 'U00000000000000000000000000000000',
    language: 'en',
    pictureUrl: 'https://obs.line-apps.com/...',
    statusMessage: 'Hello, LINE!',
  });
});

it('should handle #getUserProfile no user found', async () => {
  lineServer.use(
    rest.get<undefined>(
      'https://api.line.me/v2/bot/profile/:userId',
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.status(404),
          ctx.json({
            message: 'Not found',
          }),
          ctx.set('X-Line-Request-Id', uuidv4())
        );
      }
    )
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getUserProfile(constants.USER_ID);

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/profile/U00000000000000000000000000000000'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getBotFollowersIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  let res = await line.getBotFollowersIds();

  expect(res).toEqual({
    next: 'yANU9IA...',
    userIds: ['U4af4980629...', 'U0c229f96c4...', 'U95afb1d4df...'],
  });

  const context = getCurrentContext();

  expect(context.request).toBeDefined();
  expect(context.request?.method).toBe('GET');
  expect(context.request?.url.href).toBe(
    'https://api.line.me/v2/bot/followers/ids'
  );
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );

  res = await line.getBotFollowersIds(res.next);

  expect(context.request).toBeDefined();
  expect(context.request?.method).toBe('GET');
  expect(context.request?.url.href).toBe(
    'https://api.line.me/v2/bot/followers/ids?start=yANU9IA...'
  );
  expect(context.request?.url.searchParams.get('start')).toBe('yANU9IA...');
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );
});

it('should support #getAllBotFollowersIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAllBotFollowersIds();

  expect(res).toEqual([
    'U4af4980629...',
    'U0c229f96c4...',
    'U95afb1d4df...',
    'U4a59a00629...',
    'Uc7849f96c4...',
    'U95afbabcdf...',
  ]);
});
