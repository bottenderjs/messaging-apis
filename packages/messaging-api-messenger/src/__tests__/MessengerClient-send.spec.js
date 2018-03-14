import fs from 'fs';

import MockAdapter from 'axios-mock-adapter';
import FormData from 'form-data';

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

  describe('#sendTemplate', () => {
    it('should call messages api with template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendTemplate(USER_ID, {
        template_type: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendButtonTemplate', () => {
    it('should call messages api with button template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendButtonTemplate(USER_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  const templateElements = [
    {
      title: "Welcome to Peter's Hats",
      image_url: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "We've got the right hat for everyone.",
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      ],
    },
  ];
  const templateMessage = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: templateElements,
        image_aspect_ratio: 'horizontal',
      },
    },
  };

  describe('#sendGenericTemplate', () => {
    it('should call messages api with generic template', async () => {
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
          message: templateMessage,
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements);

      expect(res).toEqual(reply);
    });

    it('can use square generic template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: templateElements,
                image_aspect_ratio: 'square',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements, {
        image_aspect_ratio: 'square',
      });

      expect(res).toEqual(reply);
    });

    it('can use generic template with tag', async () => {
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
          message: templateMessage,
          tag: 'SHIPPING_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements, {
        tag: 'SHIPPING_UPDATE',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendListTemplate', () => {
    it('should call messages api with list template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'list',
                elements: [
                  {
                    title: 'Classic T-Shirt Collection',
                    image_url:
                      'https://peterssendreceiveapp.ngrok.io/img/collection.png',
                    subtitle: 'See all our colors',
                    default_action: {
                      type: 'web_url',
                      url:
                        'https://peterssendreceiveapp.ngrok.io/shop_collection',
                      messenger_extensions: true,
                      webview_height_ratio: 'tall',
                      fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                    },
                    buttons: [
                      {
                        title: 'View',
                        type: 'web_url',
                        url: 'https://peterssendreceiveapp.ngrok.io/collection',
                        messenger_extensions: true,
                        webview_height_ratio: 'tall',
                        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                      },
                    ],
                  },
                ],
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
                top_element_style: 'compact',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendListTemplate(
        USER_ID,
        [
          {
            title: 'Classic T-Shirt Collection',
            image_url:
              'https://peterssendreceiveapp.ngrok.io/img/collection.png',
            subtitle: 'See all our colors',
            default_action: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
              messenger_extensions: true,
              webview_height_ratio: 'tall',
              fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                title: 'View',
                type: 'web_url',
                url: 'https://peterssendreceiveapp.ngrok.io/collection',
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
              },
            ],
          },
        ],
        [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
        { top_element_style: 'compact' }
      );

      expect(res).toEqual(reply);
    });

    it('should use top_element_style default value', async () => {
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
              type: 'template',
              payload: {
                template_type: 'list',
                elements: [
                  {
                    title: 'Classic T-Shirt Collection',
                    image_url:
                      'https://peterssendreceiveapp.ngrok.io/img/collection.png',
                    subtitle: 'See all our colors',
                    default_action: {
                      type: 'web_url',
                      url:
                        'https://peterssendreceiveapp.ngrok.io/shop_collection',
                      messenger_extensions: true,
                      webview_height_ratio: 'tall',
                      fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                    },
                    buttons: [
                      {
                        title: 'View',
                        type: 'web_url',
                        url: 'https://peterssendreceiveapp.ngrok.io/collection',
                        messenger_extensions: true,
                        webview_height_ratio: 'tall',
                        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                      },
                    ],
                  },
                ],
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
                top_element_style: 'large',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendListTemplate(
        USER_ID,
        [
          {
            title: 'Classic T-Shirt Collection',
            image_url:
              'https://peterssendreceiveapp.ngrok.io/img/collection.png',
            subtitle: 'See all our colors',
            default_action: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
              messenger_extensions: true,
              webview_height_ratio: 'tall',
              fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                title: 'View',
                type: 'web_url',
                url: 'https://peterssendreceiveapp.ngrok.io/collection',
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
              },
            ],
          },
        ],
        [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendOpenGraphTemplate', () => {
    it('should call messages api with open graph template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'open_graph',
                elements: [
                  {
                    url:
                      'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
                    buttons: [
                      {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Rickrolling',
                        title: 'View More',
                      },
                    ],
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendOpenGraphTemplate(USER_ID, [
        {
          url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
          buttons: [
            {
              type: 'web_url',
              url: 'https://en.wikipedia.org/wiki/Rickrolling',
              title: 'View More',
            },
          ],
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMediaTemplate', () => {
    it('should call messages api with media template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.$cAAJsujCd2ORj_1qmrFdzhVa-4cvO',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'media',
                elements: [
                  {
                    media_type: 'image',
                    attachment_id: '1854626884821032',
                    buttons: [
                      {
                        type: 'web_url',
                        url: '<WEB_URL>',
                        title: 'View Website',
                      },
                    ],
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendMediaTemplate(USER_ID, [
        {
          media_type: 'image',
          attachment_id: '1854626884821032',
          buttons: [
            {
              type: 'web_url',
              url: '<WEB_URL>',
              title: 'View Website',
            },
          ],
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendReceiptTemplate', () => {
    it('should call messages api with receipt template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'receipt',
                recipient_name: 'Stephane Crozatier',
                order_number: '12345678902',
                currency: 'USD',
                payment_method: 'Visa 2345',
                order_url:
                  'http://petersapparel.parseapp.com/order?order_id=123456',
                timestamp: '1428444852',
                elements: [
                  {
                    title: 'Classic White T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 2,
                    price: 50,
                    currency: 'USD',
                    image_url:
                      'http://petersapparel.parseapp.com/img/whiteshirt.png',
                  },
                  {
                    title: 'Classic Gray T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 1,
                    price: 25,
                    currency: 'USD',
                    image_url:
                      'http://petersapparel.parseapp.com/img/grayshirt.png',
                  },
                ],
                address: {
                  street_1: '1 Hacker Way',
                  street_2: '',
                  city: 'Menlo Park',
                  postal_code: '94025',
                  state: 'CA',
                  country: 'US',
                },
                summary: {
                  subtotal: 75.0,
                  shipping_cost: 4.95,
                  total_tax: 6.19,
                  total_cost: 56.14,
                },
                adjustments: [
                  {
                    name: 'New Customer Discount',
                    amount: 20,
                  },
                  {
                    name: '$10 Off Coupon',
                    amount: 10,
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendReceiptTemplate(USER_ID, {
        recipient_name: 'Stephane Crozatier',
        order_number: '12345678902',
        currency: 'USD',
        payment_method: 'Visa 2345',
        order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
        timestamp: '1428444852',
        elements: [
          {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
          },
          {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png',
          },
        ],
        address: {
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'Menlo Park',
          postal_code: '94025',
          state: 'CA',
          country: 'US',
        },
        summary: {
          subtotal: 75.0,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14,
        },
        adjustments: [
          {
            name: 'New Customer Discount',
            amount: 20,
          },
          {
            name: '$10 Off Coupon',
            amount: 10,
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineBoardingPassTemplate', () => {
    it('should call messages api with airline boardingpass template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'airline_boardingpass',
                intro_message: 'You are checked in.',
                locale: 'en_US',
                boarding_pass: [
                  {
                    passenger_name: 'SMITH/NICOLAS',
                    pnr_number: 'CG4X7U',
                    travel_class: 'business',
                    seat: '74J',
                    auxiliary_fields: [
                      {
                        label: 'Terminal',
                        value: 'T1',
                      },
                      {
                        label: 'Departure',
                        value: '30OCT 19:05',
                      },
                    ],
                    secondary_fields: [
                      {
                        label: 'Boarding',
                        value: '18:30',
                      },
                      {
                        label: 'Gate',
                        value: 'D57',
                      },
                      {
                        label: 'Seat',
                        value: '74J',
                      },
                      {
                        label: 'Sec.Nr.',
                        value: '003',
                      },
                    ],
                    logo_image_url: 'https://www.example.com/en/logo.png',
                    header_image_url:
                      'https://www.example.com/en/fb/header.png',
                    qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
                    above_bar_code_image_url:
                      'https://www.example.com/en/PLAT.png',
                    flight_info: {
                      flight_number: 'KL0642',
                      departure_airport: {
                        airport_code: 'JFK',
                        city: 'New York',
                        terminal: 'T1',
                        gate: 'D57',
                      },
                      arrival_airport: {
                        airport_code: 'AMS',
                        city: 'Amsterdam',
                      },
                      flight_schedule: {
                        departure_time: '2016-01-02T19:05',
                        arrival_time: '2016-01-05T17:30',
                      },
                    },
                  },
                  {
                    passenger_name: 'JONES/FARBOUND',
                    pnr_number: 'CG4X7U',
                    travel_class: 'business',
                    seat: '74K',
                    auxiliary_fields: [
                      {
                        label: 'Terminal',
                        value: 'T1',
                      },
                      {
                        label: 'Departure',
                        value: '30OCT 19:05',
                      },
                    ],
                    secondary_fields: [
                      {
                        label: 'Boarding',
                        value: '18:30',
                      },
                      {
                        label: 'Gate',
                        value: 'D57',
                      },
                      {
                        label: 'Seat',
                        value: '74K',
                      },
                      {
                        label: 'Sec.Nr.',
                        value: '004',
                      },
                    ],
                    logo_image_url: 'https://www.example.com/en/logo.png',
                    header_image_url:
                      'https://www.example.com/en/fb/header.png',
                    qr_code:
                      'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
                    above_bar_code_image_url:
                      'https://www.example.com/en/PLAT.png',
                    flight_info: {
                      flight_number: 'KL0642',
                      departure_airport: {
                        airport_code: 'JFK',
                        city: 'New York',
                        terminal: 'T1',
                        gate: 'D57',
                      },
                      arrival_airport: {
                        airport_code: 'AMS',
                        city: 'Amsterdam',
                      },
                      flight_schedule: {
                        departure_time: '2016-01-02T19:05',
                        arrival_time: '2016-01-05T17:30',
                      },
                    },
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineBoardingPassTemplate(USER_ID, {
        intro_message: 'You are checked in.',
        locale: 'en_US',
        boarding_pass: [
          {
            passenger_name: 'SMITH/NICOLAS',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74J',
            auxiliary_fields: [
              {
                label: 'Terminal',
                value: 'T1',
              },
              {
                label: 'Departure',
                value: '30OCT 19:05',
              },
            ],
            secondary_fields: [
              {
                label: 'Boarding',
                value: '18:30',
              },
              {
                label: 'Gate',
                value: 'D57',
              },
              {
                label: 'Seat',
                value: '74J',
              },
              {
                label: 'Sec.Nr.',
                value: '003',
              },
            ],
            logo_image_url: 'https://www.example.com/en/logo.png',
            header_image_url: 'https://www.example.com/en/fb/header.png',
            qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
            flight_info: {
              flight_number: 'KL0642',
              departure_airport: {
                airport_code: 'JFK',
                city: 'New York',
                terminal: 'T1',
                gate: 'D57',
              },
              arrival_airport: {
                airport_code: 'AMS',
                city: 'Amsterdam',
              },
              flight_schedule: {
                departure_time: '2016-01-02T19:05',
                arrival_time: '2016-01-05T17:30',
              },
            },
          },
          {
            passenger_name: 'JONES/FARBOUND',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74K',
            auxiliary_fields: [
              {
                label: 'Terminal',
                value: 'T1',
              },
              {
                label: 'Departure',
                value: '30OCT 19:05',
              },
            ],
            secondary_fields: [
              {
                label: 'Boarding',
                value: '18:30',
              },
              {
                label: 'Gate',
                value: 'D57',
              },
              {
                label: 'Seat',
                value: '74K',
              },
              {
                label: 'Sec.Nr.',
                value: '004',
              },
            ],
            logo_image_url: 'https://www.example.com/en/logo.png',
            header_image_url: 'https://www.example.com/en/fb/header.png',
            qr_code: 'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
            flight_info: {
              flight_number: 'KL0642',
              departure_airport: {
                airport_code: 'JFK',
                city: 'New York',
                terminal: 'T1',
                gate: 'D57',
              },
              arrival_airport: {
                airport_code: 'AMS',
                city: 'Amsterdam',
              },
              flight_schedule: {
                departure_time: '2016-01-02T19:05',
                arrival_time: '2016-01-05T17:30',
              },
            },
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineCheckinTemplate', () => {
    it('should call messages api with airline checkin template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'airline_checkin',
                intro_message: 'Check-in is available now.',
                locale: 'en_US',
                pnr_number: 'ABCDEF',
                flight_info: [
                  {
                    flight_number: 'f001',
                    departure_airport: {
                      airport_code: 'SFO',
                      city: 'San Francisco',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    arrival_airport: {
                      airport_code: 'SEA',
                      city: 'Seattle',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    flight_schedule: {
                      boarding_time: '2016-01-05T15:05',
                      departure_time: '2016-01-05T15:45',
                      arrival_time: '2016-01-05T17:30',
                    },
                  },
                ],
                checkin_url: 'https://www.airline.com/check-in',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineCheckinTemplate(USER_ID, {
        intro_message: 'Check-in is available now.',
        locale: 'en_US',
        pnr_number: 'ABCDEF',
        flight_info: [
          {
            flight_number: 'f001',
            departure_airport: {
              airport_code: 'SFO',
              city: 'San Francisco',
              terminal: 'T4',
              gate: 'G8',
            },
            arrival_airport: {
              airport_code: 'SEA',
              city: 'Seattle',
              terminal: 'T4',
              gate: 'G8',
            },
            flight_schedule: {
              boarding_time: '2016-01-05T15:05',
              departure_time: '2016-01-05T15:45',
              arrival_time: '2016-01-05T17:30',
            },
          },
        ],
        checkin_url: 'https://www.airline.com/check-in',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineItineraryTemplate', () => {
    it('should call messages api with airline itinerary template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'airline_itinerary',
                intro_message: "Here's your flight itinerary.",
                locale: 'en_US',
                pnr_number: 'ABCDEF',
                passenger_info: [
                  {
                    name: 'Farbound Smith Jr',
                    ticket_number: '0741234567890',
                    passenger_id: 'p001',
                  },
                  {
                    name: 'Nick Jones',
                    ticket_number: '0741234567891',
                    passenger_id: 'p002',
                  },
                ],
                flight_info: [
                  {
                    connection_id: 'c001',
                    segment_id: 's001',
                    flight_number: 'KL9123',
                    aircraft_type: 'Boeing 737',
                    departure_airport: {
                      airport_code: 'SFO',
                      city: 'San Francisco',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    arrival_airport: {
                      airport_code: 'SLC',
                      city: 'Salt Lake City',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    flight_schedule: {
                      departure_time: '2016-01-02T19:45',
                      arrival_time: '2016-01-02T21:20',
                    },
                    travel_class: 'business',
                  },
                  {
                    connection_id: 'c002',
                    segment_id: 's002',
                    flight_number: 'KL321',
                    aircraft_type: 'Boeing 747-200',
                    travel_class: 'business',
                    departure_airport: {
                      airport_code: 'SLC',
                      city: 'Salt Lake City',
                      terminal: 'T1',
                      gate: 'G33',
                    },
                    arrival_airport: {
                      airport_code: 'AMS',
                      city: 'Amsterdam',
                      terminal: 'T1',
                      gate: 'G33',
                    },
                    flight_schedule: {
                      departure_time: '2016-01-02T22:45',
                      arrival_time: '2016-01-03T17:20',
                    },
                  },
                ],
                passenger_segment_info: [
                  {
                    segment_id: 's001',
                    passenger_id: 'p001',
                    seat: '12A',
                    seat_type: 'Business',
                  },
                  {
                    segment_id: 's001',
                    passenger_id: 'p002',
                    seat: '12B',
                    seat_type: 'Business',
                  },
                  {
                    segment_id: 's002',
                    passenger_id: 'p001',
                    seat: '73A',
                    seat_type: 'World Business',
                    product_info: [
                      {
                        title: 'Lounge',
                        value: 'Complimentary lounge access',
                      },
                      {
                        title: 'Baggage',
                        value: '1 extra bag 50lbs',
                      },
                    ],
                  },
                  {
                    segment_id: 's002',
                    passenger_id: 'p002',
                    seat: '73B',
                    seat_type: 'World Business',
                    product_info: [
                      {
                        title: 'Lounge',
                        value: 'Complimentary lounge access',
                      },
                      {
                        title: 'Baggage',
                        value: '1 extra bag 50lbs',
                      },
                    ],
                  },
                ],
                price_info: [
                  {
                    title: 'Fuel surcharge',
                    amount: '1597',
                    currency: 'USD',
                  },
                ],
                base_price: '12206',
                tax: '200',
                total_price: '14003',
                currency: 'USD',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineItineraryTemplate(USER_ID, {
        intro_message: "Here's your flight itinerary.",
        locale: 'en_US',
        pnr_number: 'ABCDEF',
        passenger_info: [
          {
            name: 'Farbound Smith Jr',
            ticket_number: '0741234567890',
            passenger_id: 'p001',
          },
          {
            name: 'Nick Jones',
            ticket_number: '0741234567891',
            passenger_id: 'p002',
          },
        ],
        flight_info: [
          {
            connection_id: 'c001',
            segment_id: 's001',
            flight_number: 'KL9123',
            aircraft_type: 'Boeing 737',
            departure_airport: {
              airport_code: 'SFO',
              city: 'San Francisco',
              terminal: 'T4',
              gate: 'G8',
            },
            arrival_airport: {
              airport_code: 'SLC',
              city: 'Salt Lake City',
              terminal: 'T4',
              gate: 'G8',
            },
            flight_schedule: {
              departure_time: '2016-01-02T19:45',
              arrival_time: '2016-01-02T21:20',
            },
            travel_class: 'business',
          },
          {
            connection_id: 'c002',
            segment_id: 's002',
            flight_number: 'KL321',
            aircraft_type: 'Boeing 747-200',
            travel_class: 'business',
            departure_airport: {
              airport_code: 'SLC',
              city: 'Salt Lake City',
              terminal: 'T1',
              gate: 'G33',
            },
            arrival_airport: {
              airport_code: 'AMS',
              city: 'Amsterdam',
              terminal: 'T1',
              gate: 'G33',
            },
            flight_schedule: {
              departure_time: '2016-01-02T22:45',
              arrival_time: '2016-01-03T17:20',
            },
          },
        ],
        passenger_segment_info: [
          {
            segment_id: 's001',
            passenger_id: 'p001',
            seat: '12A',
            seat_type: 'Business',
          },
          {
            segment_id: 's001',
            passenger_id: 'p002',
            seat: '12B',
            seat_type: 'Business',
          },
          {
            segment_id: 's002',
            passenger_id: 'p001',
            seat: '73A',
            seat_type: 'World Business',
            product_info: [
              {
                title: 'Lounge',
                value: 'Complimentary lounge access',
              },
              {
                title: 'Baggage',
                value: '1 extra bag 50lbs',
              },
            ],
          },
          {
            segment_id: 's002',
            passenger_id: 'p002',
            seat: '73B',
            seat_type: 'World Business',
            product_info: [
              {
                title: 'Lounge',
                value: 'Complimentary lounge access',
              },
              {
                title: 'Baggage',
                value: '1 extra bag 50lbs',
              },
            ],
          },
        ],
        price_info: [
          {
            title: 'Fuel surcharge',
            amount: '1597',
            currency: 'USD',
          },
        ],
        base_price: '12206',
        tax: '200',
        total_price: '14003',
        currency: 'USD',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineFlightUpdateTemplate', () => {
    it('should call messages api with airline flight update template', async () => {
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
              type: 'template',
              payload: {
                template_type: 'airline_update',
                intro_message: 'Your flight is delayed',
                update_type: 'delay',
                locale: 'en_US',
                pnr_number: 'CF23G2',
                update_flight_info: {
                  flight_number: 'KL123',
                  departure_airport: {
                    airport_code: 'SFO',
                    city: 'San Francisco',
                    terminal: 'T4',
                    gate: 'G8',
                  },
                  arrival_airport: {
                    airport_code: 'AMS',
                    city: 'Amsterdam',
                    terminal: 'T4',
                    gate: 'G8',
                  },
                  flight_schedule: {
                    boarding_time: '2015-12-26T10:30',
                    departure_time: '2015-12-26T11:30',
                    arrival_time: '2015-12-27T07:30',
                  },
                },
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineFlightUpdateTemplate(USER_ID, {
        intro_message: 'Your flight is delayed',
        update_type: 'delay',
        locale: 'en_US',
        pnr_number: 'CF23G2',
        update_flight_info: {
          flight_number: 'KL123',
          departure_airport: {
            airport_code: 'SFO',
            city: 'San Francisco',
            terminal: 'T4',
            gate: 'G8',
          },
          arrival_airport: {
            airport_code: 'AMS',
            city: 'Amsterdam',
            terminal: 'T4',
            gate: 'G8',
          },
          flight_schedule: {
            boarding_time: '2015-12-26T10:30',
            departure_time: '2015-12-26T11:30',
            arrival_time: '2015-12-27T07:30',
          },
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendQuickReplies', () => {
    it('should call messages api with quick replies', async () => {
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
            text: 'Pick a color:',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Red',
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendQuickReplies(
        USER_ID,
        { text: 'Pick a color:' },
        [
          {
            content_type: 'text',
            title: 'Red',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ]
      );

      expect(res).toEqual(reply);
    });

    it('should accept location type', async () => {
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
            text: 'Pick a color:',
            quick_replies: [
              {
                content_type: 'location',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendQuickReplies(
        USER_ID,
        { text: 'Pick a color:' },
        [
          {
            content_type: 'location',
          },
        ]
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
        client.sendQuickReplies(
          USER_ID,
          { text: 'Pick a color:' },
          lotsOfQuickReplies
        );
      }).toThrow('quick_replies is an array and limited to 11');
    });

    it('should throw if title length > 20', async () => {
      const { client } = createMock();

      expect(() => {
        client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'RedRedRedRedRedRedRedRed',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ]);
      }).toThrow(
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );
    });

    it('should throw if payload length > 1000', async () => {
      const { client } = createMock();

      const longString = new Array(1001).fill('x').join('');

      expect(() => {
        client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'Red',
            payload: longString,
          },
        ]);
      }).toThrow('payload of quick reply has a 1000 character limit');
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
