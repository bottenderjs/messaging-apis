import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import MessengerBatch from '../MessengerBatch';
import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const CUSTOM_ACCESS_TOKEN = '0987654321';

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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendRawBody({
        messagingType: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendRawBody({
        messagingType: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${CUSTOM_ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        access_token: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendMessage', () => {
    it('should call messages api with default UPDATE type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(USER_ID, {
        text: 'Hello!',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with MESSAGE_TAG type when tag exists', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          tag: 'CONFIRMED_EVENT_UPDATE',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'MESSAGE_TAG',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        tag: 'CONFIRMED_EVENT_UPDATE',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with RESPONSE type when it provided as messaging_type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          messagingType: 'RESPONSE',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'RESPONSE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call messages api using recipient with phone_number', async () => {
      const { client, mock } = createMock();

      const reply = {
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
        {
          text: 'Hello!',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call messages api using recipient with user_ref', async () => {
      const { client, mock } = createMock();

      const reply = {
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        {
          userRef: 'ref',
        },
        {
          text: 'Hello!',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          user_ref: 'ref',
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call messages api using recipient with post_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        {
          postId: 'post-id',
        },
        {
          text: 'Hello!',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          post_id: 'post-id',
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call messages api using recipient with comment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        {
          commentId: 'comment-id',
        },
        {
          text: 'Hello!',
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          comment_id: 'comment-id',
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should attach quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quickReplies: [
            {
              contentType: 'text' as any, // FIXME: use enum
              title: 'Search',
              payload: '<POSTBACK_PAYLOAD>',
              imageUrl: 'http://example.com/img/red.png',
            },
          ],
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
          ],
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should not attach empty array quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quickReplies: [],
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should not attach non-array quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quickReplies: {} as any,
        }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendAttachment', () => {
    it('should call messages api with attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendAttachment(USER_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendText', () => {
    it('should call messages api with text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendText(USER_ID, 'Hello!');

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('should call messages api with issue resolution text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendText(USER_ID, 'Hello!', {
        tag: 'CONFIRMED_EVENT_UPDATE',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'MESSAGE_TAG',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        tag: 'CONFIRMED_EVENT_UPDATE',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendAudio', () => {
    it('can call api with audio url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendAudio(
        USER_ID,
        'https://example.com/audio.mp3'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with audio attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendAudio(USER_ID, {
        attachmentId: '5566',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          attachment: {
            type: 'audio',
            payload: {
              attachment_id: '5566',
            },
          },
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendAudio(USER_ID, fs.createReadStream('./'));

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toBeInstanceOf(FormData);

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendImage', () => {
    it('can call api with image url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendImage(
        USER_ID,
        'https://example.com/pic.png'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with image attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendImage(USER_ID, {
        attachmentId: '5566',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          attachment: {
            type: 'image',
            payload: {
              attachment_id: '5566',
            },
          },
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendImage(USER_ID, fs.createReadStream('./'));

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toBeInstanceOf(FormData);

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendVideo', () => {
    it('can call api with video url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendVideo(
        USER_ID,
        'https://example.com/video.mp4'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with video attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendVideo(USER_ID, {
        attachmentId: '5566',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          attachment: {
            type: 'video',
            payload: {
              attachment_id: '5566',
            },
          },
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendVideo(USER_ID, fs.createReadStream('./'));

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toBeInstanceOf(FormData);

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });
  });

  describe('#sendFile', () => {
    it('can call api with file url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendFile(
        USER_ID,
        'https://example.com/word.docx'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
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
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with file attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendFile(USER_ID, {
        attachmentId: '5566',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          attachment: {
            type: 'file',
            payload: {
              attachment_id: '5566',
            },
          },
        },
      });

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      let url;
      let data;
      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendFile(USER_ID, fs.createReadStream('./'));

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toBeInstanceOf(FormData);

      expect(res).toEqual({
        recipientId: USER_ID,
        messageId: 'mid.1489394984387:3dd22de509',
      });
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

      const batch = [MessengerBatch.sendText(USER_ID, 'Hello')];

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendBatch(batch);

      expect(url).toEqual(`https://graph.facebook.com/v4.0/`);
      expect(JSON.parse(data)).toEqual({
        access_token: ACCESS_TOKEN,
        batch: [
          {
            method: 'POST',
            relative_url: 'me/messages',
            body: `messaging_type=UPDATE&recipient=%7B%22id%22%3A%22${USER_ID}%22%7D&message=%7B%22text%22%3A%22Hello%22%7D`,
          },
        ],
      });

      expect(res).toEqual([
        {
          recipientId: USER_ID,
          messageId: 'mid.1489394984387:3dd22de509',
        },
      ]);
    });

    it('should get correct data according to responseAccessPath', async () => {
      const { client, mock } = createMock();

      const reply = [
        { body: '{"data":[{"thread_owner":{"app_id":"501514720355337"}}]}' },
      ];

      const batch = [MessengerBatch.getThreadOwner(USER_ID)];

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendBatch(batch);

      expect(url).toEqual(`https://graph.facebook.com/v4.0/`);
      expect(JSON.parse(data)).toEqual({
        access_token: ACCESS_TOKEN,
        batch: [
          {
            method: 'GET',
            relative_url: `me/thread_owner?recipient=${USER_ID}`,
          },
        ],
      });

      expect(res).toEqual([{ body: '{"appId":"501514720355337"}' }]);
    });

    it('should throw if item length > 50', async () => {
      const { client } = createMock();

      const bigBatch = new Array(51).fill(
        MessengerBatch.sendText(USER_ID, 'Hello')
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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendSenderAction(USER_ID, 'typing_on');

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_on',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });

    it('should call messages api with sender action and custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.sendSenderAction(USER_ID, 'typing_on', {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${CUSTOM_ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_on',
        access_token: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });
  });

  describe('#markSeen', () => {
    it('should call messages api with mark_seen sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.markSeen(USER_ID);

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'mark_seen',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });

    it('should call messages api with mark_seen sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.markSeen(USER_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${CUSTOM_ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'mark_seen',
        access_token: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });
  });

  describe('#typingOn', () => {
    it('should call messages api with typing_on sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.typingOn(USER_ID);

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_on',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });

    it('should call messages api with typing_on sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.typingOn(USER_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${CUSTOM_ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_on',
        access_token: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });
  });

  describe('#typingOff', () => {
    it('should call messages api with typing_off sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.typingOff(USER_ID);

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_off',
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });

    it('should call messages api with typing_off sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.typingOff(USER_ID, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/messages?access_token=${CUSTOM_ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        sender_action: 'typing_off',
        access_token: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual({
        recipientId: USER_ID,
      });
    });
  });
});
