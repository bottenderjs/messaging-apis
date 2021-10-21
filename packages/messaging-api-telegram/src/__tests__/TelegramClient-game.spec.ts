import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #sendGame', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendGame({
    chatId: 427770117,
    gameShortName: 'Mario Bros.',
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
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
    game: {
      title: 'Mario Bros.',
      description: 'Mario Bros. is fun!',
      photo: [
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
          fileSize: 14650,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
          fileSize: 39019,
          width: 320,
          height: 320,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
          fileSize: 132470,
          width: 640,
          height: 640,
        },
      ],
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendGame'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    game_short_name: 'Mario Bros.',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendGame shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendGame(427770117, 'Mario Bros.', {
    disableNotification: true,
    replyToMessageId: 9527,
    allowSendingWithoutReply: true,
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
    game: {
      title: 'Mario Bros.',
      description: 'Mario Bros. is fun!',
      photo: [
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
          fileSize: 14650,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
          fileSize: 39019,
          width: 320,
          height: 320,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
          fileSize: 132470,
          width: 640,
          height: 640,
        },
      ],
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendGame'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    game_short_name: 'Mario Bros.',
    disable_notification: true,
    reply_to_message_id: 9527,
    allow_sending_without_reply: true,
    reply_markup: {
      inline_keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setGameScore', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setGameScore({
    userId: 1,
    score: 999,
    force: true,
    disableEditMessage: true,
    messageId: 9527,
    chatId: 427770117,
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
    game: {
      title: 'Mario Bros.',
      description: 'Mario Bros. is fun!',
      photo: [
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
          fileSize: 14650,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
          fileSize: 39019,
          width: 320,
          height: 320,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
          fileSize: 132470,
          width: 640,
          height: 640,
        },
      ],
      text: 'User 427770117 score is 999.',
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setGameScore'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    score: 999,
    force: true,
    disable_edit_message: true,
    message_id: 9527,
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setGameScore shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setGameScore(1, 999, {
    force: true,
    disableEditMessage: true,
    messageId: 9527,
    chatId: 427770117,
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
    game: {
      title: 'Mario Bros.',
      description: 'Mario Bros. is fun!',
      photo: [
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
          fileSize: 14650,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
          fileSize: 39019,
          width: 320,
          height: 320,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
          fileSize: 132470,
          width: 640,
          height: 640,
        },
      ],
      text: 'User 427770117 score is 999.',
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setGameScore'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    score: 999,
    force: true,
    disable_edit_message: true,
    message_id: 9527,
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGameHighScores', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getGameHighScores({
    userId: 1,
    chatId: 427770117,
    messageId: 9527,
  });

  expect(res).toEqual([
    {
      position: 1,
      user: {
        id: 427770117,
        isBot: false,
        firstName: 'first',
      },
      score: 999,
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getGameHighScores'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    chat_id: 427770117,
    message_id: 9527,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGameHighScores shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getGameHighScores(1, {
    chatId: 427770117,
    messageId: 9527,
  });

  expect(res).toEqual([
    {
      position: 1,
      user: {
        id: 427770117,
        isBot: false,
        firstName: 'first',
      },
      score: 999,
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getGameHighScores'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    chat_id: 427770117,
    message_id: 9527,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
