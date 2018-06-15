import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
const GROUP_ID = 'G1QAZ2WSX';
const ROOM_ID = 'R1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

const createMock = () => {
  const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('Group/Room Member', () => {
  describe('#getGroupMemberProfile', () => {
    it('should response group member profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock
        .onGet(`/v2/bot/group/${GROUP_ID}/member/${RECIPIENT_ID}`)
        .reply(200, reply, headers);

      const res = await client.getGroupMemberProfile(GROUP_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#getRoomMemberProfile', () => {
    it('should response room member profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock
        .onGet(`/v2/bot/room/${ROOM_ID}/member/${RECIPIENT_ID}`)
        .reply(200, reply, headers);

      const res = await client.getRoomMemberProfile(ROOM_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#getGroupMemberIds', () => {
    it('should response group member ids', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock
        .onGet(`/v2/bot/group/${GROUP_ID}/members/ids`)
        .reply(200, reply, headers);

      const res = await client.getGroupMemberIds(GROUP_ID);

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock
        .onGet(
          `/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
        )
        .reply(200, reply, headers);

      const res = await client.getGroupMemberIds(GROUP_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllGroupMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      const { client, mock } = createMock();
      const continuationToken = 'TOKEN';
      const reply1 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..1',
          'Uxxxxxxxxxxxxxx..2',
          'Uxxxxxxxxxxxxxx..3',
        ],
        next: continuationToken,
      };
      const reply2 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..4',
          'Uxxxxxxxxxxxxxx..5',
          'Uxxxxxxxxxxxxxx..6',
        ],
      };

      mock
        .onGet(`/v2/bot/group/${GROUP_ID}/members/ids`)
        .replyOnce(200, reply1, headers)
        .onGet(
          `/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
        )
        .replyOnce(200, reply2, headers);

      const res = await client.getAllGroupMemberIds(GROUP_ID);

      expect(res).toEqual([
        'Uxxxxxxxxxxxxxx..1',
        'Uxxxxxxxxxxxxxx..2',
        'Uxxxxxxxxxxxxxx..3',
        'Uxxxxxxxxxxxxxx..4',
        'Uxxxxxxxxxxxxxx..5',
        'Uxxxxxxxxxxxxxx..6',
      ]);
    });
  });

  describe('#getRoomMemberIds', () => {
    it('should response room member ids', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock
        .onGet(`/v2/bot/room/${ROOM_ID}/members/ids`)
        .reply(200, reply, headers);

      const res = await client.getRoomMemberIds(ROOM_ID);

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock
        .onGet(`/v2/bot/room/${ROOM_ID}/members/ids?start=${continuationToken}`)
        .reply(200, reply, headers);

      const res = await client.getRoomMemberIds(ROOM_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllRoomMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      const { client, mock } = createMock();
      const continuationToken = 'TOKEN';
      const reply1 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..1',
          'Uxxxxxxxxxxxxxx..2',
          'Uxxxxxxxxxxxxxx..3',
        ],
        next: continuationToken,
      };
      const reply2 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..4',
          'Uxxxxxxxxxxxxxx..5',
          'Uxxxxxxxxxxxxxx..6',
        ],
      };

      mock
        .onGet(`/v2/bot/room/${ROOM_ID}/members/ids`)
        .replyOnce(200, reply1, headers)
        .onGet(`/v2/bot/room/${ROOM_ID}/members/ids?start=${continuationToken}`)
        .replyOnce(200, reply2, headers);

      const res = await client.getAllRoomMemberIds(ROOM_ID);

      expect(res).toEqual([
        'Uxxxxxxxxxxxxxx..1',
        'Uxxxxxxxxxxxxxx..2',
        'Uxxxxxxxxxxxxxx..3',
        'Uxxxxxxxxxxxxxx..4',
        'Uxxxxxxxxxxxxxx..5',
        'Uxxxxxxxxxxxxxx..6',
      ]);
    });
  });
});

describe('Leave', () => {
  describe('#leaveGroup', () => {
    it('should call leave api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock.onPost(`/v2/bot/group/${GROUP_ID}/leave`).reply(200, reply, headers);

      const res = await client.leaveGroup(GROUP_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#leaveRoom', () => {
    it('should call leave api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock.onPost(`/v2/bot/room/${ROOM_ID}/leave`).reply(200, reply, headers);

      const res = await client.leaveRoom(ROOM_ID);

      expect(res).toEqual(reply);
    });
  });
});
