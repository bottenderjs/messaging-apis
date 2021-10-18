import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setBotInfo,
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

it('#getBotInfo should call api', async () => {
  const { context, client } = setup();

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

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/info');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
