import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import MessengerBatch from '../MessengerBatch';
import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios'); // eslint-disable-line global-require
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = () => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('send api', () => {
  describe('#sendRawBody', () => {
    it('should call messages api', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      const customAccessToken = '0987654321';

      mock
        .onPost(`/me/messages?access_token=${customAccessToken}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          access_token: customAccessToken,
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        access_token: customAccessToken,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMessage', () => {
    it('should call messages api with default UPDATE type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(USER_ID, {
        text: 'Hello!',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api with MESSAGE_TAG type when tag exists', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'MESSAGE_TAG',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          tag: 'ISSUE_RESOLUTION',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api with RESPONSE type when it provided as messaging_type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'RESPONSE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          messaging_type: 'RESPONSE',
        }
      );

      expect(res).toEqual(reply);
    });

    it('can call messages api using recipient with phone_number', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            phone_number: '+1(212)555-2368',
            name: { first_name: 'John', last_name: 'Doe' },
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
        {
          text: 'Hello!',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should attatch quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Search',
                payload: '<POSTBACK_PAYLOAD>',
                image_url: 'http://example.com/img/red.png',
              },
              {
                content_type: 'location',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quick_replies: [
            {
              content_type: 'text',
              title: 'Search',
              payload: '<POSTBACK_PAYLOAD>',
              image_url: 'http://example.com/img/red.png',
            },
            {
              content_type: 'location',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should not attatch empty array quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quick_replies: [],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should not attatch non-array quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quick_replies: {},
        }
      );

      expect(res).toEqual(reply);
    });

    it('should throw if quick_replies length > 11', async () => {
      const { client } = createMock();

      const lotsOfQuickReplies = new Array(12).fill({
        content_type: 'text',
        title: 'Red',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
      });

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          { quick_replies: lotsOfQuickReplies }
        );
      }).toThrow('quick_replies is an array and limited to 11');
    });

    it('should throw if title length > 20', async () => {
      const { client } = createMock();

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          {
            quick_replies: [
              {
                content_type: 'text',
                title: 'RedRedRedRedRedRedRedRed',
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
              },
            ],
          }
        );
      }).toThrow(
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );
    });

    it('should throw if payload length > 1000', async () => {
      const { client } = createMock();

      const longString = new Array(1001).fill('x').join('');

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          {
            quick_replies: [
              {
                content_type: 'text',
                title: 'Red',
                payload: longString,
              },
            ],
          }
        );
      }).toThrow('payload of quick reply has a 1000 character limit');
    });
  });

  describe('#sendAttachment', () => {
    it('should call messages api with attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAttachment(USER_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call messages api with text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendText(USER_ID, 'Hello!');

      expect(res).toEqual(reply);
    });

    it('should call messages api with issue resolution text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'MESSAGE_TAG',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendText(USER_ID, 'Hello!', {
        tag: 'ISSUE_RESOLUTION',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAudio', () => {
    it('can call api with audio url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                url: 'https://example.com/audio.mp3',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAudio(
        USER_ID,
        'https://example.com/audio.mp3'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with audio attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAudio(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendAudio(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendImage', () => {
    it('can call api with image url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(
        USER_ID,
        'https://example.com/pic.png'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with image attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendImage(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('can call api with video url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: 'https://example.com/video.mp4',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(
        USER_ID,
        'https://example.com/video.mp4'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with video attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'video',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendVideo(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFile', () => {
    it('can call api with file url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'file',
              payload: {
                url: 'https://example.com/word.docx',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendFile(
        USER_ID,
        'https://example.com/word.docx'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with file attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'file',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendFile(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendFile(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendBatch', () => {
    it('call messages api with batch requests', async () => {
      const { client, mock } = createMock();

      const reply = [
        {
          recipient_id: USER_ID,
          message_id: 'mid.1489394984387:3dd22de509',
        },
      ];

      const batch = [MessengerBatch.createText(USER_ID, 'Hello')];

      mock
        .onPost('/', {
          access_token: ACCESS_TOKEN,
          batch: [
            {
              method: 'POST',
              relative_url: 'me/messages',
              body: `messaging_type=UPDATE&recipient=%7B%22id%22%3A%22${USER_ID}%22%7D&message=%7B%22text%22%3A%22Hello%22%7D`,
            },
          ],
        })
        .reply(200, reply);

      const res = await client.sendBatch(batch);

      expect(res).toEqual(reply);
    });

    it('should throw if item length > 50', async () => {
      const { client } = createMock();

      const bigBatch = new Array(51).fill(
        MessengerBatch.createText(USER_ID, 'Hello')
      );

      expect(() => {
        client.sendBatch(bigBatch);
      }).toThrow();
    });
  });

  describe('#sendSenderAction', () => {
    it('should call messages api with sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.sendSenderAction(USER_ID, 'typing_on');

      expect(res).toEqual(reply);
    });

    it('should call messages api with sender action and custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const customAccessToken = '097654321';

      mock
        .onPost(`/me/messages?access_token=${customAccessToken}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
          access_token: customAccessToken,
        })
        .reply(200, reply);

      const res = await client.sendSenderAction(USER_ID, 'typing_on', {
        access_token: customAccessToken,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#markSeen', () => {
    it('should call messages api with mark_seen sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'mark_seen',
        })
        .reply(200, reply);

      const res = await client.markSeen(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with mark_seen sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'mark_seen',
          ...options,
        })
        .reply(200, reply);

      const res = await client.markSeen(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#typingOn', () => {
    it('should call messages api with typing_on sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.typingOn(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with typing_on sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
          ...options,
        })
        .reply(200, reply);

      const res = await client.typingOn(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#typingOff', () => {
    it('should call messages api with typing_off sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_off',
        })
        .reply(200, reply);

      const res = await client.typingOff(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with typing_off sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_off',
          ...options,
        })
        .reply(200, reply);

      const res = await client.typingOff(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });
});
