import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

const APP_ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

setupMessengerServer();

it('should support #createSubscription', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appId: constants.APP_ID,
  });

  const res = await messenger.createSubscription({
    callbackUrl: 'https://mycallback.com',
    verifyToken: '1234567890',
    accessToken: APP_ACCESS_TOKEN,
  });

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/APP_ID/subscriptions?access_token=APP_ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe(
    'APP_ACCESS_TOKEN'
  );
  expect(request?.body).toEqual({
    object: 'page',
    callback_url: 'https://mycallback.com',
    fields:
      'messages,messaging_postbacks,messaging_optins,messaging_referrals,messaging_handovers,messaging_policy_enforcement',
    verify_token: '1234567890',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #createSubscription with options', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appId: constants.APP_ID,
  });

  const res = await messenger.createSubscription({
    callbackUrl: 'https://mycallback.com',
    verifyToken: '1234567890',
    object: 'user',
    fields: ['messages', 'messaging_postbacks'],
    includeValues: true,
    accessToken: APP_ACCESS_TOKEN,
  });

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/APP_ID/subscriptions?access_token=APP_ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe(
    'APP_ACCESS_TOKEN'
  );
  expect(request?.body).toEqual({
    object: 'user',
    callback_url: 'https://mycallback.com',
    fields: 'messages,messaging_postbacks',
    verify_token: '1234567890',
    include_values: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getSubscriptions', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
    skipAppSecretProof: true,
  });

  const res = await messenger.getSubscriptions();

  expect(res).toEqual([
    {
      object: 'page',
      callbackUrl: 'https://mycallback.com',
      active: true,
      fields: [
        {
          name: 'messages',
          version: 'v2.12',
        },
      ],
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/APP_ID/subscriptions?access_token=APP_ID%7CAPP_SECRET'
  );
  expect(request?.url.searchParams.get('access_token')).toBe(
    'APP_ID|APP_SECRET'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getPageSubscription', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
    skipAppSecretProof: true,
  });

  const res = await messenger.getPageSubscription();

  expect(res).toEqual({
    object: 'page',
    callbackUrl: 'https://mycallback.com',
    active: true,
    fields: [
      {
        name: 'messages',
        version: 'v2.12',
      },
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/APP_ID/subscriptions?access_token=APP_ID%7CAPP_SECRET'
  );
  expect(request?.url.searchParams.get('access_token')).toBe(
    'APP_ID|APP_SECRET'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
