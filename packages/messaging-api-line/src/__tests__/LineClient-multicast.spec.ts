import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
} => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });
  const mock = new MockAdapter(client.axios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, headers };
};

describe('Multicast', () => {
  describe('#multicastRawBody', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicastRawBody({
        to: [RECIPIENT_ID],
        messages: [
          {
            type: 'text',
            text: 'Hello!',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicast', () => {
    it('should call multicast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply((config) => {
        expect(config.url).toEqual('/v2/bot/message/multicast');
        expect(JSON.parse(config.data)).toEqual({
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        });
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.multicast(
        [RECIPIENT_ID],
        [
          {
            type: 'text',
            text: 'Hello!',
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });
});
