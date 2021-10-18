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
