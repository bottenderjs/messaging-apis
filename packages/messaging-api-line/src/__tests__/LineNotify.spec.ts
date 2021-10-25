import qs from 'qs';

import LineNotify from '../LineNotify';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #getAuthLink', async () => {
  const lineNotify = new LineNotify({
    clientId: constants.NOTIFY_CLIENT_ID,
    clientSecret: constants.NOTIFY_CLIENT_SECRET,
    redirectUri: constants.NOTIFY_REDIRECT_URI,
  });

  const result = lineNotify.getAuthLink('state');

  expect(result).toEqual(
    'https://notify-bot.line.me/oauth/authorize?scope=notify&response_type=code&client_id=client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=state'
  );
});

it('should support #getToken', async () => {
  const lineNotify = new LineNotify({
    clientId: constants.NOTIFY_CLIENT_ID,
    clientSecret: constants.NOTIFY_CLIENT_SECRET,
    redirectUri: constants.NOTIFY_REDIRECT_URI,
  });

  const result = await lineNotify.getToken('code');

  expect(result).toEqual('access_token');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://notify-bot.line.me/oauth/token');
  expect(qs.parse(request?.body as string)).toEqual({
    client_id: 'client-id',
    client_secret: 'client-secret',
    code: 'code',
    grant_type: 'authorization_code',
    redirect_uri: 'https://example.com/callback',
  });
  expect(request?.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded'
  );
});

it('should support #getStatus', async () => {
  const lineNotify = new LineNotify({
    clientId: constants.NOTIFY_CLIENT_ID,
    clientSecret: constants.NOTIFY_CLIENT_SECRET,
    redirectUri: constants.NOTIFY_REDIRECT_URI,
  });

  const result = await lineNotify.getStatus('ACCESS_TOKEN');

  expect(result).toEqual({
    status: 200,
    message: 'message',
    targetType: 'USER',
    target: 'user name',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe('https://notify-api.line.me/api/status');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #sendNotify', async () => {
  const lineNotify = new LineNotify({
    clientId: constants.NOTIFY_CLIENT_ID,
    clientSecret: constants.NOTIFY_CLIENT_SECRET,
    redirectUri: constants.NOTIFY_REDIRECT_URI,
  });

  const result = await lineNotify.sendNotify('ACCESS_TOKEN', 'message');

  expect(result).toEqual({
    status: 200,
    message: 'message',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://notify-api.line.me/api/notify');
  expect(qs.parse(request?.body as string)).toEqual({
    message: 'message',
  });
  expect(request?.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded'
  );
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #revokeToken', async () => {
  const lineNotify = new LineNotify({
    clientId: constants.NOTIFY_CLIENT_ID,
    clientSecret: constants.NOTIFY_CLIENT_SECRET,
    redirectUri: constants.NOTIFY_REDIRECT_URI,
  });

  const result = await lineNotify.revokeToken('ACCESS_TOKEN');

  expect(result).toEqual({
    status: 200,
    message: 'message',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://notify-api.line.me/api/revoke');
  expect(request?.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded'
  );
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
