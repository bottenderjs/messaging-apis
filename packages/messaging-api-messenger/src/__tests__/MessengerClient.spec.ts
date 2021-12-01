import MockAdapter from 'axios-mock-adapter';

import { MessengerClient } from '..';

const APP_SECRET = 'shhhhh!is.my.secret';
const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const APP_ID = '987654321';
const APP_ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

const createMock = (): { client: MessengerClient; mock: MockAdapter } => {
  const client = new MessengerClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
    accessToken: ACCESS_TOKEN,
    skipAppSecretProof: true,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

describe('create axios with custom graphAPI version', () => {
  it('with config', () => {
    axios.create = jest.fn().mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    });
    new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith(
      expect.objectContaining({
        baseURL: 'https://graph.facebook.com/v2.6/',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

it('support origin', () => {
  axios.create = jest.fn().mockReturnValue({
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  });
  // eslint-disable-next-line no-new
  new MessengerClient({
    accessToken: ACCESS_TOKEN,
    origin: 'https://mydummytestserver.com',
  });

  expect(axios.create).toBeCalledWith(
    expect.objectContaining({
      baseURL: 'https://mydummytestserver.com/v12.0/',
      headers: { 'Content-Type': 'application/json' },
    })
  );
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url: 'https://graph.facebook.com/v12.0/path',
      body: {
        x: 1,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
    });
  });
});

describe('appsecret proof', () => {
  it('should add appsecret proof to requests if appSecret exists', async () => {
    expect.assertions(1);

    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      appSecret: APP_SECRET,
    });

    const mock = new MockAdapter(client.axios);

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    mock.onPost().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    await client.sendText(USER_ID, 'Hello!');

    expect(url).toEqual(
      '/me/messages?access_token=1234567890&appsecret_proof=3bc2e128de403f2dcd7e65f6f421be02b1fac2ce620df1e32c4b923970cb9551'
    );
  });

  it('should not add appsecret proof to requests if skipAppSecretProof: true', async () => {
    expect.assertions(1);

    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      appSecret: APP_SECRET,
      skipAppSecretProof: true,
    });

    const mock = new MockAdapter(client.axios);

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    mock.onPost().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    await client.sendText(USER_ID, 'Hello!');

    expect(url).toEqual('/me/messages?access_token=1234567890');
  });
});

describe('#getPageInfo', () => {
  it('should respond page info', async () => {
    const { client, mock } = createMock();
    const reply = {
      name: 'Bot Demo',
      id: '1895382890692546',
    };

    let url;
    let params;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      return [200, reply];
    });

    const res = await client.getPageInfo();

    expect(url).toEqual('/me');
    expect(params).toEqual({
      access_token: ACCESS_TOKEN,
      fields: undefined,
    });

    expect(res).toEqual(reply);
  });
});

it('should support fields', async () => {
  const { client, mock } = createMock();
  const reply = {
    name: 'Bot Demo',
    id: '1895382890692546',
  };

  let url;
  let params;
  mock.onGet().reply((config) => {
    url = config.url;
    params = config.params;
    return [200, reply];
  });

  const res = await client.getPageInfo({
    fields: ['id', 'name'],
  });

  expect(url).toEqual('/me');
  expect(params).toEqual({
    access_token: ACCESS_TOKEN,
    fields: 'id,name',
  });
  expect(res).toEqual(reply);
});

describe('#debugToken', () => {
  it('should respond token info', async () => {
    expect.assertions(3);

    const { client, mock } = createMock();

    const reply = {
      data: {
        app_id: '000000000000000',
        application: 'Social Cafe',
        expires_at: 1352419328,
        is_valid: true,
        issued_at: 1347235328,
        scopes: ['email', 'user_location'],
        user_id: 1207059,
      },
    };

    let url;
    let params;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      return [200, reply];
    });

    const res = await client.debugToken();

    expect(url).toEqual('/debug_token');
    expect(params).toEqual({
      input_token: ACCESS_TOKEN,
      access_token: `${APP_ID}|${APP_SECRET}`,
    });

    expect(res).toEqual({
      appId: '000000000000000',
      application: 'Social Cafe',
      expiresAt: 1352419328,
      isValid: true,
      issuedAt: 1347235328,
      scopes: ['email', 'user_location'],
      userId: 1207059,
    });
  });
});

describe('#getMessagingFeatureReview', () => {
  it('should respond feature array', async () => {
    const { client, mock } = createMock();
    const reply = {
      data: [
        {
          feature: 'subscription_messaging',
          status: 'approved',
        },
      ],
    };

    let url;
    mock.onGet().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    const res = await client.getMessagingFeatureReview();

    expect(url).toEqual(
      `/me/messaging_feature_review?access_token=${ACCESS_TOKEN}`
    );

    expect(res).toEqual([
      {
        feature: 'subscription_messaging',
        status: 'approved',
      },
    ]);
  });
});

it('should be formatted correctly', async () => {
  const { client, mock } = createMock();

  const reply = {
    error: {
      message: 'Invalid OAuth access token.',
      type: 'OAuthException',
      code: 190,
      error_subcode: 1234567,
      fbtrace_id: 'BLBz/WZt8dN',
    },
  };

  mock.onAny().reply(400, reply);

  let error;
  try {
    await client.sendText(USER_ID, 'Hello!');
  } catch (err) {
    error = err;
  }

  expect(error.message).toEqual(
    'Messenger API - 190 OAuthException Invalid OAuth access token.'
  );
});
