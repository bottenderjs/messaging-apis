import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
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

describe('Reply Message', () => {
  describe('#replyRawBody', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.replyRawBody({
        replyToken: REPLY_TOKEN,
        messages: [
          {
            type: 'text',
            text: 'Hello!',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#reply', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.reply(REPLY_TOKEN, [
        {
          type: 'text',
          text: 'Hello!',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#replyText', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.replyText(REPLY_TOKEN, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#replyImage', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyImage(
        REPLY_TOKEN,
        'https://example.com/original.jpg',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });

    it('should use contentUrl as fallback', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/original.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyImage(
        REPLY_TOKEN,
        'https://example.com/original.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyVideo', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'video',
              originalContentUrl: 'https://example.com/original.mp4',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyVideo(
        REPLY_TOKEN,
        'https://example.com/original.mp4',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyAudio', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'audio',
              originalContentUrl: 'https://example.com/original.m4a',
              duration: 240000,
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyAudio(
        REPLY_TOKEN,
        'https://example.com/original.m4a',
        240000
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyLocation', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'location',
              title: 'my location',
              address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
              latitude: 35.65910807942215,
              longitude: 139.70372892916203,
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyLocation(REPLY_TOKEN, {
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#replySticker', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'sticker',
              packageId: '1',
              stickerId: '1',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replySticker(REPLY_TOKEN, '1', '1');

      expect(res).toEqual(reply);
    });
  });

  describe('#replyImagemap', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'imagemap',
              baseUrl: 'https://example.com/bot/images/rm001',
              altText: 'this is an imagemap',
              baseSize: {
                height: 1040,
                width: 1040,
              },
              actions: [
                {
                  type: 'uri',
                  linkUri: 'https://example.com/',
                  area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
                {
                  type: 'message',
                  text: 'hello',
                  area: {
                    x: 520,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
              ],
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyImagemap(
        REPLY_TOKEN,
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseHeight: 1040,
          baseWidth: 1040,
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should support baseSize argument', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'imagemap',
              baseUrl: 'https://example.com/bot/images/rm001',
              altText: 'this is an imagemap',
              baseSize: {
                height: 1040,
                width: 1040,
              },
              actions: [
                {
                  type: 'uri',
                  linkUri: 'https://example.com/',
                  area: {
                    x: 0,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
                {
                  type: 'message',
                  text: 'hello',
                  area: {
                    x: 520,
                    y: 0,
                    width: 520,
                    height: 1040,
                  },
                },
              ],
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyImagemap(
        REPLY_TOKEN,
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            height: 1040,
            width: 1040,
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyTemplate', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is a template',
              template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                title: 'Menu',
                text: 'Please select',
                actions: [
                  {
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=123',
                  },
                  {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=123',
                  },
                  {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/123',
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyTemplate(
        REPLY_TOKEN,
        'this is a template',
        {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=123',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyButtonTemplate', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is a template',
              template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
                imageBackgroundColor: '#FFFFFF',
                title: 'Menu',
                text: 'Please select',
                actions: [
                  {
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=123',
                  },
                  {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=123',
                  },
                  {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/123',
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyButtonTemplate(
        REPLY_TOKEN,
        'this is a template',
        {
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
          title: 'Menu',
          text: 'Please select',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=123',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyConfirmTemplate', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is a confirm template',
              template: {
                type: 'confirm',
                text: 'Are you sure?',
                actions: [
                  {
                    type: 'message',
                    label: 'Yes',
                    text: 'yes',
                  },
                  {
                    type: 'message',
                    label: 'No',
                    text: 'no',
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyConfirmTemplate(
        REPLY_TOKEN,
        'this is a confirm template',
        {
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyCarouselTemplate', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is a carousel template',
              template: {
                type: 'carousel',
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
                columns: [
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item1.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=111',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=111',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/111',
                      },
                    ],
                  },
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item2.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=222',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=222',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/222',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyCarouselTemplate(
        REPLY_TOKEN,
        'this is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ],
        {
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should work without option', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is a carousel template',
              template: {
                type: 'carousel',
                columns: [
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item1.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=111',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=111',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/111',
                      },
                    ],
                  },
                  {
                    thumbnailImageUrl:
                      'https://example.com/bot/images/item2.jpg',
                    title: 'this is menu',
                    text: 'description',
                    actions: [
                      {
                        type: 'postback',
                        label: 'Buy',
                        data: 'action=buy&itemid=222',
                      },
                      {
                        type: 'postback',
                        label: 'Add to cart',
                        data: 'action=add&itemid=222',
                      },
                      {
                        type: 'uri',
                        label: 'View detail',
                        uri: 'http://example.com/page/222',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyCarouselTemplate(
        REPLY_TOKEN,
        'this is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#replyImageCarouselTemplate', () => {
    it('should call reply api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/reply', {
          replyToken: REPLY_TOKEN,
          messages: [
            {
              type: 'template',
              altText: 'this is an image carousel template',
              template: {
                type: 'image_carousel',
                columns: [
                  {
                    imageUrl: 'https://example.com/bot/images/item1.jpg',
                    action: {
                      type: 'postback',
                      label: 'Buy',
                      data: 'action=buy&itemid=111',
                    },
                  },
                  {
                    imageUrl: 'https://example.com/bot/images/item2.jpg',
                    action: {
                      type: 'message',
                      label: 'Yes',
                      text: 'yes',
                    },
                  },
                  {
                    imageUrl: 'https://example.com/bot/images/item3.jpg',
                    action: {
                      type: 'uri',
                      label: 'View detail',
                      uri: 'http://example.com/page/222',
                    },
                  },
                ],
              },
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.replyImageCarouselTemplate(
        REPLY_TOKEN,
        'this is an image carousel template',
        [
          {
            imageUrl: 'https://example.com/bot/images/item1.jpg',
            action: {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item2.jpg',
            action: {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item3.jpg',
            action: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });
});
