import MockAdapter from 'axios-mock-adapter';

import WechatClient from '../WechatClient';

const APP_ID = 'APP_ID';
const APP_SECRET = 'APP_SECRET';

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios');
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  describe('create axios with WeChat API', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      // eslint-disable-next-line no-new
      new WechatClient({ appId: APP_ID, appSecret: APP_SECRET });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.weixin.qq.com/cgi-bin/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
    new WechatClient({
      appId: APP_ID,
      appSecret: APP_SECRET,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/cgi-bin/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios');
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  describe('create axios with WeChat API', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new WechatClient({ appId: APP_ID, appSecret: APP_SECRET }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.weixin.qq.com/cgi-bin/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
    new WechatClient({
      appId: APP_ID,
      appSecret: APP_SECRET,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/cgi-bin/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new WechatClient({ appId: APP_ID, appSecret: APP_SECRET });

    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new WechatClient({ appId: APP_ID, appSecret: APP_SECRET });

    expect(typeof client.accessToken).toBe('string');
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new WechatClient({
      appId: APP_ID,
      appSecret: APP_SECRET,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url: 'https://api.weixin.qq.com/cgi-bin/path',
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
