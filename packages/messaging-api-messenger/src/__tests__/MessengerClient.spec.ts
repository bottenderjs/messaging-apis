import { rest } from 'msw';

import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

const messengerServer = setupMessengerServer();

it('should support version', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    version: '10.0',
  });

  await messenger.sendText(constants.USER_ID, 'Hello!');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v10.0/me/messages?access_token=ACCESS_TOKEN'
  );
});

it('should support origin', async () => {
  messengerServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    origin: 'https://mydummytestserver.com',
  });

  await messenger.sendText(constants.USER_ID, 'Hello!');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.href).toBe(
    'https://mydummytestserver.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    onRequest,
  });

  await messenger.sendText(constants.USER_ID, 'Hello!');

  expect(onRequest).toBeCalledWith({
    method: 'post',
    url: 'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN',
    body: {
      message: {
        text: 'Hello!',
      },
      messagingType: 'UPDATE',
      recipient: {
        id: 'USER_ID',
      },
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
});

it('should support appsecret proof if appSecret exists', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appSecret: constants.APP_SECRET,
  });

  await messenger.sendText(constants.USER_ID, 'Hello!');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.searchParams.get('appsecret_proof')).toBe(
    'a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c'
  );
});

it('should not add appsecret proof to requests if skipAppSecretProof is true', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appSecret: constants.APP_SECRET,
    skipAppSecretProof: true,
  });

  await messenger.sendText(constants.USER_ID, 'Hello!');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.url.searchParams.get('appsecret_proof')).toBeNull();
});

it('should support #getPageInfo', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getPageInfo();

  expect(res).toEqual({
    name: 'Bot Demo',
    id: '1895382890692546',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getPageInfo with custom fields', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getPageInfo({
    fields: ['id', 'name'],
  });

  expect(res).toEqual({
    name: 'Bot Demo',
    id: '1895382890692546',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me?access_token=ACCESS_TOKEN&fields=id,name'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.url.searchParams.get('fields')).toBe('id,name');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #debugToken', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
    skipAppSecretProof: true,
  });

  const res = await messenger.debugToken();

  expect(res).toEqual({
    appId: '000000000000000',
    application: 'Social Cafe',
    expiresAt: 1352419328,
    isValid: true,
    issuedAt: 1347235328,
    scopes: ['email', 'user_location'],
    userId: 1207059,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/debug_token?input_token=ACCESS_TOKEN&access_token=APP_ID%7CAPP_SECRET'
  );
  expect(request?.url.searchParams.get('access_token')).toBe(
    'APP_ID|APP_SECRET'
  );
  expect(request?.url.searchParams.get('input_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getMessagingFeatureReview', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getMessagingFeatureReview();

  expect(res).toEqual([
    {
      feature: 'subscription_messaging',
      status: 'approved',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messaging_feature_review?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should handle errors', async () => {
  messengerServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Invalid OAuth access token.',
            type: 'OAuthException',
            code: 190,
            error_subcode: 1234567,
            fbtrace_id: 'BLBz/WZt8dN',
          },
        })
      );
    })
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  await expect(
    messenger.sendText(constants.USER_ID, 'Hello!')
  ).rejects.toThrowError(
    'Messenger API - 190 OAuthException Invalid OAuth access token.'
  );
});
