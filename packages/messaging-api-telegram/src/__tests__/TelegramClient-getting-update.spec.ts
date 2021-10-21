import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #getUpdates', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getUpdates({
    offset: 9527,
    limit: 10,
    timeout: 0,
    allowedUpdates: [],
  });

  expect(res).toEqual([
    {
      updateId: 513400512,
      message: {
        messageId: 3,
        from: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
        },
        chat: {
          id: 313534466,
          firstName: 'first',
          lastName: 'last',
          username: 'username',
          type: 'private',
        },
        date: 1499402829,
        text: 'hi',
      },
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getUpdates'
  );
  expect(request?.body).toEqual({
    offset: 9527,
    limit: 10,
    timeout: 0,
    allowed_updates: [],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setWebhook', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setWebhook({
    url: 'https://4a16faff.ngrok.io/',
    ipAddress: '127.0.0.1',
    maxConnections: 40,
    allowedUpdates: ['message'],
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook'
  );
  expect(request?.body).toEqual({
    url: 'https://4a16faff.ngrok.io/',
    ip_address: '127.0.0.1',
    max_connections: 40,
    allowed_updates: ['message'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setWebhook shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setWebhook('https://4a16faff.ngrok.io/', {
    ipAddress: '127.0.0.1',
    maxConnections: 40,
    allowedUpdates: ['message'],
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook'
  );
  expect(request?.body).toEqual({
    url: 'https://4a16faff.ngrok.io/',
    ip_address: '127.0.0.1',
    max_connections: 40,
    allowed_updates: ['message'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteWebhook', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteWebhook({
    dropPendingUpdates: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteWebhook'
  );
  expect(request?.body).toEqual({
    drop_pending_updates: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getWebhookInfo', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getWebhookInfo();

  expect(res).toEqual({
    url: 'https://4a16faff.ngrok.io/',
    hasCustomCertificate: false,
    pendingUpdateCount: 0,
    maxConnections: 40,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getWebhookInfo'
  );
  expect(request?.body).toEqual({});
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
