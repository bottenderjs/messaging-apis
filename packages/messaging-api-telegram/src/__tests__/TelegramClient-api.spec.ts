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

describe('webhooks', () => {
  describe('#getUpdates', () => {
    it('should respond array of Update objects', async () => {
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
  });

  describe('#getWebhookInfo', () => {
    it('should respond webhook info', async () => {
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
  });

  describe('#setWebhook', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
      description: 'Webhook was set',
    };

    it('should respond webhook was set', async () => {
      const { client, mock } = createMock();
      mock.onPost('/setWebhook').reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(result);
    });

    it('should ignore certificate options and transform all options to snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/setWebhook', {
          url: 'https://4a16faff.ngrok.io/',
          max_connections: 40,
          allowed_updates: [],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', {
        certificate: 'qq',
        maxConnections: 40,
        allowedUpdates: [],
      });

      expect(res).toEqual(result);
    });
  });

  describe('#deleteWebhook', () => {
    it('should respond webhook is already deleted', async () => {
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
  });
});

describe('inline mode api', () => {
  describe('#answerInlineQuery', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should send answers to an inline query', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/answerInlineQuery', {
          inline_query_id: 'INLINE_QUERY_ID',
          results: [
            {
              type: 'photo',
              id: 'UNIQUE_ID',
              photo_file_id: 'FILEID',
              title: 'PHOTO_TITLE',
            },
            {
              type: 'audio',
              id: 'UNIQUE_ID',
              audio_file_id: 'FILEID',
              caption: 'AUDIO_TITLE',
            },
          ],
          cache_time: 1000,
        })
        .reply(200, reply);

      const res = await client.answerInlineQuery(
        'INLINE_QUERY_ID',
        [
          {
            type: 'photo',
            id: 'UNIQUE_ID',
            photoFileId: 'FILEID',
            title: 'PHOTO_TITLE',
          },
          {
            type: 'audio',
            id: 'UNIQUE_ID',
            audioFileId: 'FILEID',
            caption: 'AUDIO_TITLE',
          },
        ],
        {
          cacheTime: 1000,
        }
      );
      expect(res).toEqual(result);
    });
  });

  describe('#answerCallbackQuery', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should send answers to an callback query', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/answerCallbackQuery', {
          callback_query_id: 'CALLBACK_QUERY_ID',
          text: 'text',
          show_alert: true,
          url: 'http://example.com/',
          cache_time: 1000,
        })
        .reply(200, reply);

      const res = await client.answerCallbackQuery('CALLBACK_QUERY_ID', {
        text: 'text',
        showAlert: true,
        url: 'http://example.com/',
        cacheTime: 1000,
      });
      expect(res).toEqual(result);
    });
  });
});

describe('Error', () => {
  it('should format correctly', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: false,
      error_code: 404,
      description: 'Not Found',
    };

    mock.onAny().reply(400, reply);

    let error;
    try {
      await client.sendMessage(427770117, 'hi');
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual('Telegram API - 404 Not Found');
  });
});
