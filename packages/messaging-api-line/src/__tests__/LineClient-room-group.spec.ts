import { RestRequest, rest } from 'msw';

import { LineClient } from '..';

import { setupLineServer } from './testing-library';

const lineServer = setupLineServer();

const USER_ID = 'U00000000000000000000000000000000';
const GROUP_ID = 'G00000000000000000000000000000000';
const ROOM_ID = 'R00000000000000000000000000000000';
const CONTINUATION_TOKEN = 'jxEWCEEP...';

function setup() {
  const context: { request: RestRequest | undefined } = {
    request: undefined,
  };
  lineServer.use(
    rest.get(
      'https://api.line.me/v2/bot/group/:groupId/summary',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            groupId: req.params.groupId,
            groupName: 'LINE Group',
            pictureUrl: 'http:/obs.line-apps.com/...',
          })
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/group/:groupId/member/:userId',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            displayName: 'LINE taro',
            userId: USER_ID,
            pictureUrl: 'http://obs.line-apps.com/...',
          })
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/group/:groupId/members/count',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            count: 3,
          })
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/group/:groupId/members/ids',
      (req, res, ctx) => {
        context.request = req;

        if (req.url.searchParams.get('start') === CONTINUATION_TOKEN) {
          return res(
            ctx.json({
              memberIds: [
                'U00000000000000000000000000000004',
                'U00000000000000000000000000000005',
                'U00000000000000000000000000000006',
              ],
            })
          );
        }
        return res(
          ctx.json({
            memberIds: [
              'U00000000000000000000000000000001',
              'U00000000000000000000000000000002',
              'U00000000000000000000000000000003',
            ],
            next: CONTINUATION_TOKEN,
          })
        );
      }
    ),
    rest.post(
      'https://api.line.me/v2/bot/group/:groupId/leave',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/room/:roomId/member/:userId',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            displayName: 'LINE taro',
            userId: USER_ID,
            pictureUrl: 'http://obs.line-apps.com/...',
          })
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/room/:roomId/members/count',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            count: 3,
          })
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/room/:roomId/members/ids',
      (req, res, ctx) => {
        context.request = req;
        if (req.url.searchParams.get('start') === CONTINUATION_TOKEN) {
          return res(
            ctx.json({
              memberIds: [
                'U00000000000000000000000000000004',
                'U00000000000000000000000000000005',
                'U00000000000000000000000000000006',
              ],
            })
          );
        }
        return res(
          ctx.json({
            memberIds: [
              'U00000000000000000000000000000001',
              'U00000000000000000000000000000002',
              'U00000000000000000000000000000003',
            ],
            next: CONTINUATION_TOKEN,
          })
        );
      }
    ),
    rest.post(
      'https://api.line.me/v2/bot/room/:roomId/leave',
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

it('#getGroupSummary should respond group summary', async () => {
  const { context, client } = setup();

  const res = await client.getGroupSummary(GROUP_ID);

  expect(res).toEqual({
    groupId: GROUP_ID,
    groupName: 'LINE Group',
    pictureUrl: 'http:/obs.line-apps.com/...',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${GROUP_ID}/summary`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getGroupMemberProfile should respond group member profile', async () => {
  const { context, client } = setup();

  const res = await client.getGroupMemberProfile(GROUP_ID, USER_ID);

  expect(res).toEqual({
    displayName: 'LINE taro',
    userId: USER_ID,
    pictureUrl: 'http://obs.line-apps.com/...',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${GROUP_ID}/member/${USER_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getRoomMemberProfile should respond room member profile', async () => {
  const { context, client } = setup();

  const res = await client.getRoomMemberProfile(ROOM_ID, USER_ID);

  expect(res).toEqual({
    displayName: 'LINE taro',
    userId: USER_ID,
    pictureUrl: 'http://obs.line-apps.com/...',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${ROOM_ID}/member/${USER_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getGroupMembersCount should respond group members count', async () => {
  const { context, client } = setup();

  const res = await client.getGroupMembersCount(GROUP_ID);

  expect(res).toBe(3);

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${GROUP_ID}/members/count`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getRoomMembersCount should respond room members count', async () => {
  const { context, client } = setup();

  const res = await client.getRoomMembersCount(ROOM_ID);

  expect(res).toBe(3);

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${ROOM_ID}/members/count`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

describe('#getGroupMemberIds', () => {
  it('should respond group member ids', async () => {
    const { context, client } = setup();

    const res = await client.getGroupMemberIds(GROUP_ID);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000001',
        'U00000000000000000000000000000002',
        'U00000000000000000000000000000003',
      ],
      next: CONTINUATION_TOKEN,
    });

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });

  it('should call api with provided continuation token', async () => {
    const { context, client } = setup();

    const res = await client.getGroupMemberIds(GROUP_ID, CONTINUATION_TOKEN);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000004',
        'U00000000000000000000000000000005',
        'U00000000000000000000000000000006',
      ],
    });

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids?start=${CONTINUATION_TOKEN}`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});

it('#getAllGroupMemberIds should fetch all member ids until it is finished', async () => {
  const { client } = setup();

  const res = await client.getAllGroupMemberIds(GROUP_ID);

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
    const { context, client } = setup();

    const res = await client.getRoomMemberIds(ROOM_ID);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000001',
        'U00000000000000000000000000000002',
        'U00000000000000000000000000000003',
      ],
      next: CONTINUATION_TOKEN,
    });

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });

  it('should call api with provided continuation token', async () => {
    const { context, client } = setup();

    const res = await client.getRoomMemberIds(ROOM_ID, CONTINUATION_TOKEN);

    expect(res).toEqual({
      memberIds: [
        'U00000000000000000000000000000004',
        'U00000000000000000000000000000005',
        'U00000000000000000000000000000006',
      ],
    });

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('GET');
    expect(request?.url.href).toBe(
      `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids?start=${CONTINUATION_TOKEN}`
    );
    expect(request?.headers.get('Content-Type')).toBe('application/json');
    expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});

it('#getAllRoomMemberIds should fetch all member ids until it is finished', async () => {
  const { client } = setup();

  const res = await client.getAllRoomMemberIds(ROOM_ID);

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
  const { context, client } = setup();

  const res = await client.leaveGroup(GROUP_ID);

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/group/${GROUP_ID}/leave`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#leaveRoom should call leave api', async () => {
  const { context, client } = setup();

  const res = await client.leaveRoom(ROOM_ID);

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/room/${ROOM_ID}/leave`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
