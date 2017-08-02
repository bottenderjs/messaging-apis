import MockAdapter from 'axios-mock-adapter';

import LINEClient from '../LINEClient';

const RECIPIENT_ID = '1QAZ2WSX';
const GROUP_ID = 'G1QAZ2WSX';
const ROOM_ID = 'R1QAZ2WSX';
const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

const createMock = () => {
  const client = new LINEClient(ACCESS_TOKEN, CHANNEL_SECRET);
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

  it('create axios with LINE API', () => {
    axios.create = jest.fn();
    LINEClient.connect(ACCESS_TOKEN, CHANNEL_SECRET);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.line.me/v2/bot/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
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

  it('create axios with LINE API', () => {
    axios.create = jest.fn();
    new LINEClient(ACCESS_TOKEN, CHANNEL_SECRET); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.line.me/v2/bot/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new LINEClient(ACCESS_TOKEN, CHANNEL_SECRET);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

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
});

describe('Push Message', () => {
  describe('#pushRawBody', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.pushRawBody({
        to: RECIPIENT_ID,
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

  describe('#push', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.push(RECIPIENT_ID, [
        {
          type: 'text',
          text: 'Hello!',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#pushText', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.pushText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#pushImage', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.pushImage(
        RECIPIENT_ID,
        'https://example.com/original.jpg',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });

    it('should use contentUrl as fallback', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/original.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.pushImage(
        RECIPIENT_ID,
        'https://example.com/original.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#pushVideo', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'video',
              originalContentUrl: 'https://example.com/original.mp4',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.pushVideo(
        RECIPIENT_ID,
        'https://example.com/original.mp4',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#pushAudio', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'audio',
              originalContentUrl: 'https://example.com/original.m4a',
              duration: 240000,
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.pushAudio(
        RECIPIENT_ID,
        'https://example.com/original.m4a',
        240000
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#pushLocation', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushLocation(RECIPIENT_ID, {
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#pushSticker', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
          messages: [
            {
              type: 'sticker',
              packageId: '1',
              stickerId: '1',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.pushSticker(RECIPIENT_ID, '1', '1');

      expect(res).toEqual(reply);
    });
  });

  describe('#pushImagemap', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushImagemap(
        RECIPIENT_ID,
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
  });

  describe('#pushTemplate', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushTemplate(
        RECIPIENT_ID,
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

  describe('#pushButtonTemplate', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushButtonTemplate(
        RECIPIENT_ID,
        'this is a template',
        {
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

  describe('#pushConfirmTemplate', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushConfirmTemplate(
        RECIPIENT_ID,
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

  describe('#pushCarouselTemplate', () => {
    it('should call push api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/push', {
          to: RECIPIENT_ID,
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

      const res = await client.pushCarouselTemplate(
        RECIPIENT_ID,
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
});

describe('Multicast', () => {
  describe('#multicastRawBody', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.multicastRawBody({
        to: [RECIPIENT_ID],
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

  describe('#multicast', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.multicast(
        [RECIPIENT_ID],
        [
          {
            type: 'text',
            text: 'Hello!',
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastText', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [{ type: 'text', text: 'Hello!' }],
        })
        .reply(200, reply, headers);

      const res = await client.multicastText([RECIPIENT_ID], 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastImage', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.multicastImage(
        [RECIPIENT_ID],
        'https://example.com/original.jpg',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });

    it('should use contentUrl as fallback', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'image',
              originalContentUrl: 'https://example.com/original.jpg',
              previewImageUrl: 'https://example.com/original.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.multicastImage(
        [RECIPIENT_ID],
        'https://example.com/original.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastVideo', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'video',
              originalContentUrl: 'https://example.com/original.mp4',
              previewImageUrl: 'https://example.com/preview.jpg',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.multicastVideo(
        [RECIPIENT_ID],
        'https://example.com/original.mp4',
        'https://example.com/preview.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastAudio', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'audio',
              originalContentUrl: 'https://example.com/original.m4a',
              duration: 240000,
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.multicastAudio(
        [RECIPIENT_ID],
        'https://example.com/original.m4a',
        240000
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastLocation', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastLocation([RECIPIENT_ID], {
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastSticker', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
          messages: [
            {
              type: 'sticker',
              packageId: '1',
              stickerId: '1',
            },
          ],
        })
        .reply(200, reply, headers);

      const res = await client.multicastSticker([RECIPIENT_ID], '1', '1');

      expect(res).toEqual(reply);
    });
  });

  describe('#multicastImagemap', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastImagemap(
        [RECIPIENT_ID],
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
  });

  describe('#multicastTemplate', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastTemplate(
        [RECIPIENT_ID],
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

  describe('#multicastButtonTemplate', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastButtonTemplate(
        [RECIPIENT_ID],
        'this is a template',
        {
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

  describe('#multicastConfirmTemplate', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastConfirmTemplate(
        [RECIPIENT_ID],
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

  describe('#multicastCarouselTemplate', () => {
    it('should call multicast api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost('/message/multicast', {
          to: [RECIPIENT_ID],
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

      const res = await client.multicastCarouselTemplate(
        [RECIPIENT_ID],
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
});

describe('Content', () => {
  describe('#retrieveMessageContent', () => {
    it('should call retrieveMessageContent api', async () => {
      const { client, mock } = createMock();

      const reply = Buffer.from('a content buffer');

      const MESSAGE_ID = '1234567890';

      mock.onGet(`message/${MESSAGE_ID}/content`).reply(200, reply);

      const res = await client.retrieveMessageContent(MESSAGE_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Profile', () => {
  describe('#getUserProfile', () => {
    it('should response user profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
        statusMessage: 'Hello, LINE!',
      };

      mock.onGet(`/profile/${RECIPIENT_ID}`).reply(200, reply, headers);

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Group/Room Member', () => {
  describe('#getGroupMemberProfile', () => {
    it('should response group member profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock
        .onGet(`/group/${GROUP_ID}/member/${RECIPIENT_ID}`)
        .reply(200, reply, headers);

      const res = await client.getGroupMemberProfile(GROUP_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#getRoomMemberProfile', () => {
    it('should response room member profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
      };

      mock
        .onGet(`/room/${ROOM_ID}/member/${RECIPIENT_ID}`)
        .reply(200, reply, headers);

      const res = await client.getRoomMemberProfile(ROOM_ID, RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#getGroupMemberIds', () => {
    it('should response group member ids', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet(`/group/${GROUP_ID}/member/ids`).reply(200, reply, headers);

      const res = await client.getGroupMemberIds(GROUP_ID);

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock
        .onGet(`/group/${GROUP_ID}/member/ids?start=${continuationToken}`)
        .reply(200, reply, headers);

      const res = await client.getGroupMemberIds(GROUP_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllGroupMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      const { client, mock } = createMock();
      const continuationToken = 'TOKEN';
      const reply1 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..1',
          'Uxxxxxxxxxxxxxx..2',
          'Uxxxxxxxxxxxxxx..3',
        ],
        next: continuationToken,
      };
      const reply2 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..4',
          'Uxxxxxxxxxxxxxx..5',
          'Uxxxxxxxxxxxxxx..6',
        ],
      };

      mock
        .onGet(`/group/${GROUP_ID}/member/ids`)
        .replyOnce(200, reply1, headers)
        .onGet(`/group/${GROUP_ID}/member/ids?start=${continuationToken}`)
        .replyOnce(200, reply2, headers);

      const res = await client.getAllGroupMemberIds(GROUP_ID);

      expect(res).toEqual([
        'Uxxxxxxxxxxxxxx..1',
        'Uxxxxxxxxxxxxxx..2',
        'Uxxxxxxxxxxxxxx..3',
        'Uxxxxxxxxxxxxxx..4',
        'Uxxxxxxxxxxxxxx..5',
        'Uxxxxxxxxxxxxxx..6',
      ]);
    });
  });

  describe('#getRoomMemberIds', () => {
    it('should response room member ids', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      mock.onGet(`/room/${ROOM_ID}/member/ids`).reply(200, reply, headers);

      const res = await client.getRoomMemberIds(ROOM_ID);

      expect(res).toEqual(reply);
    });

    it('should call api with provided continuationToken', async () => {
      const { client, mock } = createMock();
      const reply = {
        memberIds: [
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
          'Uxxxxxxxxxxxxxx...',
        ],
      };

      const continuationToken = 'TOKEN';

      mock
        .onGet(`/room/${ROOM_ID}/member/ids?start=${continuationToken}`)
        .reply(200, reply, headers);

      const res = await client.getRoomMemberIds(ROOM_ID, continuationToken);

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllRoomMemberIds', () => {
    it('should fetch all member ids until it is finished', async () => {
      const { client, mock } = createMock();
      const continuationToken = 'TOKEN';
      const reply1 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..1',
          'Uxxxxxxxxxxxxxx..2',
          'Uxxxxxxxxxxxxxx..3',
        ],
        next: continuationToken,
      };
      const reply2 = {
        memberIds: [
          'Uxxxxxxxxxxxxxx..4',
          'Uxxxxxxxxxxxxxx..5',
          'Uxxxxxxxxxxxxxx..6',
        ],
      };

      mock
        .onGet(`/room/${ROOM_ID}/member/ids`)
        .replyOnce(200, reply1, headers)
        .onGet(`/room/${ROOM_ID}/member/ids?start=${continuationToken}`)
        .replyOnce(200, reply2, headers);

      const res = await client.getAllRoomMemberIds(ROOM_ID);

      expect(res).toEqual([
        'Uxxxxxxxxxxxxxx..1',
        'Uxxxxxxxxxxxxxx..2',
        'Uxxxxxxxxxxxxxx..3',
        'Uxxxxxxxxxxxxxx..4',
        'Uxxxxxxxxxxxxxx..5',
        'Uxxxxxxxxxxxxxx..6',
      ]);
    });
  });
});

describe('Leave', () => {
  describe('#leaveGroup', () => {
    it('should call leave api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock.onPost(`/group/${GROUP_ID}/leave`).reply(200, reply, headers);

      const res = await client.leaveGroup(GROUP_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#leaveRoom', () => {
    it('should call leave api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock.onPost(`/room/${ROOM_ID}/leave`).reply(200, reply, headers);

      const res = await client.leaveRoom(ROOM_ID);

      expect(res).toEqual(reply);
    });
  });
});
