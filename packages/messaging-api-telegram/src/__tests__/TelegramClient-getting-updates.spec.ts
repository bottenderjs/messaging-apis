import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

it('should support #getUpdates', async () => {
  const { client, mock } = createMock();
  const result = [
    {
      updateId: 513400512,
      message: {
        messageId: 3,
        from: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
        },
        chat: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
          type: 'private',
        },
        date: 1499402829,
        text: 'hi',
      },
    },
    {
      updateId: 513400513,
      message: {
        messageId: 4,
        from: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
        },
        chat: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
          type: 'private',
        },
        date: 1484944975,
        sticker: {
          width: 512,
          height: 512,
          emoji: '\ud83d\ude0d',
          thumb: {
            fileId: 'AAQEABMr6HIwAAT9WnLtRCT6KIgiAAIC',
            fileSize: 2828,
            width: 128,
            height: 128,
          },
          fileId: 'BQADBAADrwgAAjn8EwY1EPt_ycp8OwI',
          fileSize: 14102,
        },
      },
    },
  ];
  const reply = {
    ok: true,
    result: [
      {
        update_id: 513400512,
        message: {
          message_id: 3,
          from: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
          },
          chat: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
            type: 'private',
          },
          date: 1499402829,
          text: 'hi',
        },
      },
      {
        update_id: 513400513,
        message: {
          message_id: 4,
          from: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
          },
          chat: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
            type: 'private',
          },
          date: 1484944975,
          sticker: {
            width: 512,
            height: 512,
            emoji: '\ud83d\ude0d',
            thumb: {
              file_id: 'AAQEABMr6HIwAAT9WnLtRCT6KIgiAAIC',
              file_size: 2828,
              width: 128,
              height: 128,
            },
            file_id: 'BQADBAADrwgAAjn8EwY1EPt_ycp8OwI',
            file_size: 14102,
          },
        },
      },
    ],
  };

  mock
    .onPost('/getUpdates', {
      offset: 9527,
      limit: 10,
      timeout: 0,
      allowed_updates: [],
    })
    .reply(200, reply);

  const res = await client.getUpdates({
    offset: 9527,
    limit: 10,
    timeout: 0,
    allowedUpdates: [],
  });

  expect(res).toEqual(result);
});

it('should support #setWebhook', async () => {
  const { client, mock } = createMock();

  const result = true;
  const reply = {
    ok: true,
    result,
    description: 'Webhook was set',
  };
  mock.onPost('/setWebhook').reply(200, reply);

  const res = await client.setWebhook('https://4a16faff.ngrok.io/');

  expect(res).toEqual(result);
});

it('should support #deleteWebhook', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
    description: 'Webhook is already deleted',
  };

  mock.onPost('/deleteWebhook').reply(200, reply);

  const res = await client.deleteWebhook();

  expect(res).toEqual(result);
});

it('should support #getWebhookInfo', async () => {
  const { client, mock } = createMock();
  const result = {
    url: 'https://4a16faff.ngrok.io/',
    hasCustomCertificate: false,
    pendingUpdateCount: 0,
    maxConnections: 40,
  };
  const reply = {
    ok: true,
    result: {
      url: 'https://4a16faff.ngrok.io/',
      has_custom_certificate: false,
      pending_update_count: 0,
      max_connections: 40,
    },
  };

  mock.onPost('/getWebhookInfo').reply(200, reply);

  const res = await client.getWebhookInfo();

  expect(res).toEqual(result);
});
