import { rest } from 'msw';

import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

const telegramServer = setupTelegramServer();

it('should support origin', async () => {
  telegramServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({ ok: true }));
    })
  );

  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
    origin: 'https://mydummytestserver.com',
  });

  await telegram.getMe();

  expect(getCurrentContext().request?.url.href).toBe(
    'https://mydummytestserver.com/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMe'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
    onRequest,
  });

  await telegram.getMe();

  expect(onRequest).toBeCalledWith({
    body: {},
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: 'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMe',
  });
});

it('should support #getMe', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getMe();

  expect(res).toEqual({
    id: 313534466,
    isBot: true,
    firstName: 'Bot',
    username: 'a_bot',
    canJoinGroups: true,
    canReadAllGroupMessages: true,
    supportsInlineQueries: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMe'
  );
  expect(request?.body).toEqual({});
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #logOut', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.logOut();

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/logOut'
  );
  expect(request?.body).toEqual({});
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #close', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.close();

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/close'
  );
  expect(request?.body).toEqual({});
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getUserProfilePhotos', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getUserProfilePhotos({
    userId: 313534466,
    offset: 0,
    limit: 2,
  });

  expect(res).toEqual({
    totalCount: 3,
    photos: [
      [
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
      [
        {
          fileId: 'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
          fileSize: 14220,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
          fileSize: 35122,
          width: 320,
          height: 320,
        },
        {
          fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          fileSize: 106356,
          width: 640,
          height: 640,
        },
      ],
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getUserProfilePhotos'
  );
  expect(request?.body).toEqual({
    user_id: 313534466,
    offset: 0,
    limit: 2,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getUserProfilePhotos shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getUserProfilePhotos(313534466, {
    offset: 0,
    limit: 2,
  });

  expect(res).toEqual({
    totalCount: 3,
    photos: [
      [
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
      [
        {
          fileId: 'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
          fileSize: 14220,
          width: 160,
          height: 160,
        },
        {
          fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
          fileSize: 35122,
          width: 320,
          height: 320,
        },
        {
          fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
          fileSize: 106356,
          width: 640,
          height: 640,
        },
      ],
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getUserProfilePhotos'
  );
  expect(request?.body).toEqual({
    user_id: 313534466,
    offset: 0,
    limit: 2,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getFile', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getFile({
    fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
  });

  expect(res).toEqual({
    fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
    fileSize: 106356,
    filePath: 'photos/1068230105874016297.jpg',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getFile'
  );
  expect(request?.body).toEqual({
    file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getFile shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getFile(
    'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
  );

  expect(res).toEqual({
    fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
    fileSize: 106356,
    filePath: 'photos/1068230105874016297.jpg',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getFile'
  );
  expect(request?.body).toEqual({
    file_id: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getFileLink', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getFileLink(
    'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2'
  );

  expect(res).toEqual(
    `https://api.telegram.org/file/bot${constants.ACCESS_TOKEN}/photos/1068230105874016297.jpg`
  );
});

describe('Error', () => {
  it('should format correctly', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: false,
      error_code: 404,
      description: 'Not Found',
    };

    mock.onAny().reply(400, reply);

    let error;
    try {
      await client.sendMessage(427770117, 'hi');
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual('Telegram API - 404 Not Found');
  });
});
