import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = () => {
  const client = new TelegramClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('webhooks', () => {
  describe('#getUpdates', () => {
    it('should response array of Update objects', async () => {
      const { client, mock } = createMock();
      const result = [
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
      ];
      const reply = {
        ok: true,
        result,
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
    it('should response webhook info', async () => {
      const { client, mock } = createMock();
      const result = {
        url: 'https://4a16faff.ngrok.io/',
        has_custom_certificate: false,
        pending_update_count: 0,
        max_connections: 40,
      };
      const reply = {
        ok: true,
        result,
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

    it('should response webhook was set', async () => {
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

    it('should work well with snakecase options', async () => {
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
        max_connections: 40,
        allowed_updates: [],
      });

      expect(res).toEqual(result);
    });
  });

  describe('#deleteWebhook', () => {
    it('should response webhook is already deleted', async () => {
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

describe('get api', () => {
  describe('#getMe', () => {
    it('should response bot profile', async () => {
      const { client, mock } = createMock();
      const result = {
        id: 313534466,
        first_name: 'first',
        username: 'a_bot',
      };
      const reply = {
        ok: true,
        result,
      };

      mock.onPost('/getMe').reply(200, reply);

      const res = await client.getMe();

      expect(res).toEqual(result);
    });
  });

  describe('#getUserProfilePhotos', () => {
    it('should response a list of profile pictures for the user', async () => {
      const { client, mock } = createMock();
      const result = {
        total_count: 3,
        photos: [
          [
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
              file_size: 14650,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
              file_size: 39019,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
              file_size: 132470,
              width: 640,
              height: 640,
            },
          ],
          [
            {
              file_id:
                'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
              file_size: 14220,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
              file_size: 35122,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
              file_size: 106356,
              width: 640,
              height: 640,
            },
          ],
        ],
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getUserProfilePhotos', {
          user_id: 313534466,
          limit: 2,
        })
        .reply(200, reply);

      const res = await client.getUserProfilePhotos(313534466, {
        limit: 2,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#getFile', () => {
    it('should response info about the file', async () => {
      const { client, mock } = createMock();
      const result = {
        file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        file_size: 106356,
        file_path: 'photos/1068230105874016297.jpg',
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getFile', {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        })
        .reply(200, reply);

      const res = await client.getFile(
        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
      );

      expect(res).toEqual(result);
    });
  });

  describe('#getFileLink', () => {
    it('should response file link about the file', async () => {
      const { client, mock } = createMock();
      const result = {
        file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        file_size: 106356,
        file_path: 'photos/1068230105874016297.jpg',
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getFile', {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        })
        .reply(200, reply);

      const res = await client.getFileLink(
        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
      );

      expect(res).toEqual(
        `https://api.telegram.org/file/bot${ACCESS_TOKEN}/${reply.result.file_path}`
      );
    });
  });

  describe('#getChat', () => {
    it('should response information about the chat', async () => {
      const { client, mock } = createMock();
      const result = {
        id: 313534466,
        first_name: 'first',
        last_name: 'last',
        username: 'username',
        type: 'private',
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getChat', {
          chat_id: 313534466,
        })
        .reply(200, reply);

      const res = await client.getChat(313534466);

      expect(res).toEqual(result);
    });
  });

  describe('#getChatAdministrators', () => {
    it('should response a list of administrators in the chat.', async () => {
      const { client, mock } = createMock();
      const result = [
        {
          user: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
            languange_code: 'zh-TW',
          },
          status: 'creator',
        },
      ];
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getChatAdministrators', {
          chat_id: -427770117,
        })
        .reply(200, reply);

      const res = await client.getChatAdministrators(-427770117);

      expect(res).toEqual(result);
    });
  });

  describe('#getChatMembersCount', () => {
    it('should response the number of members in the chat.', async () => {
      const { client, mock } = createMock();
      const result = '6';
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getChatMembersCount', {
          chat_id: -427770117,
        })
        .reply(200, reply);

      const res = await client.getChatMembersCount(-427770117);

      expect(res).toEqual(result);
    });
  });

  describe('#getChatMember', () => {
    it('should response information about a member of the chat.', async () => {
      const { client, mock } = createMock();
      const result = {
        user: {
          id: 313534466,
          first_name: 'first',
          last_name: 'last',
          username: 'username',
          languange_code: 'zh-TW',
        },
        status: 'creator',
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/getChatMember', {
          chat_id: -427770117,
          user_id: 313534466,
        })
        .reply(200, reply);

      const res = await client.getChatMember(-427770117, 313534466);

      expect(res).toEqual(result);
    });
  });
});

describe('inline mode api', () => {
  describe('#answerInlineQuery', () => {
    it('should send answers to an inline query', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/answerInlineQuery', {
          inline_query_id: 'INLINE_QUERY_ID',
          results: [
            {
              type: 'photo',
              id: 'UNIQUE_ID',
              photo_file_id: 'FILE_ID',
              title: 'PHOTO_TITLE',
            },
            {
              type: 'audio',
              id: 'UNIQUE_ID',
              audio_file_id: 'FILE_ID',
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
            photo_file_id: 'FILE_ID',
            title: 'PHOTO_TITLE',
          },
          {
            type: 'audio',
            id: 'UNIQUE_ID',
            audio_file_id: 'FILE_ID',
            caption: 'AUDIO_TITLE',
          },
        ],
        {
          cache_time: 1000,
        }
      );
      expect(res).toEqual(result);
    });
  });
});

describe('other api', () => {
  describe('#forwardMessage', () => {
    const result = {
      message_id: 1,
      from: {
        id: 313534466,
        first_name: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        first_name: 'first',
        last_name: 'last',
        type: 'private',
      },
      date: 1499402829,
      forward_from: {
        id: 357830311,
        first_name: 'first_2',
        last_name: 'last_2',
        language_code: 'zh-TW',
      },
      forward_date: 1499849644,
      text: 'hi',
    };
    const reply = {
      ok: true,
      result,
    };

    it('should forward messages of any kind with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/forwardMessage', {
          chat_id: 427770117,
          from_chat_id: 313534466,
          message_id: 203,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.forwardMessage(427770117, 313534466, 203, {
        disable_notification: true,
      });

      expect(res).toEqual(result);
    });
    it('should forward messages of any kind with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/forwardMessage', {
          chat_id: 427770117,
          from_chat_id: 313534466,
          message_id: 203,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.forwardMessage(427770117, 313534466, 203, {
        disableNotification: true,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#stopMessageLiveLocation', () => {
    it('should stop updating a live location message', async () => {
      const { client, mock } = createMock();
      const result = {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499402829,
        location: {
          latitude: 30.000005,
          longitude: 45,
        },
      };
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/stopMessageLiveLocation', { message_id: 66 })
        .reply(200, reply);

      const res = await client.stopMessageLiveLocation({ message_id: 66 });

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
