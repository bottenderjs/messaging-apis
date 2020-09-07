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
    it('should response array of Update objects', async () => {
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
    it('should response webhook info', async () => {
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
        // @ts-expect-error
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
        firstName: 'first',
        username: 'a_bot',
      };
      const reply = {
        ok: true,
        result: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
      };

      mock.onPost('/getMe').reply(200, reply);

      const res = await client.getMe();

      expect(res).toEqual(result);
    });
  });

  describe('#getUserProfilePhotos', () => {
    const result = {
      totalCount: 3,
      photos: [
        [
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
            fileSize: 14650,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
            fileSize: 39019,
            width: 320,
            height: 320,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
            fileSize: 132470,
            width: 640,
            height: 640,
          },
        ],
        [
          {
            fileId: 'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
            fileSize: 14220,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
            fileSize: 35122,
            width: 320,
            height: 320,
          },
          {
            fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
            fileSize: 106356,
            width: 640,
            height: 640,
          },
        ],
      ],
    };
    const reply = {
      ok: true,
      result: {
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
      },
    };

    it('should response a list of profile pictures for the user', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/getUserProfilePhotos', {
          user_id: 313534466,
          offset: 0,
          limit: 2,
        })
        .reply(200, reply);

      const res = await client.getUserProfilePhotos(313534466, {
        offset: 0,
        limit: 2,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#getFile', () => {
    it('should response info about the file', async () => {
      const { client, mock } = createMock();
      const result = {
        fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
        fileSize: 106356,
        filePath: 'photos/1068230105874016297.jpg',
      };
      const reply = {
        ok: true,
        result: {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          file_size: 106356,
          file_path: 'photos/1068230105874016297.jpg',
        },
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
      const filePath = 'photos/1068230105874016297.jpg';
      const reply = {
        ok: true,
        result: {
          file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          file_size: 106356,
          file_path: filePath,
        },
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
        `https://api.telegram.org/file/bot${ACCESS_TOKEN}/${filePath}`
      );
    });
  });

  describe('#getChat', () => {
    it('should response information about the chat', async () => {
      const { client, mock } = createMock();
      const result = {
        id: 313534466,
        firstName: 'first',
        lastName: 'last',
        username: 'username',
        type: 'private',
      };
      const reply = {
        ok: true,
        result: {
          id: 313534466,
          first_name: 'first',
          last_name: 'last',
          username: 'username',
          type: 'private',
        },
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
            firstName: 'first',
            lastName: 'last',
            username: 'username',
            languangeCode: 'zh-TW',
          },
          status: 'creator',
        },
      ];
      const reply = {
        ok: true,
        result: [
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
        ],
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
          firstName: 'first',
          lastName: 'last',
          username: 'username',
          languangeCode: 'zh-TW',
        },
        status: 'creator',
      };
      const reply = {
        ok: true,
        result: {
          user: {
            id: 313534466,
            first_name: 'first',
            last_name: 'last',
            username: 'username',
            languange_code: 'zh-TW',
          },
          status: 'creator',
        },
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
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should send answers to an inline query with snakecase', async () => {
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
            // @ts-expect-error
            photo_file_id: 'FILEID',
            title: 'PHOTO_TITLE',
          },
          {
            type: 'audio',
            id: 'UNIQUE_ID',
            // @ts-expect-error
            audio_file_id: 'FILEID',
            caption: 'AUDIO_TITLE',
          },
        ],
        {
          cache_time: 1000,
        }
      );
      expect(res).toEqual(result);
    });

    it('should send answers to an inline query with camelcase', async () => {
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

    it('should send answers to an callback query with snakecase', async () => {
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
        // @ts-expect-error
        show_alert: true,
        url: 'http://example.com/',
        cache_time: 1000,
      });
      expect(res).toEqual(result);
    });

    it('should send answers to an callback query with camelcase', async () => {
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

describe('other api', () => {
  describe('#forwardMessage', () => {
    const result = {
      messageId: 1,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499402829,
      forwardFrom: {
        id: 357830311,
        firstName: 'first_2',
        lastName: 'last_2',
        languageCode: 'zh-TW',
      },
      forwardDate: 1499849644,
      text: 'hi',
    };
    const reply = {
      ok: true,
      result: {
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
      },
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
        // @ts-expect-error
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
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
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
      result: {
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
      },
    };

    it('should stop updating a live location message with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/stopMessageLiveLocation', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.stopMessageLiveLocation({
        // @ts-expect-error
        chat_id: 427770117,
        message_id: 66,
      });

      expect(res).toEqual(result);
    });
    it('should stop updating a live location message with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/stopMessageLiveLocation', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.stopMessageLiveLocation({
        chatId: 427770117,
        messageId: 66,
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
