import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

describe('#createSubscription', () => {
  it('should set default fields', async () => {
    const messenger = new MessengerClient({
      accessToken: constants.ACCESS_TOKEN,
    });

    const reply = {
      success: true,
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await messenger.createSubscription({
      appId: '54321',
      callbackUrl: 'https://mycallback.com',
      verifyToken: '1234567890',
      accessToken: APP_ACCESS_TOKEN,
    });

    expect(url).toEqual(
      `/${APP_ID}/subscriptions?access_token=${APP_ACCESS_TOKEN}`
    );
    expect(JSON.parse(data)).toEqual({
      object: 'page',
      callback_url: 'https://mycallback.com',
      fields:
        'messages,messaging_postbacks,messaging_optins,messaging_referrals,messaging_handovers,messaging_policy_enforcement',
      verify_token: '1234567890',
    });

    expect(res).toEqual(reply);
  });

  it('should set other optional parameters', async () => {
    const messenger = new MessengerClient({
      accessToken: constants.ACCESS_TOKEN,
    });

    const reply = {
      success: true,
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await messenger.createSubscription({
      appId: '54321',
      callbackUrl: 'https://mycallback.com',
      verifyToken: '1234567890',
      object: 'user',
      fields: ['messages', 'messaging_postbacks'],
      includeValues: true,
      accessToken: APP_ACCESS_TOKEN,
    });

    expect(url).toEqual(
      `/${APP_ID}/subscriptions?access_token=${APP_ACCESS_TOKEN}`
    );
    expect(JSON.parse(data)).toEqual({
      object: 'user',
      callback_url: 'https://mycallback.com',
      fields: 'messages,messaging_postbacks',
      verify_token: '1234567890',
      include_values: true,
    });

    expect(res).toEqual(reply);
  });
});

describe('#getSubscriptions', () => {
  it('should get current subscriptions', async () => {
    const messenger = new MessengerClient({
      accessToken: constants.ACCESS_TOKEN,
    });

    const reply = {
      data: [
        {
          object: 'page',
          callback_url: 'https://mycallback.com',
          active: true,
          fields: [
            {
              name: 'messages',
              version: 'v2.12',
            },
          ],
        },
      ],
    };

    let url;
    mock.onGet().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    const res = await messenger.getSubscriptions();

    expect(url).toEqual(
      `/${APP_ID}/subscriptions?access_token=${APP_ID}|${APP_SECRET}`
    );

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
  });
});

describe('#getPageSubscription', () => {
  it('should get current page subscription', async () => {
    const messenger = new MessengerClient({
      accessToken: constants.ACCESS_TOKEN,
    });

    const reply = {
      data: [
        {
          object: 'page',
          callback_url: 'https://mycallback.com',
          active: true,
          fields: [
            {
              name: 'messages',
              version: 'v2.12',
            },
          ],
        },
        {
          object: 'user',
          callback_url: 'https://mycallback.com',
          active: true,
          fields: [
            {
              name: 'feed',
              version: 'v2.12',
            },
          ],
        },
      ],
    };

    let url;
    mock.onGet().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    const res = await messenger.getPageSubscription();

    expect(url).toEqual(
      `/${APP_ID}/subscriptions?access_token=${APP_ID}|${APP_SECRET}`
    );

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
  });
});
