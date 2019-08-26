import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
const GROUP_ID = 'G1QAZ2WSX';
const ROOM_ID = 'R1QAZ2WSX';
const CUSTOM_ACCESS_TOKEN = '555555555';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = ({ customAccessToken } = {}) => {
  const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
  const mock = new MockAdapter(client.axios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${customAccessToken || ACCESS_TOKEN}`,
  };
  return { client, mock, headers };
};

describe('Group/Room Member', () => {
  describe('#getGroupMemberProfile', () => {
    it('should response group member profile', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/member/${RECIPIENT_ID}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getGroupMemberProfile(GROUP_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/member/${RECIPIENT_ID}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getGroupMemberProfile(GROUP_ID, RECIPIENT_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getRoomMemberProfile', () => {
    it('should response room member profile', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/member/${RECIPIENT_ID}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRoomMemberProfile(ROOM_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/member/${RECIPIENT_ID}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRoomMemberProfile(ROOM_ID, RECIPIENT_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getGroupMemberIds', () => {
    it('should response group member ids', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getGroupMemberIds(GROUP_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getGroupMemberIds(GROUP_ID, null, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getGroupMemberIds(GROUP_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllGroupMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      expect.assertions(7);

      const { client, mock, headers } = createMock();
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
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply1];
        })
        .onGet(
          `/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
        )
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply2];
        });

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

    it('should work with custom access token', async () => {
      expect.assertions(7);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
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
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply1];
        })
        .onGet(
          `/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
        )
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/group/${GROUP_ID}/members/ids?start=${continuationToken}`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply2];
        });

      const res = await client.getAllGroupMemberIds(GROUP_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

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
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRoomMemberIds(ROOM_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRoomMemberIds(ROOM_ID, null, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids?start=${continuationToken}`
        );
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getRoomMemberIds(ROOM_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllRoomMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      expect.assertions(7);

      const { client, mock, headers } = createMock();
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
        .onGet()
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply1];
        })
        .onGet()
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids?start=${continuationToken}`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply2];
        });

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

    it('should work with custom access token', async () => {
      expect.assertions(7);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });
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
        .onGet()
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply1];
        })
        .onGet()
        .replyOnce(config => {
          expect(config.url).toEqual(
            `https://api.line.me/v2/bot/room/${ROOM_ID}/members/ids?start=${continuationToken}`
          );
          expect(config.data).toEqual(undefined);
          expect(config.headers).toEqual(headers);
          return [200, reply2];
        });

      const res = await client.getAllRoomMemberIds(ROOM_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

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
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/leave`
        );
        expect(config.data).toEqual(null);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.leaveGroup(GROUP_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/group/${GROUP_ID}/leave`
        );
        expect(config.data).toEqual(null);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.leaveGroup(GROUP_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#leaveRoom', () => {
    it('should call leave api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/leave`
        );
        expect(config.data).toEqual(null);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.leaveRoom(ROOM_ID);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/room/${ROOM_ID}/leave`
        );
        expect(config.data).toEqual(null);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.leaveRoom(ROOM_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });
});
