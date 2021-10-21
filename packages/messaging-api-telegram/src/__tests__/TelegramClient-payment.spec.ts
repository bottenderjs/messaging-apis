import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #sendInvoice', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendInvoice({
    chatId: 427770117,
    title: 'product name',
    description: 'product description',
    payload: 'bot-defined invoice payload',
    providerToken: 'PROVIDER_TOKEN',
    currency: 'USD',
    prices: [
      { label: 'product', amount: 11000 },
      { label: 'tax', amount: 11000 },
    ],
    maxTipAmount: 145,
    suggestedTipAmounts: [10, 20, 30, 40],
    startParameter: 'pay',
    providerData: '',
    photoUrl: 'https://www.example.com/photo',
    photoSize: 200,
    photoWidth: 100,
    photoHeight: 100,
    needName: true,
    needPhoneNumber: true,
    needEmail: true,
    needShippingAddress: true,
    sendPhoneNumberToProvider: true,
    sendEmailToProvider: true,
    isFlexible: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
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
    date: 1499403678,
    invoice: {
      title: 'product name',
      description: 'product description',
      startParameter: 'pay',
      currency: 'USD',
      totalCount: 22000,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendInvoice'
  );
  expect(request?.body).toEqual({
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
    max_tip_amount: 145,
    suggested_tip_amounts: [10, 20, 30, 40],
    provider_data: '',
    photo_url: 'https://www.example.com/photo',
    photo_size: 200,
    photo_width: 100,
    photo_height: 100,
    need_name: true,
    need_phone_number: true,
    need_email: true,
    need_shipping_address: true,
    send_phone_number_to_provider: true,
    send_email_to_provider: true,
    is_flexible: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendInvoice shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendInvoice(427770117, {
    title: 'product name',
    description: 'product description',
    payload: 'bot-defined invoice payload',
    providerToken: 'PROVIDER_TOKEN',
    currency: 'USD',
    prices: [
      { label: 'product', amount: 11000 },
      { label: 'tax', amount: 11000 },
    ],
    maxTipAmount: 145,
    suggestedTipAmounts: [10, 20, 30, 40],
    startParameter: 'pay',
    providerData: '',
    photoUrl: 'https://www.example.com/photo',
    photoSize: 200,
    photoWidth: 100,
    photoHeight: 100,
    needName: true,
    needPhoneNumber: true,
    needEmail: true,
    needShippingAddress: true,
    sendPhoneNumberToProvider: true,
    sendEmailToProvider: true,
    isFlexible: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
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
    date: 1499403678,
    invoice: {
      title: 'product name',
      description: 'product description',
      startParameter: 'pay',
      currency: 'USD',
      totalCount: 22000,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendInvoice'
  );
  expect(request?.body).toEqual({
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
    max_tip_amount: 145,
    suggested_tip_amounts: [10, 20, 30, 40],
    provider_data: '',
    photo_url: 'https://www.example.com/photo',
    photo_size: 200,
    photo_width: 100,
    photo_height: 100,
    need_name: true,
    need_phone_number: true,
    need_email: true,
    need_shipping_address: true,
    send_phone_number_to_provider: true,
    send_email_to_provider: true,
    is_flexible: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #answerShippingQuery', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerShippingQuery({
    shippingQueryId: 'UNIQUE_ID',
    ok: true,
    shippingOptions: [
      {
        id: 'id',
        title: 'title',
        prices: [
          {
            label: 'label',
            amount: 100,
          },
        ],
      },
    ],
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerShippingQuery'
  );
  expect(request?.body).toEqual({
    shipping_query_id: 'UNIQUE_ID',
    ok: true,
    shipping_options: [
      {
        id: 'id',
        title: 'title',
        prices: [
          {
            label: 'label',
            amount: 100,
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #answerShippingQuery shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerShippingQuery('UNIQUE_ID', true, {
    shippingOptions: [
      {
        id: 'id',
        title: 'title',
        prices: [{ label: 'label', amount: 100 }],
      },
    ],
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerShippingQuery'
  );
  expect(request?.body).toEqual({
    shipping_query_id: 'UNIQUE_ID',
    ok: true,
    shipping_options: [
      {
        id: 'id',
        title: 'title',
        prices: [
          {
            label: 'label',
            amount: 100,
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #answerPreCheckoutQuery', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerPreCheckoutQuery({
    preCheckoutQueryId: 'UNIQUE_ID',
    ok: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerPreCheckoutQuery'
  );
  expect(request?.body).toEqual({
    pre_checkout_query_id: 'UNIQUE_ID',
    ok: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #answerPreCheckoutQuery shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerPreCheckoutQuery('UNIQUE_ID', true);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerPreCheckoutQuery'
  );
  expect(request?.body).toEqual({
    pre_checkout_query_id: 'UNIQUE_ID',
    ok: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
