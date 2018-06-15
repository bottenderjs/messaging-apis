import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

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

describe('LINE Front-end Framework', () => {
  describe('#getLiffAppList', () => {
    it('should call api', async () => {
      const { client, mock } = createMock();

      const reply = {
        apps: [
          {
            liffId: 'liff-12345',
            view: {
              type: 'full',
              url: 'https://example.com/myservice',
            },
          },
          {
            liffId: 'liff-67890',
            view: {
              type: 'tall',
              url: 'https://example.com/myservice2',
            },
          },
        ],
      };

      mock.onGet('/liff/v1/apps').reply(200, reply, headers);

      const res = await client.getLiffAppList();

      expect(res).toEqual([
        {
          liffId: 'liff-12345',
          view: {
            type: 'full',
            url: 'https://example.com/myservice',
          },
        },
        {
          liffId: 'liff-67890',
          view: {
            type: 'tall',
            url: 'https://example.com/myservice2',
          },
        },
      ]);
    });
  });

  describe('#createLiffApp', () => {
    it('should call api', async () => {
      const { client, mock } = createMock();

      const reply = {
        liffId: 'liff-12345',
      };

      mock
        .onPost('/liff/v1/apps', {
          type: 'tall',
          url: 'https://example.com/myservice',
        })
        .reply(200, reply, headers);

      const res = await client.createLiffApp({
        type: 'tall',
        url: 'https://example.com/myservice',
      });

      expect(res).toEqual({
        liffId: 'liff-12345',
      });
    });
  });

  describe('#updateLiffApp', () => {
    it('should call api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPut('/liff/v1/apps/liff-12345/view', {
          type: 'tall',
          url: 'https://example.com/myservice',
        })
        .reply(200, reply, headers);

      const res = await client.updateLiffApp('liff-12345', {
        type: 'tall',
        url: 'https://example.com/myservice',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteLiffApp', () => {
    it('should call api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock.onDelete('/liff/v1/apps/liff-12345').reply(200, reply, headers);

      const res = await client.deleteLiffApp('liff-12345');

      expect(res).toEqual(reply);
    });
  });
});
