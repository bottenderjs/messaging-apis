import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #getGroupSummary', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getGroupSummary(constants.GROUP_ID);

  expect(res).toEqual({
    groupId: constants.GROUP_ID,
    groupName: 'LINE Group',
    pictureUrl: 'http:/obs.line-apps.com/...',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/summary`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getGroupMembersCount', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getGroupMembersCount(constants.GROUP_ID);

  expect(res).toBe(3);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/members/count`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getGroupMemberIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  let res = await line.getGroupMemberIds(constants.GROUP_ID);

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
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/members/ids`
  );
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );

  res = await line.getGroupMemberIds(constants.GROUP_ID, res.next);

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
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/members/ids?start=${constants.CONTINUATION_TOKEN}`
  );
  expect(context.request?.headers.get('Content-Type')).toBe('application/json');
  expect(context.request?.headers.get('Authorization')).toBe(
    'Bearer ACCESS_TOKEN'
  );
});

it('should support #getAllGroupMemberIds', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAllGroupMemberIds(constants.GROUP_ID);

  expect(res).toEqual([
    'U00000000000000000000000000000001',
    'U00000000000000000000000000000002',
    'U00000000000000000000000000000003',
    'U00000000000000000000000000000004',
    'U00000000000000000000000000000005',
    'U00000000000000000000000000000006',
  ]);
});

it('should support #getGroupMemberProfile', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getGroupMemberProfile(
    constants.GROUP_ID,
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
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/member/${constants.USER_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #leaveGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.leaveGroup(constants.GROUP_ID);

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/leave`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
