import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('#getGroupSummary should respond group summary', async () => {
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

it('#getGroupMemberProfile should respond group member profile', async () => {
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

it('#getRoomMemberProfile should respond room member profile', async () => {
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

it('#getGroupMembersCount should respond group members count', async () => {
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

it('#getRoomMembersCount should respond room members count', async () => {
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

describe('#getGroupMemberIds', () => {
  it('should respond group member ids', async () => {
    const line = new LineClient({
      accessToken: constants.ACCESS_TOKEN,
      channelSecret: constants.CHANNEL_SECRET,
    });

    const res = await line.getGroupMemberIds(constants.GROUP_ID);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000001',
        'U00000000000000000000000000000002',
        'U00000000000000000000000000000003',
      ],
      next: constants.CONTINUATION_TOKEN,
    });

    const { request } = getCurrentContext();

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/members/ids`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });

  it('should call api with provided continuation token', async () => {
    const line = new LineClient({
      accessToken: constants.ACCESS_TOKEN,
      channelSecret: constants.CHANNEL_SECRET,
    });

    const res = await line.getGroupMemberIds(
      constants.GROUP_ID,
      constants.CONTINUATION_TOKEN
    );

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000004',
        'U00000000000000000000000000000005',
        'U00000000000000000000000000000006',
      ],
    });

    const { request } = getCurrentContext();

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/group/${constants.GROUP_ID}/members/ids?start=${constants.CONTINUATION_TOKEN}`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});

it('#getAllGroupMemberIds should fetch all member ids until it is finished', async () => {
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

describe('#getRoomMemberIds', () => {
  it('should respond room member ids', async () => {
    const line = new LineClient({
      accessToken: constants.ACCESS_TOKEN,
      channelSecret: constants.CHANNEL_SECRET,
    });

    const res = await line.getRoomMemberIds(constants.ROOM_ID);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000001',
        'U00000000000000000000000000000002',
        'U00000000000000000000000000000003',
      ],
      next: constants.CONTINUATION_TOKEN,
    });

    const { request } = getCurrentContext();

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/members/ids`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });

  it('should call api with provided continuation token', async () => {
    const line = new LineClient({
      accessToken: constants.ACCESS_TOKEN,
      channelSecret: constants.CHANNEL_SECRET,
    });

    const res = await line.getRoomMemberIds(
      constants.ROOM_ID,
      constants.CONTINUATION_TOKEN
    );

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000004',
        'U00000000000000000000000000000005',
        'U00000000000000000000000000000006',
      ],
    });

    const { request } = getCurrentContext();

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/room/${constants.ROOM_ID}/members/ids?start=${constants.CONTINUATION_TOKEN}`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});

it('#getAllRoomMemberIds should fetch all member ids until it is finished', async () => {
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

it('#leaveGroup should call leave api', async () => {
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

it('#leaveRoom should call leave api', async () => {
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
