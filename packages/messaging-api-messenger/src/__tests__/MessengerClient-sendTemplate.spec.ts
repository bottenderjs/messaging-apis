import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #sendTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendTemplate(constants.USER_ID, {
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

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendButtonTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendButtonTemplate(constants.USER_ID, 'title', [
    {
      type: 'postback',
      title: 'Start Chatting',
      payload: 'USER_DEFINED_PAYLOAD',
    },
  ]);

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendGenericTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendGenericTemplate(constants.USER_ID, [
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

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMediaTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMediaTemplate(constants.USER_ID, [
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

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendReceiptTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendReceiptTemplate(constants.USER_ID, {
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

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendOneTimeNotifReqTemplate', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendOneTimeNotifReqTemplate(constants.USER_ID, {
    title: '<TITLE_TEXT>',
    payload: '<USER_DEFINED_PAYLOAD>',
  });

  expect(res).toEqual({
    recipientId: constants.USER_ID,
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
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
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
