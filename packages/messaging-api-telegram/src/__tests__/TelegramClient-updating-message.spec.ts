import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #editMessageText', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageText({
    chatId: 427770117,
    messageId: 66,
    text: 'new_text',
    parseMode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableWebPagePreview: true,
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
    text: 'new_text',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageText'
  );
  expect(request?.body).toEqual({
    text: 'new_text',
    chat_id: 427770117,
    message_id: 66,
    parse_mode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageText shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageText('new_text', {
    chatId: 427770117,
    messageId: 66,
    parseMode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disableWebPagePreview: true,
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
    text: 'new_text',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageText'
  );
  expect(request?.body).toEqual({
    text: 'new_text',
    chat_id: 427770117,
    message_id: 66,
    parse_mode: 'MarkdownV2',
    entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageCaption', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageCaption({
    chatId: 427770117,
    messageId: 66,
    caption: 'new_caption',
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
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
    date: 1499403678,
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'new_caption',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageCaption'
  );
  expect(request?.body).toEqual({
    caption: 'new_caption',
    chat_id: 427770117,
    message_id: 66,
    parse_mode: 'MarkdownV2',
    caption_entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageCaption shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageCaption('new_caption', {
    chatId: 427770117,
    messageId: 66,
    parseMode: 'MarkdownV2',
    captionEntities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
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
    date: 1499403678,
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'new_caption',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageCaption'
  );
  expect(request?.body).toEqual({
    caption: 'new_caption',
    chat_id: 427770117,
    message_id: 66,
    parse_mode: 'MarkdownV2',
    caption_entities: [
      {
        type: 'mention',
        offset: 1,
        length: 8,
      },
    ],
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageMedia', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageMedia({
    chatId: 427770117,
    messageId: 66,
    media: {
      type: 'audio',
      media: 'https://example.com/audio.mp3',
      caption: 'caption',
      parseMode: 'MarkdownV2',
      duration: 1,
      performer: 'performer',
      title: 'title',
    },
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
    date: 1499403678,
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'new_caption',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageMedia'
  );
  expect(request?.body).toEqual({
    media: {
      type: 'audio',
      media: 'https://example.com/audio.mp3',
      caption: 'caption',
      parse_mode: 'MarkdownV2',
      duration: 1,
      performer: 'performer',
      title: 'title',
    },
    chat_id: 427770117,
    message_id: 66,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageMedia shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageMedia(
    {
      type: 'audio',
      media: 'https://example.com/audio.mp3',
      caption: 'caption',
      parseMode: 'MarkdownV2',
      duration: 1,
      performer: 'performer',
      title: 'title',
    },
    {
      chatId: 427770117,
      messageId: 66,
      replyMarkup: {
        inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
      },
    }
  );

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
    date: 1499403678,
    audio: {
      duration: 108,
      mimeType: 'audio/mpeg',
      title: 'Song_Title',
      performer: 'Song_Performer',
      fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
      fileSize: 1739320,
    },
    caption: 'new_caption',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageMedia'
  );
  expect(request?.body).toEqual({
    media: {
      type: 'audio',
      media: 'https://example.com/audio.mp3',
      caption: 'caption',
      parse_mode: 'MarkdownV2',
      duration: 1,
      performer: 'performer',
      title: 'title',
    },
    chat_id: 427770117,
    message_id: 66,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageReplyMarkup', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageReplyMarkup({
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
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageReplyMarkup'
  );
  expect(request?.body).toEqual({
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
    chat_id: 427770117,
    message_id: 66,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editMessageReplyMarkup shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editMessageReplyMarkup(
    {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
    {
      chatId: 427770117,
      messageId: 66,
    }
  );

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
    text: 'hi',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editMessageReplyMarkup'
  );
  expect(request?.body).toEqual({
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
    chat_id: 427770117,
    message_id: 66,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #stopPoll', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.stopPoll({
    chatId: 427770117,
    messageId: 66,
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
    id: '6107039600482451458',
    question: 'q',
    options: [
      {
        text: 'a',
        voterCount: 1,
      },
      {
        text: 'b',
        voterCount: 0,
      },
    ],
    isClosed: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/stopPoll'
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

it('should support #stopPoll shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.stopPoll(427770117, 66, {
    replyMarkup: {
      inlineKeyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });

  expect(res).toEqual({
    id: '6107039600482451458',
    question: 'q',
    options: [
      {
        text: 'a',
        voterCount: 1,
      },
      {
        text: 'b',
        voterCount: 0,
      },
    ],
    isClosed: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/stopPoll'
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

it('should support #deleteMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteMessage({
    chatId: 427770117,
    messageId: 66,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 66,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteMessage(427770117, 66);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 66,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
