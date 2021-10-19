import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';
import * as TelegramTypes from '../TelegramTypes';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

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

describe('#sendAudio', () => {
  const result = {
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
  };
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

  it('should send audio message to user', async () => {
    const telegram = new TelegramClient({
      accessToken: constants.ACCESS_TOKEN,
    });

    mock
      .onPost('/sendAudio', {
        chat_id: 427770117,
        audio: 'https://example.com/audio.mp3',
        caption: 'gooooooodAudio',
        parse_mode: 'Markdown',
        duration: 1,
        performer: 'performer',
        title: 'title',
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendAudio(
      427770117,
      'https://example.com/audio.mp3',
      {
        caption: 'gooooooodAudio',
        parseMode: 'MarkdownV2',
        duration: 1,
        performer: 'performer',
        title: 'title',
        thumb: 'thumb',
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendDocument', () => {
  const result = {
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
  };
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

  it('should send document message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendDocument', {
        chat_id: 427770117,
        document: 'https://example.com/doc.gif',
        caption: 'gooooooodDocument',
        parse_mode: 'Markdown',
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendDocument(
      427770117,
      'https://example.com/doc.gif',
      {
        caption: 'gooooooodDocument',
        thumb: 'thumb',
        parseMode: 'MarkdownV2',
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendSticker', () => {
  const result = {
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
    sticker: {
      width: 362,
      height: 512,
      emoji: '✊',
      thumb: {
        fileId: 'AAQFABOt1bEyAASi4MvOBXP2MYs8AQABAg',
        fileSize: 2142,
        width: 63,
        height: 90,
      },
      fileId: 'CAADBQADQAADyIsGAAE7MpzFPFQX5QI',
      fileSize: 36326,
    },
  };
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

  it('should send sticker message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendSticker', {
        chat_id: 427770117,
        sticker: 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendSticker(
      427770117,
      'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
      {
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendVideo', () => {
  const result = {
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
  };
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

  it('should send video message to user with camelcase', async () => {
    const { client, mock } = createMock();

    mock
      .onPost('/sendVideo', {
        chat_id: 427770117,
        video: 'https://example.com/video.mp4',
        duration: 1,
        width: 2,
        height: 3,
        caption: 'gooooooodVideo',
        parse_mode: 'Markdown',
        supports_streaming: true,
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendVideo(
      427770117,
      'https://example.com/video.mp4',
      {
        duration: 1,
        width: 2,
        height: 3,
        thumb: 'thumb',
        caption: 'gooooooodVideo',
        parseMode: 'MarkdownV2',
        supportsStreaming: true,
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendAnimation', () => {
  const result = {
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
  };
  const reply = {
    ok: true,
    result: {
      message_id: 3,
      from: {
        id: 902132548,
        is_bot: true,
        first_name: 'first',
        username: 'a bot',
      },
      chat: {
        id: 164230890,
        first_name: 'first',
        username: 'a user',
        type: 'private',
      },
      date: 1569500899,
      animation: {
        file_name: 'giphy.gif.mp4',
        mime_type: 'video/mp4',
        duration: 10,
        width: 300,
        height: 226,
        thumb: {
          file_id: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
          file_size: 2249,
          width: 90,
          height: 67,
        },
        file_id: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
        file_size: 199519,
      },
      document: {
        file_name: 'giphy.gif.mp4',
        mime_type: 'video/mp4',
        thumb: {
          file_id: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
          file_size: 2249,
          width: 90,
          height: 67,
        },
        file_id: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
        file_size: 199519,
      },
    },
  };

  it('should send animation message to user', async () => {
    const { client, mock } = createMock();

    mock
      .onPost('/sendAnimation', {
        chat_id: 427770117,
        animation: 'https://example.com/animation.mp4',
        duration: 1,
        width: 2,
        height: 3,
        caption: 'gooooooodAnimation',
        parse_mode: 'Markdown',
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendAnimation(
      427770117,
      'https://example.com/animation.mp4',
      {
        duration: 1,
        width: 2,
        height: 3,
        thumb: 'thumb',
        caption: 'gooooooodAnimation',
        parseMode: 'MarkdownV2',
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendVoice', () => {
  const result = {
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
  };
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

  it('should send voice message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendVoice', {
        chat_id: 427770117,
        voice: 'https://example.com/voice.ogg',
        caption: 'gooooooodVoice',
        parse_mode: 'Markdown',
        duration: 1,
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendVoice(
      427770117,
      'https://example.com/voice.ogg',
      {
        caption: 'gooooooodVoice',
        parseMode: 'MarkdownV2',
        duration: 1,
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendVideoNote', () => {
  const result = {
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
  };
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
    },
  };

  it('should send video note message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendVideoNote', {
        chat_id: 427770117,
        video_note: 'https://example.com/video_note.mp4',
        duration: 40,
        length: 1,
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendVideoNote(
      427770117,
      'https://example.com/video_note.mp4',
      {
        duration: 40,
        length: 1,
        thumb: 'thumb',
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendMediaGroup', () => {
  // TODO: the real result related to request.
  const result = {
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
  };
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
      photo: [
        {
          file_id: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
          width: 1000,
          height: 1000,
        },
      ],
    },
  };

  it('should send a group of photos and videos as an album', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendMediaGroup', {
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
            parse_mode: 'Markdown',
            width: 1,
            height: 2,
            duration: 3,
            supports_streaming: true,
          },
        ],
        disable_notification: true,
      })
      .reply(200, reply);

    const res = await client.sendMediaGroup(
      427770117,
      [
        {
          type: TelegramTypes.InputMediaType.Photo,
          media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
          caption: 'caption',
          parseMode: 'Markdown',
        },
        {
          type: TelegramTypes.InputMediaType.Video,
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
      { disableNotification: true }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendLocation', () => {
  const result = {
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
  };
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

  it('should send location message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendLocation', {
        chat_id: 427770117,
        latitude: 30,
        longitude: 45,
        live_period: 60,
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendLocation(
      427770117,
      {
        latitude: 30,
        longitude: 45,
      },
      {
        livePeriod: 60,
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendVenue', () => {
  const result = {
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
  };
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

  it('should send venue message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendVenue', {
        chat_id: 427770117,
        latitude: 30,
        longitude: 45,
        title: 'a_title',
        address: 'an_address',
        disable_notification: true,
        reply_to_message_id: 9527,
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
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendContact', () => {
  const result = {
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
  };
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

  it('should send contact message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendContact', {
        chat_id: 427770117,
        phone_number: '886123456789',
        first_name: 'first',
        last_name: 'last',
        vcard: 'vcard',
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendContact(
      427770117,
      {
        phoneNumber: '886123456789',
        firstName: 'first',
      },
      {
        lastName: 'last',
        vcard: 'vcard',
        disableNotification: true,
        replyToMessageId: 9527,
      }
    );

    expect(res).toEqual(result);
  });
});

describe('#sendPoll', () => {
  const result = {
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
  };
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
      poll: {
        id: '6095870087057637377',
        question: 'q',
        options: [
          {
            text: 'a',
            voter_count: 0,
          },
          {
            text: 'b',
            voter_count: 0,
          },
          {
            text: 'c',
            voter_count: 0,
          },
        ],
        is_closed: false,
      },
    },
  };

  it('should send poll message to user', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendPoll', {
        chat_id: 427770117,
        question: 'q',
        options: ['a', 'b', 'c'],
        disable_notification: true,
        reply_to_message_id: 9527,
      })
      .reply(200, reply);

    const res = await client.sendPoll(427770117, 'q', ['a', 'b', 'c'], {
      disableNotification: true,
      replyToMessageId: 9527,
    });

    expect(res).toEqual(result);
  });
});

describe('#sendChatAction', () => {
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  it("should tell the user that something is happening on the bot's side", async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/sendChatAction', {
        chat_id: 427770117,
        action: 'typing',
      })
      .reply(200, reply);

    const res = await client.sendChatAction(
      427770117,
      TelegramTypes.ChatAction.Typing
    );

    expect(res).toEqual(result);
  });
});
