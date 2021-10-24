import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #getRoomMembersCount', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRoomMembersCount(constants.ROOM_ID);

  expect(res).toBe(3);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/members/count`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getRoomMemberIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  let res = await line.getRoomMemberIds(constants.ROOM_ID);

  expect(res).toEqual({
    memberIds: [
      'U00000000000000000000000000000001',
      'U00000000000000000000000000000002',
      'U00000000000000000000000000000003',
    ],
    next: constants.CONTINUATION_TOKEN,
  });

  const context = getCurrentContext();

  expect(context.request).toBeDefined();
  expect(context.request?.method).toBe('GET');
  expect(context.request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/members/ids`
  );
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );

  res = await line.getRoomMemberIds(constants.ROOM_ID, res.next);

  expect(res).toEqual({
    memberIds: [
      'U00000000000000000000000000000004',
      'U00000000000000000000000000000005',
      'U00000000000000000000000000000006',
    ],
  });

  expect(context.request).toBeDefined();
  expect(context.request?.method).toBe('GET');
  expect(context.request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/members/ids?start=${constants.CONTINUATION_TOKEN}`
  );
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );
});

it('should support #getAllRoomMemberIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAllRoomMemberIds(constants.ROOM_ID);

  expect(res).toEqual([
    'U00000000000000000000000000000001',
    'U00000000000000000000000000000002',
    'U00000000000000000000000000000003',
    'U00000000000000000000000000000004',
    'U00000000000000000000000000000005',
    'U00000000000000000000000000000006',
  ]);
});

it('should support #getRoomMemberProfile', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRoomMemberProfile(
    constants.ROOM_ID,
    constants.USER_ID
  );

  expect(res).toEqual({
    displayName: 'LINE taro',
    userId: constants.USER_ID,
    pictureUrl: 'http://obs.line-apps.com/...',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/member/${constants.USER_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #leaveRoom', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.leaveRoom(constants.ROOM_ID);

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/leave`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
