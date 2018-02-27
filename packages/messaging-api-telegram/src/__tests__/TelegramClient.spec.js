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
          limit: 10,
        })
        .reply(200, reply);

      const res = await client.getUpdates({
        limit: 10,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getWebhookInfo', () => {
    it('should response webhook info', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#setWebhook', () => {
    it('should response webhook was set', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
        description: 'Webhook was set',
      };

      mock.onPost('/setWebhook').reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteWebhook', () => {
    it('should response webhook is already deleted', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
        description: 'Webhook is already deleted',
      };

      mock.onPost('/deleteWebhook').reply(200, reply);

      const res = await client.deleteWebhook();

      expect(res).toEqual(reply);
    });
  });
});

describe('get api', () => {
  describe('#getMe', () => {
    it('should response bot profile', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#getUserProfilePhotos', () => {
    it('should response a list of profile pictures for the user', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/getUserProfilePhotos', {
          user_id: 313534466,
          limit: 2,
        })
        .reply(200, reply);

      const res = await client.getUserProfilePhotos(313534466, {
        limit: 2,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getFile', () => {
    it('should response info about the file', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#getFileLink', () => {
    it('should response file link about the file', async () => {
      const { client, mock } = createMock();
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

      const res = await client.getFileLink(
        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
      );

      expect(res).toEqual(
        `https://api.telegram.org/file/bot${ACCESS_TOKEN}/${reply.result
          .file_path}`
      );
    });
  });

  describe('#getChat', () => {
    it('should response information about the chat', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#getChatAdministrators', () => {
    it('should response a list of administrators in the chat.', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#getChatMembersCount', () => {
    it('should response the number of members in the chat.', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: '6',
      };

      mock
        .onPost('/getChatMembersCount', {
          chat_id: -427770117,
        })
        .reply(200, reply);

      const res = await client.getChatMembersCount(-427770117);

      expect(res).toEqual(reply);
    });
  });

  describe('#getChatMember', () => {
    it('should response information about a member of the chat.', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });
});

describe('send api', () => {
  describe('#sendMessage', () => {
    it('should send text message to user', async () => {
      const { client, mock } = createMock();
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
          text: 'hi',
        },
      };

      mock
        .onPost('/sendMessage', {
          chat_id: 427770117,
          text: 'hi',
          disable_web_page_preview: true,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendMessage(427770117, 'hi', {
        disable_web_page_preview: true,
        disable_notification: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendPhoto', () => {
    it('should send photo message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403191,
          photo: [
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAAEC',
              file_size: 1611,
              width: 90,
              height: 80,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koDAAEC',
              file_size: 17218,
              width: 320,
              height: 285,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDAAEC',
              file_size: 16209,
              width: 374,
              height: 333,
            },
          ],
          caption: 'gooooooodPhoto',
        },
      };

      mock
        .onPost('/sendPhoto', {
          chat_id: 427770117,
          photo: 'https://example.com/image.png',
          caption: 'gooooooodPhoto',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendPhoto(
        427770117,
        'https://example.com/image.png',
        {
          caption: 'gooooooodPhoto',
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAudio', () => {
    it('should send audio message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          audio: {
            duration: 108,
            mime_type: 'audio/mpeg',
            title: 'Song_Title',
            performer: 'Song_Performer',
            file_id: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
            file_size: 1739320,
          },
          caption: 'gooooooodAudio',
        },
      };

      mock
        .onPost('/sendAudio', {
          chat_id: 427770117,
          audio: 'https://example.com/audio.mp3',
          caption: 'gooooooodAudio',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendAudio(
        427770117,
        'https://example.com/audio.mp3',
        {
          caption: 'gooooooodAudio',
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendDocument', () => {
    it('should send document message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          document: {
            file_name: 'ylDRTR05sy6M.gif.mp4',
            mime_type: 'video/mp4',
            thumb: {
              file_id: 'AAQEABN0Rb0ZAARFFMCIr_zrhq9bAAIC',
              file_size: 1627,
              width: 90,
              height: 90,
            },
            file_id: 'CgADBAADO3wAAhUbZAer4xD-iB4NdgI',
            file_size: 21301,
          },
          caption: 'gooooooodDocument',
        },
      };

      mock
        .onPost('/sendDocument', {
          chat_id: 427770117,
          document: 'https://example.com/doc.gif',
          caption: 'gooooooodDocument',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendDocument(
        427770117,
        'https://example.com/doc.gif',
        {
          caption: 'gooooooodDocument',
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendSticker', () => {
    it('should send sticker message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          sticker: {
            width: 362,
            height: 512,
            emoji: '✊',
            thumb: {
              file_id: 'AAQFABOt1bEyAASi4MvOBXP2MYs8AQABAg',
              file_size: 2142,
              width: 63,
              height: 90,
            },
            file_id: 'CAADBQADQAADyIsGAAE7MpzFPFQX5QI',
            file_size: 36326,
          },
        },
      };

      mock
        .onPost('/sendSticker', {
          chat_id: 427770117,
          sticker: 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendSticker(
        427770117,
        'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
        {
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should send video message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          document: {
            file_name: 'madora.mp4',
            mime_type: 'video/mp4',
            thumb: {
              file_id: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
              file_size: 2874,
              width: 90,
              height: 90,
            },
            file_id: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
            file_size: 40582,
          },
          caption: 'gooooooodVideo',
        },
      };

      mock
        .onPost('/sendVideo', {
          chat_id: 427770117,
          video: 'https://example.com/video.mp4',
          caption: 'gooooooodVideo',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendVideo(
        427770117,
        'https://example.com/video.mp4',
        {
          caption: 'gooooooodVideo',
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVoice', () => {
    it('should send voice message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          document: {
            file_name: '1.ogg',
            mime_type: 'audio/ogg',
            file_id: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
            file_size: 10870,
          },
          caption: 'gooooooodVoice',
        },
      };

      mock
        .onPost('/sendVoice', {
          chat_id: 427770117,
          voice: 'https://example.com/voice.ogg',
          caption: 'gooooooodVoice',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendVoice(
        427770117,
        'https://example.com/voice.ogg',
        {
          caption: 'gooooooodVoice',
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideoNote', () => {
    it('should send video note message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          document: {
            file_name: 'madora.mp4',
            mime_type: 'video/mp4',
            thumb: {
              file_id: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
              file_size: 2874,
              width: 90,
              height: 90,
            },
            file_id: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
            file_size: 40582,
          },
        },
      };

      mock
        .onPost('/sendVideoNote', {
          chat_id: 427770117,
          video_note: 'https://example.com/video_note.mp4',
          duration: 40,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendVideoNote(
        427770117,
        'https://example.com/video_note.mp4',
        {
          duration: 40,
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMediaGroup', () => {
    it('should send a group of photos or videos as an album', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          photo: [
            {
              file_id: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
              width: 1000,
              height: 1000,
            },
          ],
        },
      };

      mock
        .onPost('/sendMediaGroup', {
          chat_id: 427770117,
          media: [{ type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' }],
        })
        .reply(200, reply);

      const res = await client.sendMediaGroup(427770117, [
        { type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendLocation', () => {
    it('should send location message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          location: {
            latitude: 30.000005,
            longitude: 45,
          },
        },
      };

      mock
        .onPost('/sendLocation', {
          chat_id: 427770117,
          latitude: 30,
          longitude: 45,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendLocation(
        427770117,
        {
          latitude: 30,
          longitude: 45,
        },
        {
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVenue', () => {
    it('should send venue message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          location: {
            latitude: 30.000005,
            longitude: 45,
          },
          venue: {
            location: {
              latitude: 30.000005,
              longitude: 45,
            },
            title: 'a_title',
            address: 'an_address',
          },
        },
      };

      mock
        .onPost('/sendVenue', {
          chat_id: 427770117,
          latitude: 30,
          longitude: 45,
          title: 'a_title',
          address: 'an_address',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendVenue(
        427770117,
        {
          latitude: 30,
          longitude: 45,
          title: 'a_title',
          address: 'an_address',
        },
        {
          disable_notification: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendContact', () => {
    it('should send contact message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          contact: {
            phone_number: '886123456789',
            first_name: 'first',
          },
        },
      };

      mock
        .onPost('/sendContact', {
          chat_id: 427770117,
          phone_number: '886123456789',
          first_name: 'first',
          last_name: 'last',
        })
        .reply(200, reply);

      const res = await client.sendContact(
        427770117,
        {
          phone_number: '886123456789',
          first_name: 'first',
        },
        { last_name: 'last' }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendChatAction', () => {
    it("should tell the user that something is happening on the bot's side", async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/sendChatAction', {
          chat_id: 427770117,
          action: 'typing',
        })
        .reply(200, reply);

      const res = await client.sendChatAction(427770117, 'typing');

      expect(res).toEqual(reply);
    });
  });
});

describe('updating api', () => {
  describe('#editMessageText', () => {
    it('should change message text', async () => {
      const { client, mock } = createMock();
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
          text: 'new_text',
        },
      };

      mock
        .onPost('/editMessageText', {
          text: 'new_text',
          message_id: 66,
          disable_web_page_preview: true,
        })
        .reply(200, reply);

      const res = await client.editMessageText('new_text', {
        message_id: 66,
        disable_web_page_preview: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageCaption', () => {
    it('should change message caption', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          audio: {
            duration: 108,
            mime_type: 'audio/mpeg',
            title: 'Song_Title',
            performer: 'Song_Performer',
            file_id: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
            file_size: 1739320,
          },
          caption: 'new_caption',
        },
      };

      mock
        .onPost('/editMessageCaption', {
          caption: 'new_caption',
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageCaption('new_caption', {
        message_id: 66,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageReplyMarkup', () => {
    it('should change message reply_markup', async () => {
      const { client, mock } = createMock();
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
          text: 'hi',
        },
      };

      mock
        .onPost('/editMessageReplyMarkup', {
          reply_markup: {
            keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageReplyMarkup(
        {
          keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
        { message_id: 66 }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteMessage', () => {
    it('should delete message', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/deleteMessage', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.deleteMessage(427770117, 66);

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageLiveLocation', () => {
    it('should edit live location message', async () => {
      const { client, mock } = createMock();
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
            latitude: 11,
            longitude: 22,
          },
        },
      };

      mock
        .onPost('/editMessageLiveLocation', {
          latitude: 11,
          longitude: 22,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageLiveLocation(
        {
          latitude: 11,
          longitude: 22,
        },
        { message_id: 66 }
      );

      expect(res).toEqual(reply);
    });
  });
});

describe('group api', () => {
  describe('#kickChatMember', () => {
    it('should kick chat member', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/kickChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          until_date: 1502855973,
        })
        .reply(200, reply);

      const res = await client.kickChatMember(427770117, 313534466, {
        until_date: 1502855973,
      });
      expect(res).toEqual(reply);
    });
  });

  describe('#unbanChatMember', () => {
    it('should unban chat member', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/unbanChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
        })
        .reply(200, reply);

      const res = await client.unbanChatMember(427770117, 313534466);
      expect(res).toEqual(reply);
    });
  });

  describe('#restrictChatMember', () => {
    it('should restrict chat member', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/restrictChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          can_send_messages: true,
          can_add_web_page_previews: true,
        })
        .reply(200, reply);

      const res = await client.restrictChatMember(427770117, 313534466, {
        can_send_messages: true,
        can_add_web_page_previews: true,
      });
      expect(res).toEqual(reply);
    });
  });

  describe('#promoteChatMember', () => {
    it('should pormote chat member', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/promoteChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          can_change_info: true,
          can_invite_users: true,
          can_delete_messages: true,
        })
        .reply(200, reply);

      const res = await client.promoteChatMember(427770117, 313534466, {
        can_change_info: true,
        can_invite_users: true,
        can_delete_messages: true,
      });
      expect(res).toEqual(reply);
    });
  });

  describe('#exportChatInviteLink', () => {
    it('should export chat invite link', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/exportChatInviteLink', {
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.exportChatInviteLink(427770117);
      expect(res).toEqual(reply);
    });
  });

  describe('#setChatPhoto', () => {
    it('should set chat photo', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/setChatPhoto', {
          chat_id: 427770117,
          photo: 'https://example.com/image.png',
        })
        .reply(200, reply);

      const res = await client.setChatPhoto(
        427770117,
        'https://example.com/image.png'
      );
      expect(res).toEqual(reply);
    });
  });

  describe('#deleteChatPhoto', () => {
    it('should delete chat photo', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/deleteChatPhoto', {
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.deleteChatPhoto(427770117);
      expect(res).toEqual(reply);
    });
  });

  describe('#setChatTitle', () => {
    it('should set chat title', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/setChatTitle', {
          chat_id: 427770117,
          title: 'New Title',
        })
        .reply(200, reply);

      const res = await client.setChatTitle(427770117, 'New Title');
      expect(res).toEqual(reply);
    });
  });

  describe('#setChatDescription', () => {
    it('should set chat description', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/setChatDescription', {
          chat_id: 427770117,
          description: 'New Description',
        })
        .reply(200, reply);

      const res = await client.setChatDescription(427770117, 'New Description');
      expect(res).toEqual(reply);
    });
  });

  describe('#setChatStickerSet', () => {
    it('should set a new group sticker set', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/setChatStickerSet', {
          chat_id: 427770117,
          sticker_set_name: 'Sticker Set Name',
        })
        .reply(200, reply);

      const res = await client.setChatStickerSet(427770117, 'Sticker Set Name');
      expect(res).toEqual(reply);
    });
  });

  describe('#deleteChatStickerSet', () => {
    it('should set a new group sticker set', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/deleteChatStickerSet', {
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.deleteChatStickerSet(427770117);
      expect(res).toEqual(reply);
    });
  });

  describe('#pinChatMessage', () => {
    it('should pin a message in chat', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/pinChatMessage', {
          chat_id: 427770117,
          messsage_id: 1,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.pinChatMessage(427770117, 1, {
        disable_notification: true,
      });
      expect(res).toEqual(reply);
    });
  });

  describe('#unpinChatMessage', () => {
    it('should unpin a message in chat', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/unpinChatMessage', {
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.unpinChatMessage(427770117);
      expect(res).toEqual(reply);
    });
  });

  describe('#leaveChat', () => {
    it('should leave chat', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/leaveChat', {
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.leaveChat(427770117);
      expect(res).toEqual(reply);
    });
  });
});

describe('payment api', () => {
  describe('#sendInvoice', () => {
    it('should send invoice message to user', async () => {
      const { client, mock } = createMock();
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
          date: 1499403678,
          invoice: {
            title: 'product name',
            description: 'product description',
            start_parameter: 'pay',
            currency: 'USD',
            total_count: 22000,
          },
        },
      };

      mock
        .onPost('/sendInvoice', {
          chat_id: 427770117,
          title: 'product name',
          description: 'product description',
          payload: 'bot-defined invoice payload',
          provider_token: 'PROVIDER_TOKEN',
          start_parameter: 'pay',
          currency: 'USD',
          prices: [
            { label: 'product', amount: 11000 },
            { label: 'tax', amount: 11000 },
          ],
        })
        .reply(200, reply);

      const res = await client.sendInvoice(427770117, {
        title: 'product name',
        description: 'product description',
        payload: 'bot-defined invoice payload',
        provider_token: 'PROVIDER_TOKEN',
        start_parameter: 'pay',
        currency: 'USD',
        prices: [
          { label: 'product', amount: 11000 },
          { label: 'tax', amount: 11000 },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#answerShippingQuery', () => {
    it('should export chat invite link', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/answerShippingQuery', {
          shipping_query_id: 'UNIQUE_ID',
          ok: true,
        })
        .reply(200, reply);

      const res = await client.answerShippingQuery('UNIQUE_ID', true);
      expect(res).toEqual(reply);
    });
  });

  describe('#answerPreCheckoutQuery', () => {
    it('should respond to such pre-checkout queries', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/answerPreCheckoutQuery', {
          pre_checkout_query_id: 'UNIQUE_ID',
          ok: true,
        })
        .reply(200, reply);

      const res = await client.answerPreCheckoutQuery('UNIQUE_ID', true);
      expect(res).toEqual(reply);
    });
  });
});

describe('inline mode api', () => {
  describe('#answerInlineQuery', () => {
    it('should send answers to an inline query', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
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
      expect(res).toEqual(reply);
    });
  });
});

describe('other api', () => {
  describe('#forwardMessage', () => {
    it('should forward messages of any kind', async () => {
      const { client, mock } = createMock();
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

      expect(res).toEqual(reply);
    });
  });

  describe('#stopMessageLiveLocation', () => {
    it('should stop updating a live location message', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/stopMessageLiveLocation', { message_id: 66 })
        .reply(200, reply);

      const res = await client.stopMessageLiveLocation({ message_id: 66 });

      expect(res).toEqual(reply);
    });
  });
});

describe('game api', () => {
  describe('sendGame', () => {
    it('should send a game', async () => {
      const { client, mock } = createMock();
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
          game: {
            title: 'Mario Bros.',
            description: 'Mario Bros. is fun!',
            photo: [
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
          },
        },
      };

      mock
        .onPost('/sendGame', {
          chat_id: 427770117,
          game_short_name: 'Mario Bros.',
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.sendGame(427770117, 'Mario Bros.', {
        disable_notification: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('setGameScore', () => {
    it('should set the score of the specified user in a game', async () => {
      const { client, mock } = createMock();
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
          game: {
            title: 'Mario Bros.',
            description: 'Mario Bros. is fun!',
            photo: [
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
            text: 'User 427770117 score is 999.',
          },
        },
      };

      mock
        .onPost('/setGameScore', { user_id: 427770117, score: 999 })
        .reply(200, reply);

      const res = await client.setGameScore(427770117, 999);

      expect(res).toEqual(reply);
    });
  });

  describe('getGameHighScores', () => {
    it('should get data for high score tables', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: [
          {
            position: 1,
            user: {
              id: 427770117,
              is_bot: false,
              first_name: 'first',
            },
            score: 999,
          },
        ],
      };

      mock
        .onPost('/getGameHighScores', { user_id: 427770117 })
        .reply(200, reply);

      const res = await client.getGameHighScores(427770117);

      expect(res).toEqual(reply);
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
