import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = () => {
  const client = new TelegramClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.getHTTPClient());
  return { client, mock };
};

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with Telegram API', () => {
    axios.create = jest.fn();
    TelegramClient.connect(ACCESS_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL:
        'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with Telegram API', () => {
    axios.create = jest.fn();
    new TelegramClient(ACCESS_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL:
        'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new TelegramClient(ACCESS_TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('webhooks', () => {
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
          phoneNumber: '886123456789',
          firstName: 'first',
        },
        { last_name: 'last' }
      );

      expect(res).toEqual(reply);
    });
  });
});
