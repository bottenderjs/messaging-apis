import MockAdapter from 'axios-mock-adapter';

import { MessengerClient } from '..';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = (): { client: MessengerClient; mock: MockAdapter } => {
  const client = new MessengerClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#sendTemplate', () => {
  it('should call messages api with template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendTemplate(USER_ID, {
      templateType: 'button',
      text: 'title',
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendButtonTemplate', () => {
  it('should call messages api with button template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendButtonTemplate(USER_ID, 'title', [
      {
        type: 'postback',
        title: 'Start Chatting',
        payload: 'USER_DEFINED_PAYLOAD',
      },
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendGenericTemplate', () => {
  it('should call messages api with generic template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(USER_ID, [
      {
        title: "Welcome to Peter's Hats",
        imageUrl: 'https://petersfancybrownhats.com/company_image.png',
        subtitle: "We've got the right hat for everyone.",
        defaultAction: {
          type: 'web_url',
          url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
          messengerExtensions: true,
          webviewHeightRatio: 'tall',
          fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
        },
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'DEVELOPER_DEFINED_PAYLOAD',
          },
        ],
      },
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });

  it('can use square generic template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(
      USER_ID,
      [
        {
          title: "Welcome to Peter's Hats",
          imageUrl: 'https://petersfancybrownhats.com/company_image.png',
          subtitle: "We've got the right hat for everyone.",
          defaultAction: {
            type: 'web_url',
            url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            messengerExtensions: true,
            webviewHeightRatio: 'tall',
            fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
          },
          buttons: [
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            },
          ],
        },
      ],
      {
        imageAspectRatio: 'square',
      }
    );

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
            image_aspect_ratio: 'square',
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });

  it('can use generic template with tag', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(
      USER_ID,
      [
        {
          title: "Welcome to Peter's Hats",
          imageUrl: 'https://petersfancybrownhats.com/company_image.png',
          subtitle: "We've got the right hat for everyone.",
          defaultAction: {
            type: 'web_url',
            url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            messengerExtensions: true,
            webviewHeightRatio: 'tall',
            fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
          },
          buttons: [
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            },
          ],
        },
      ],
      {
        tag: 'CONFIRMED_EVENT_UPDATE',
      }
    );

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'MESSAGE_TAG',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
          },
        },
      },
      tag: 'CONFIRMED_EVENT_UPDATE',
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendMediaTemplate', () => {
  it('should call messages api with media template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendMediaTemplate(USER_ID, [
      {
        mediaType: 'image',
        attachmentId: '1854626884821032',
        buttons: [
          {
            type: 'web_url',
            url: '<WEB_URL>',
            title: 'View Website',
          },
        ],
      },
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendReceiptTemplate', () => {
  it('should call messages api with receipt template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendReceiptTemplate(USER_ID, {
      recipientName: 'Stephane Crozatier',
      orderNumber: '12345678902',
      currency: 'USD',
      paymentMethod: 'Visa 2345',
      orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
      timestamp: '1428444852',
      elements: [
        {
          title: 'Classic White T-Shirt',
          subtitle: '100% Soft and Luxurious Cotton',
          quantity: 2,
          price: 50,
          currency: 'USD',
          imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
        },
        {
          title: 'Classic Gray T-Shirt',
          subtitle: '100% Soft and Luxurious Cotton',
          quantity: 1,
          price: 25,
          currency: 'USD',
          imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
        },
      ],
      address: {
        street1: '1 Hacker Way',
        street2: '',
        city: 'Menlo Park',
        postalCode: '94025',
        state: 'CA',
        country: 'US',
      },
      summary: {
        subtotal: 75.0,
        shippingCost: 4.95,
        totalTax: 6.19,
        totalCost: 56.14,
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

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendOneTimeNotifReqTemplate', () => {
  it('should call messages api with one time notif req template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendOneTimeNotifReqTemplate(USER_ID, {
      title: '<TITLE_TEXT>',
      payload: '<USER_DEFINED_PAYLOAD>',
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'one_time_notif_req',
            title: '<TITLE_TEXT>',
            payload: '<USER_DEFINED_PAYLOAD>',
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
