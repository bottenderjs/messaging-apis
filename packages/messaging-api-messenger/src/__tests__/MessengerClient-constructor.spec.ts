import MockAdapter from 'axios-mock-adapter';

import MessengerBatch from '../MessengerBatch';
import MessengerClient from '../MessengerClient';

const ACCESS_TOKEN = 'foo_token';
const APP_SECRET = 'shhhhh!is.my.secret';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

describe('connect', () => {
  describe('create axios with default graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      MessengerClient.connect({ accessToken: ACCESS_TOKEN });

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v6.0/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
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
      MessengerClient.connect({ accessToken: ACCESS_TOKEN, version: '2.6' });

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
    MessengerClient.connect({
      accessToken: ACCESS_TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith(
      expect.objectContaining({
        baseURL: 'https://mydummytestserver.com/v6.0/',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

describe('constructor', () => {
  describe('create axios with default graphAPI version', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new MessengerClient({ accessToken: ACCESS_TOKEN }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith(
        expect.objectContaining({
          baseURL: 'https://graph.facebook.com/v6.0/',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
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
        baseURL: 'https://mydummytestserver.com/v6.0/',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

describe('#version', () => {
  it('should return version of graph api', () => {
    expect(new MessengerClient({ accessToken: ACCESS_TOKEN }).version).toEqual(
      '6.0'
    );
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 'v2.6' })
        .version
    ).toEqual('2.6');
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }).version
    ).toEqual('2.6');
    expect(() => {
      // eslint-disable-next-line no-new
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 2.6 } as any);
    }).toThrow('Type of `version` must be string.');
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new MessengerClient({ accessToken: ACCESS_TOKEN });

    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new MessengerClient({ accessToken: ACCESS_TOKEN });

    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('#appSecret', () => {
  it('should return underlying appSecret', () => {
    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      appSecret: APP_SECRET,
    });

    expect(client.appSecret).toEqual(APP_SECRET);
  });
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
      url: 'https://graph.facebook.com/v6.0/path',
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

    const USER_ID = 'USER_ID';

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
      '/me/messages?access_token=foo_token&appsecret_proof=796ba0d8a6b339e476a7b166a9e8ac0a395f7de736dc37de5f2f4397f5854eb8'
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

    const USER_ID = 'USER_ID';

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

    expect(url).toEqual('/me/messages?access_token=foo_token');
  });

  it('should add appsecret proof to batch requests if appSecret exists', async () => {
    expect.assertions(2);

    const client = new MessengerClient({
      accessToken: ACCESS_TOKEN,
      appSecret: APP_SECRET,
    });

    const mock = new MockAdapter(client.axios);

    const USER_ID = 'USER_ID';

    const reply = [
      {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      },
      {
        id: USER_ID,
        first_name: 'Kevin',
        last_name: 'Durant',
        profile_pic: 'https://example.com/pic.png',
      },
    ];

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const batch = [
      MessengerBatch.sendText(USER_ID, 'Hello', { accessToken: 'token1' }),
      MessengerBatch.getUserProfile(USER_ID, { accessToken: 'token2' }),
    ];

    await client.sendBatch(batch);

    expect(url).toEqual(
      '/?appsecret_proof=796ba0d8a6b339e476a7b166a9e8ac0a395f7de736dc37de5f2f4397f5854eb8'
    );
    expect(JSON.parse(data)).toEqual({
      access_token: ACCESS_TOKEN,
      batch: [
        {
          method: 'POST',
          relative_url:
            'me/messages?appsecret_proof=99eed1703c01487bce54ccf12b7e8007880e3bf7f3820656f17f200b5c976266',
          body: `messaging_type=UPDATE&recipient=%7B%22id%22%3A%22${USER_ID}%22%7D&message=%7B%22text%22%3A%22Hello%22%7D&access_token=token1`,
        },
        {
          method: 'GET',
          relative_url:
            'USER_ID?fields=id%2Cname%2Cfirst_name%2Clast_name%2Cprofile_pic&access_token=token2&appsecret_proof=f1405d923148b8e76e002138a7adddfec6ce4075712095d88b4b4b6777ad45e5',
        },
      ],
    });
  });
});
