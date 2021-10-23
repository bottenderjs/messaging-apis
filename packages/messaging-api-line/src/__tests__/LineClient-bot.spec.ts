import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setBotInfo,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #getBotInfo', async () => {
  const client = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  setBotInfo({
    userId: 'Ub9952f8...',
    basicId: '@216ru...',
    displayName: 'Example name',
    pictureUrl: 'https://obs.line-apps.com/...',
    chatMode: 'chat',
    markAsReadMode: 'manual',
  });

  const res = await client.getBotInfo();

  expect(res).toEqual({
    userId: 'Ub9952f8...',
    basicId: '@216ru...',
    displayName: 'Example name',
    pictureUrl: 'https://obs.line-apps.com/...',
    chatMode: 'chat',
    markAsReadMode: 'manual',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/info');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
