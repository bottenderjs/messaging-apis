import LineClient from '../LineClient';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #createLiffApp', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createLiffApp({
    view: {
      type: 'full',
      url: 'https://example.com/myservice',
    },
    description: 'Service Example',
    features: {
      ble: true,
    },
    permanentLinkPattern: 'concat',
  });

  expect(res).toEqual({
    liffId: 'liff-12345',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/liff/v1/apps');
  expect(request?.body).toEqual({
    view: {
      type: 'full',
      url: 'https://example.com/myservice',
    },
    description: 'Service Example',
    features: {
      ble: true,
    },
    permanentLinkPattern: 'concat',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #updateLiffApp', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.updateLiffApp('liff-12345', {
    view: {
      url: 'https://new.example.com',
    },
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe('https://api.line.me/liff/v1/apps/liff-12345');
  expect(request?.body).toEqual({
    view: {
      url: 'https://new.example.com',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getLiffAppList', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getLiffAppList();

  expect(res).toEqual([
    {
      liffId: 'liff-12345',
      view: {
        type: 'full',
        url: 'https://example.com/myservice',
      },
    },
    {
      liffId: 'liff-67890',
      view: {
        type: 'tall',
        url: 'https://example.com/myservice2',
      },
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe('https://api.line.me/liff/v1/apps');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #deleteLiffApp', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.deleteLiffApp('liff-12345');

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe('https://api.line.me/liff/v1/apps/liff-12345');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
