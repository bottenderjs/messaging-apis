import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #sendSticker', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.sendSticker(
    427770117,
    'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
    {
      disableNotification: true,
      replyToMessageId: 9527,
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
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/sendSticker'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    sticker: 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
    disable_notification: true,
    reply_to_message_id: 9527,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getStickerSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getStickerSet('sticker set name');

  expect(res).toEqual({
    name: 'sticker set name',
    title: 'sticker set title',
    isAnimated: false,
    containsMasks: false,
    stickers: [
      {
        width: 512,
        height: 512,
        emoji: '💛',
        setName: 'sticker set name',
        isAnimated: false,
        thumb: {
          fileId: 'AAQEAANDAQACEDVoAAFVA7aGNPt1If3eYTAABAEAB20AAzkOAAIWB',
          fileSize: 5706,
          width: 128,
          height: 128,
        },
        fileId: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
        fileSize: 36424,
      },
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getStickerSet'
  );
  expect(request?.body).toEqual({
    name: 'sticker set name',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it.todo('should support #uploadStickerFile');

it('should support #createNewStickerSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.createNewStickerSet(
    1,
    'sticker_set_name',
    'title',
    'https://example.com/sticker.png',
    '💛',
    {
      containsMasks: true,
      maskPosition: {
        point: 'eyes',
        xShift: 10,
        yShift: 10,
        scale: 1,
      },
    }
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/createNewStickerSet'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    name: 'sticker_set_name',
    title: 'title',
    png_sticker: 'https://example.com/sticker.png',
    emojis: '💛',
    contains_masks: true,
    mask_position: {
      point: 'eyes',
      x_shift: 10,
      y_shift: 10,
      scale: 1,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #addStickerToSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.addStickerToSet(
    1,
    'sticker_set_name',
    'https://example.com/sticker.png',
    '💛',
    {
      maskPosition: {
        point: 'eyes',
        xShift: 10,
        yShift: 10,
        scale: 1,
      },
    }
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/addStickerToSet'
  );
  expect(request?.body).toEqual({
    user_id: 1,
    name: 'sticker_set_name',
    png_sticker: 'https://example.com/sticker.png',
    emojis: '💛',
    mask_position: {
      point: 'eyes',
      x_shift: 10,
      y_shift: 10,
      scale: 1,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setStickerPositionInSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setStickerPositionInSet(
    'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
    0
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setStickerPositionInSet'
  );
  expect(request?.body).toEqual({
    sticker: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
    position: 0,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteStickerFromSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteStickerFromSet(
    'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB'
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteStickerFromSet'
  );
  expect(request?.body).toEqual({
    sticker: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it.todo('should support #setStickerSetThumb');
