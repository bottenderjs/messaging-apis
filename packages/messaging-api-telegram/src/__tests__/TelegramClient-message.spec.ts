import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #sendMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage({
    chatId: 427770117,
    text: 'hi',
    parseMode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableWebPagePreview: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    allow_sending_without_reply: true,
    chat_id: 427770117,
    disable_notification: true,
    disable_web_page_preview: true,
    entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    parse_mode: 'MarkdownV2',
    reply_to_message_id: 9527,
    text: 'hi',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage(427770117, 'hi', {
    parseMode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableWebPagePreview: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    allow_sending_without_reply: true,
    chat_id: 427770117,
    disable_notification: true,
    disable_web_page_preview: true,
    entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    parse_mode: 'MarkdownV2',
    reply_to_message_id: 9527,
    text: 'hi',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with InlineKeyboardMarkup', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage({
    chatId: 427770117,
    text: 'hi',
    replyMarkup: {
      inlineKeyboard: [
        [
          {
            text: 'text',
            url: 'http://url.com/',
            loginUrl: {
              url: 'http://login_url.com/',
              forwardText: 'forwardText',
              botUsername: 'botUsername',
              requestWriteAccess: true,
            },
            callbackData: 'callback_data',
            switchInlineQuery: 'switch_inline_query',
            switchInlineQueryCurrentChat: 'switch_inline_query_current_chat',
            callbackGame: {},
            pay: true,
          },
        ],
      ],
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    reply_markup: {
      inline_keyboard: [
        [
          {
            callback_data: 'callback_data',
            callback_game: {},
            login_url: {
              bot_username: 'botUsername',
              forward_text: 'forwardText',
              request_write_access: true,
              url: 'http://login_url.com/',
            },
            pay: true,
            switch_inline_query: 'switch_inline_query',
            switch_inline_query_current_chat:
              'switch_inline_query_current_chat',
            text: 'text',
            url: 'http://url.com/',
          },
        ],
      ],
    },
    text: 'hi',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with ReplyKeyboardMarkup', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage({
    chatId: 427770117,
    text: 'hi',
    replyMarkup: {
      keyboard: [
        [
          {
            text: 'text',
            requestContact: true,
            requestLocation: true,
          },
        ],
      ],
      resizeKeyboard: true,
      oneTimeKeyboard: true,
      selective: true,
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    reply_markup: {
      keyboard: [
        [
          {
            request_contact: true,
            request_location: true,
            text: 'text',
          },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
      selective: true,
    },
    text: 'hi',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with ReplyKeyboardRemove', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage({
    chatId: 427770117,
    text: 'hi',
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    text: 'hi',
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with ForceReply', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMessage({
    chatId: 427770117,
    text: 'hi',
    replyMarkup: {
      forceReply: true,
      selective: true,
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
    date: 1499402829,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    text: 'hi',
    reply_markup: {
      force_reply: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #forwardMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.forwardMessage({
    chatId: 427770117,
    fromChatId: 313534466,
    messageId: 203,
    disableNotification: true,
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
    date: 1499402829,
    forwardFrom: {
      id: 357830311,
      firstName: 'first_2',
      lastName: 'last_2',
      languageCode: 'zh-TW',
    },
    forwardDate: 1499849644,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/forwardMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    from_chat_id: 313534466,
    message_id: 203,
    disable_notification: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #forwardMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.forwardMessage(427770117, 313534466, 203, {
    disableNotification: true,
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
    date: 1499402829,
    forwardFrom: {
      id: 357830311,
      firstName: 'first_2',
      lastName: 'last_2',
      languageCode: 'zh-TW',
    },
    forwardDate: 1499849644,
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/forwardMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    from_chat_id: 313534466,
    message_id: 203,
    disable_notification: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #copyMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.copyMessage({
    chatId: 427770117,
    fromChatId: 313534466,
    messageId: 203,
    caption: 'caption',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
    },
  });

  expect(res).toEqual({
    messageId: 5566,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/copyMessage'
  );
  expect(request?.body).toEqual({
    allow_sending_without_reply: true,
    caption: 'caption',
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    chat_id: 427770117,
    disable_notification: true,
    from_chat_id: 313534466,
    message_id: 203,
    parse_mode: 'MarkdownV2',
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    reply_to_message_id: 9527,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #copyMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.copyMessage(427770117, 313534466, 203, {
    caption: 'caption',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
    },
  });

  expect(res).toEqual({
    messageId: 5566,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/copyMessage'
  );
  expect(request?.body).toEqual({
    allow_sending_without_reply: true,
    caption: 'caption',
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    chat_id: 427770117,
    disable_notification: true,
    from_chat_id: 313534466,
    message_id: 203,
    parse_mode: 'MarkdownV2',
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    reply_to_message_id: 9527,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendPhoto', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendPhoto({
    chatId: 427770117,
    photo: 'https://example.com/image.png',
    caption: 'gooooooodPhoto',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    date: 1499403191,
    photo: [
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAAEC',
        fileSize: 1611,
        width: 90,
        height: 80,
      },
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koDAAEC',
        fileSize: 17218,
        width: 320,
        height: 285,
      },
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDAAEC',
        fileSize: 16209,
        width: 374,
        height: 333,
      },
    ],
    caption: 'gooooooodPhoto',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendPhoto'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    photo: 'https://example.com/image.png',
    caption: 'gooooooodPhoto',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendPhoto shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendPhoto(
    427770117,
    'https://example.com/image.png',
    {
      caption: 'gooooooodPhoto',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          type: 'mention',
          offset: 1,
          length: 8,
        },
      ],
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    date: 1499403191,
    photo: [
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAAEC',
        fileSize: 1611,
        width: 90,
        height: 80,
      },
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koDAAEC',
        fileSize: 17218,
        width: 320,
        height: 285,
      },
      {
        fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDAAEC',
        fileSize: 16209,
        width: 374,
        height: 333,
      },
    ],
    caption: 'gooooooodPhoto',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendPhoto'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    photo: 'https://example.com/image.png',
    caption: 'gooooooodPhoto',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAudio', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendAudio({
    chatId: 427770117,
    audio: 'https://example.com/audio.mp3',
    caption: 'gooooooodAudio',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    duration: 1,
    performer: 'performer',
    title: 'title',
    thumb: 'thumb',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'gooooooodAudio',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendAudio'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    audio: 'https://example.com/audio.mp3',
    caption: 'gooooooodAudio',
    parse_mode: 'MarkdownV2',
    duration: 1,
    performer: 'performer',
    title: 'title',
    disable_notification: true,
    reply_to_message_id: 9527,
    thumb: 'thumb',
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAudio shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendAudio(
    427770117,
    'https://example.com/audio.mp3',
    {
      caption: 'gooooooodAudio',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          type: 'mention',
          offset: 1,
          length: 8,
        },
      ],
      duration: 1,
      performer: 'performer',
      title: 'title',
      thumb: 'thumb',
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'gooooooodAudio',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendAudio'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    audio: 'https://example.com/audio.mp3',
    caption: 'gooooooodAudio',
    parse_mode: 'MarkdownV2',
    duration: 1,
    performer: 'performer',
    title: 'title',
    disable_notification: true,
    reply_to_message_id: 9527,
    thumb: 'thumb',
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendDocument', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendDocument({
    chatId: 427770117,
    document: 'https://example.com/doc.gif',
    caption: 'gooooooodDocument',
    thumb: 'thumb',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableContentTypeDetection: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    document: {
      fileName: 'ylDRTR05sy6M.gif.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABN0Rb0ZAARFFMCIr_zrhq9bAAIC',
        fileSize: 1627,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADO3wAAhUbZAer4xD-iB4NdgI',
      fileSize: 21301,
    },
    caption: 'gooooooodDocument',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendDocument'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    document: 'https://example.com/doc.gif',
    caption: 'gooooooodDocument',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    thumb: 'thumb',
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    disable_content_type_detection: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendDocument shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendDocument(
    427770117,
    'https://example.com/doc.gif',
    {
      caption: 'gooooooodDocument',
      thumb: 'thumb',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          type: 'mention',
          offset: 1,
          length: 8,
        },
      ],
      disableContentTypeDetection: true,
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    document: {
      fileName: 'ylDRTR05sy6M.gif.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABN0Rb0ZAARFFMCIr_zrhq9bAAIC',
        fileSize: 1627,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADO3wAAhUbZAer4xD-iB4NdgI',
      fileSize: 21301,
    },
    caption: 'gooooooodDocument',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendDocument'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    document: 'https://example.com/doc.gif',
    caption: 'gooooooodDocument',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    thumb: 'thumb',
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    disable_content_type_detection: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideo', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVideo({
    chatId: 427770117,
    video: 'https://example.com/video.mp4',
    duration: 1,
    width: 2,
    height: 3,
    thumb: 'thumb',
    caption: 'gooooooodVideo',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    supportsStreaming: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    document: {
      fileName: 'madora.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
        fileSize: 2874,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
      fileSize: 40582,
    },
    caption: 'gooooooodVideo',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVideo'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    video: 'https://example.com/video.mp4',
    duration: 1,
    width: 2,
    height: 3,
    caption: 'gooooooodVideo',
    parse_mode: 'MarkdownV2',
    supports_streaming: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideo shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVideo(
    427770117,
    'https://example.com/video.mp4',
    {
      duration: 1,
      width: 2,
      height: 3,
      thumb: 'thumb',
      caption: 'gooooooodVideo',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          type: 'mention',
          offset: 1,
          length: 8,
        },
      ],
      supportsStreaming: true,
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    document: {
      fileName: 'madora.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
        fileSize: 2874,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
      fileSize: 40582,
    },
    caption: 'gooooooodVideo',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVideo'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    video: 'https://example.com/video.mp4',
    duration: 1,
    width: 2,
    height: 3,
    caption: 'gooooooodVideo',
    parse_mode: 'MarkdownV2',
    supports_streaming: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAnimation', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendAnimation({
    chatId: 427770117,
    animation: 'https://example.com/animation.mp4',
    duration: 1,
    width: 2,
    height: 3,
    thumb: 'thumb',
    caption: 'gooooooodAnimation',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
    },
  });

  expect(res).toEqual({
    messageId: 3,
    from: {
      id: 902132548,
      isBot: true,
      firstName: 'first',
      username: 'a bot',
    },
    chat: {
      id: 164230890,
      firstName: 'first',
      username: 'a user',
      type: 'private',
    },
    date: 1569500899,
    animation: {
      fileName: 'giphy.gif.mp4',
      mimeType: 'video/mp4',
      duration: 10,
      width: 300,
      height: 226,
      thumb: {
        fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
        fileSize: 2249,
        width: 90,
        height: 67,
      },
      fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
      fileSize: 199519,
    },
    document: {
      fileName: 'giphy.gif.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
        fileSize: 2249,
        width: 90,
        height: 67,
      },
      fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
      fileSize: 199519,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendAnimation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    animation: 'https://example.com/animation.mp4',
    duration: 1,
    width: 2,
    height: 3,
    caption: 'gooooooodAnimation',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAnimation shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendAnimation(
    427770117,
    'https://example.com/animation.mp4',
    {
      duration: 1,
      width: 2,
      height: 3,
      thumb: 'thumb',
      caption: 'gooooooodAnimation',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          type: 'mention',
          offset: 1,
          length: 8,
        },
      ],
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

  expect(res).toEqual({
    messageId: 3,
    from: {
      id: 902132548,
      isBot: true,
      firstName: 'first',
      username: 'a bot',
    },
    chat: {
      id: 164230890,
      firstName: 'first',
      username: 'a user',
      type: 'private',
    },
    date: 1569500899,
    animation: {
      fileName: 'giphy.gif.mp4',
      mimeType: 'video/mp4',
      duration: 10,
      width: 300,
      height: 226,
      thumb: {
        fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
        fileSize: 2249,
        width: 90,
        height: 67,
      },
      fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
      fileSize: 199519,
    },
    document: {
      fileName: 'giphy.gif.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
        fileSize: 2249,
        width: 90,
        height: 67,
      },
      fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
      fileSize: 199519,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendAnimation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    animation: 'https://example.com/animation.mp4',
    duration: 1,
    width: 2,
    height: 3,
    caption: 'gooooooodAnimation',
    parse_mode: 'MarkdownV2',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVoice', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVoice({
    chatId: 427770117,
    voice: 'https://example.com/voice.ogg',
    caption: 'gooooooodVoice',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    duration: 1,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    document: {
      fileName: '1.ogg',
      mimeType: 'audio/ogg',
      fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
      fileSize: 10870,
    },
    caption: 'gooooooodVoice',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVoice'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    voice: 'https://example.com/voice.ogg',
    caption: 'gooooooodVoice',
    parse_mode: 'MarkdownV2',
    duration: 1,
    disable_notification: true,
    reply_to_message_id: 9527,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVoice shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVoice(
    427770117,
    'https://example.com/voice.ogg',
    {
      caption: 'gooooooodVoice',
      parseMode: 'MarkdownV2',
      captionEntities: [
        {
          length: 8,
          offset: 1,
          type: 'mention',
        },
      ],
      duration: 1,
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    document: {
      fileName: '1.ogg',
      mimeType: 'audio/ogg',
      fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
      fileSize: 10870,
    },
    caption: 'gooooooodVoice',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVoice'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    voice: 'https://example.com/voice.ogg',
    caption: 'gooooooodVoice',
    parse_mode: 'MarkdownV2',
    duration: 1,
    disable_notification: true,
    reply_to_message_id: 9527,
    caption_entities: [
      {
        length: 8,
        offset: 1,
        type: 'mention',
      },
    ],
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideoNote', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVideoNote({
    chatId: 427770117,
    videoNote: 'https://example.com/video_note.mp4',
    duration: 40,
    length: 1,
    thumb: 'thumb',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    document: {
      fileName: 'madora.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
        fileSize: 2874,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
      fileSize: 40582,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVideoNote'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    video_note: 'https://example.com/video_note.mp4',
    duration: 40,
    length: 1,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideoNote shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVideoNote(
    427770117,
    'https://example.com/video_note.mp4',
    {
      duration: 40,
      length: 1,
      thumb: 'thumb',
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
      replyMarkup: {
        removeKeyboard: true,
        selective: true,
      },
    }
  );

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
    document: {
      fileName: 'madora.mp4',
      mimeType: 'video/mp4',
      thumb: {
        fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
        fileSize: 2874,
        width: 90,
        height: 90,
      },
      fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
      fileSize: 40582,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVideoNote'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    video_note: 'https://example.com/video_note.mp4',
    duration: 40,
    length: 1,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
    thumb: 'thumb',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMediaGroup shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMediaGroup(
    427770117,
    [
      {
        type: 'photo',
        media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        caption: 'caption',
        parseMode: 'Markdown',
      },
      {
        type: 'video',
        media: 'AgADBAADAUw6G3sdZAeh53f0F11Zgsk',
        caption: 'caption',
        thumb: 'thumb',
        parseMode: 'Markdown',
        width: 1,
        height: 2,
        duration: 3,
        supportsStreaming: true,
      },
    ],
    {
      disableNotification: true,
      replyToMessageId: 9527,
      allowSendingWithoutReply: true,
    }
  );

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
    photo: [
      {
        fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        width: 1000,
        height: 1000,
      },
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMediaGroup'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    media: [
      {
        type: 'photo',
        media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        caption: 'caption',
        parse_mode: 'Markdown',
      },
      {
        type: 'video',
        media: 'AgADBAADAUw6G3sdZAeh53f0F11Zgsk',
        caption: 'caption',
        thumb: 'thumb',
        parse_mode: 'Markdown',
        width: 1,
        height: 2,
        duration: 3,
        supports_streaming: true,
      },
    ],
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMediaGroup', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendMediaGroup({
    chatId: 427770117,
    media: [
      {
        type: 'photo',
        media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        caption: 'caption',
        parseMode: 'Markdown',
      },
      {
        type: 'video',
        media: 'AgADBAADAUw6G3sdZAeh53f0F11Zgsk',
        caption: 'caption',
        thumb: 'thumb',
        parseMode: 'Markdown',
        width: 1,
        height: 2,
        duration: 3,
        supportsStreaming: true,
      },
    ],
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
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
    photo: [
      {
        fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        width: 1000,
        height: 1000,
      },
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendMediaGroup'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    media: [
      {
        type: 'photo',
        media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
        caption: 'caption',
        parse_mode: 'Markdown',
      },
      {
        type: 'video',
        media: 'AgADBAADAUw6G3sdZAeh53f0F11Zgsk',
        caption: 'caption',
        thumb: 'thumb',
        parse_mode: 'Markdown',
        width: 1,
        height: 2,
        duration: 3,
        supports_streaming: true,
      },
    ],
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendLocation', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendLocation({
    chatId: 427770117,
    latitude: 30,
    longitude: 45,
    horizontalAccuracy: 750,
    livePeriod: 60,
    heading: 180,
    proximityAlertRadius: 500,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    location: {
      latitude: 30.000005,
      longitude: 45,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendLocation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    latitude: 30,
    longitude: 45,
    heading: 180,
    horizontal_accuracy: 750,
    live_period: 60,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    proximity_alert_radius: 500,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendLocation shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendLocation(427770117, {
    latitude: 30,
    longitude: 45,
    horizontalAccuracy: 750,
    livePeriod: 60,
    heading: 180,
    proximityAlertRadius: 500,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    location: {
      latitude: 30.000005,
      longitude: 45,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendLocation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    latitude: 30,
    longitude: 45,
    heading: 180,
    horizontal_accuracy: 750,
    live_period: 60,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    proximity_alert_radius: 500,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageLiveLocation', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageLiveLocation({
    chatId: 427770117,
    messageId: 66,
    latitude: 11,
    longitude: 22,
    heading: 180,
    horizontalAccuracy: 750,
    proximityAlertRadius: 500,
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
    messageId: 66,
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
    date: 1499402829,
    location: {
      latitude: 11,
      longitude: 22,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageLiveLocation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 66,
    latitude: 11,
    longitude: 22,
    heading: 180,
    horizontal_accuracy: 750,
    proximity_alert_radius: 500,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #stopMessageLiveLocation', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.stopMessageLiveLocation({
    chatId: 427770117,
    messageId: 66,
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
    messageId: 66,
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
    date: 1499402829,
    location: {
      latitude: 30.000005,
      longitude: 45,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/stopMessageLiveLocation'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 66,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVenue', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVenue({
    chatId: 427770117,
    latitude: 30,
    longitude: 45,
    title: 'a_title',
    address: 'an_address',
    foursquareId: '1',
    foursquareType: 'arts_entertainment/default',
    googlePlaceId: '1',
    googlePlaceType: 'accounting',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVenue'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    latitude: 30,
    longitude: 45,
    title: 'a_title',
    address: 'an_address',
    foursquare_id: '1',
    foursquare_type: 'arts_entertainment/default',
    google_place_id: '1',
    google_place_type: 'accounting',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVenue shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendVenue(427770117, {
    latitude: 30,
    longitude: 45,
    title: 'a_title',
    address: 'an_address',
    foursquareId: '1',
    foursquareType: 'arts_entertainment/default',
    googlePlaceId: '1',
    googlePlaceType: 'accounting',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendVenue'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    latitude: 30,
    longitude: 45,
    title: 'a_title',
    address: 'an_address',
    foursquare_id: '1',
    foursquare_type: 'arts_entertainment/default',
    google_place_id: '1',
    google_place_type: 'accounting',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendContact', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendContact({
    chatId: 427770117,
    phoneNumber: '886123456789',
    firstName: 'first',
    lastName: 'last',
    vcard: 'vcard',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    contact: {
      phoneNumber: '886123456789',
      firstName: 'first',
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendContact'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    phone_number: '886123456789',
    first_name: 'first',
    last_name: 'last',
    vcard: 'vcard',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendContact shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendContact(427770117, {
    phoneNumber: '886123456789',
    firstName: 'first',
    lastName: 'last',
    vcard: 'vcard',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    contact: {
      phoneNumber: '886123456789',
      firstName: 'first',
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendContact'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    phone_number: '886123456789',
    first_name: 'first',
    last_name: 'last',
    vcard: 'vcard',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendPoll', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendPoll({
    chatId: 427770117,
    question: 'q',
    options: ['a', 'b', 'c'],
    isAnonymous: true,
    type: 'quiz',
    allowsMultipleAnswers: true,
    correctOptionId: 1,
    explanation: 'explanation',
    explanationParseMode: 'MarkdownV2',
    explanationEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    openPeriod: 500,
    closeDate: 300,
    isClosed: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    poll: {
      id: '6095870087057637377',
      question: 'q',
      options: [
        {
          text: 'a',
          voterCount: 0,
        },
        {
          text: 'b',
          voterCount: 0,
        },
        {
          text: 'c',
          voterCount: 0,
        },
      ],
      isClosed: false,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendPoll'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    question: 'q',
    options: ['a', 'b', 'c'],
    is_anonymous: true,
    type: 'quiz',
    allows_multiple_answers: true,
    correct_option_id: 1,
    explanation: 'explanation',
    explanation_parse_mode: 'MarkdownV2',
    explanation_entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    open_period: 500,
    close_date: 300,
    is_closed: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendPoll shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendPoll(427770117, 'q', ['a', 'b', 'c'], {
    isAnonymous: true,
    type: 'quiz',
    allowsMultipleAnswers: true,
    correctOptionId: 1,
    explanation: 'explanation',
    explanationParseMode: 'MarkdownV2',
    explanationEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    openPeriod: 500,
    closeDate: 300,
    isClosed: true,
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    poll: {
      id: '6095870087057637377',
      question: 'q',
      options: [
        {
          text: 'a',
          voterCount: 0,
        },
        {
          text: 'b',
          voterCount: 0,
        },
        {
          text: 'c',
          voterCount: 0,
        },
      ],
      isClosed: false,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendPoll'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    question: 'q',
    options: ['a', 'b', 'c'],
    is_anonymous: true,
    type: 'quiz',
    allows_multiple_answers: true,
    correct_option_id: 1,
    explanation: 'explanation',
    explanation_parse_mode: 'MarkdownV2',
    explanation_entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    open_period: 500,
    close_date: 300,
    is_closed: true,
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendDice', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendDice({
    chatId: 427770117,
    emoji: '🎯',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    dice: {
      emoji: '🎯',
      value: expect.any(Number),
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendDice'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    emoji: '🎯',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendDice shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendDice(427770117, {
    emoji: '🎯',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
    replyMarkup: {
      removeKeyboard: true,
      selective: true,
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
    dice: {
      emoji: '🎯',
      value: expect.any(Number),
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendDice'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    emoji: '🎯',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      remove_keyboard: true,
      selective: true,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendChatAction', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendChatAction({
    chatId: 427770117,
    action: 'typing',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendChatAction'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    action: 'typing',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendChatAction shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendChatAction(427770117, 'typing');

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendChatAction'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    action: 'typing',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
