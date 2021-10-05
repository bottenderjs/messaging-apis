import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import LineNotify from '../LineNotify';

const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const REDIRECT_URI = 'https://example.com/callback';

const createMock = (): {
  client: LineNotify;
  mock: MockAdapter;
  apiMock: MockAdapter;
} => {
  const client = new LineNotify({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
  const mock = new MockAdapter(client.axios);
  const apiMock = new MockAdapter(client.apiAxios);
  return { client, mock, apiMock };
};

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

  it('create axios with LINE Notify API', () => {
    axios.create = jest.fn();
    // eslint-disable-next-line no-new
    new LineNotify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://notify-bot.line.me/',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://notify-api.line.me/',
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new LineNotify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
    });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
    expect(client.apiAxios.get).toBeDefined();
    expect(client.apiAxios.post).toBeDefined();
    expect(client.apiAxios.put).toBeDefined();
    expect(client.apiAxios.delete).toBeDefined();
  });
});

describe('#getAuthLink', () => {
  it('should work', async () => {
    const { client } = createMock();

    const result = client.getAuthLink('state');

    expect(result).toEqual(
      'https://notify-bot.line.me/oauth/authorize?scope=notify&response_type=code&client_id=client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=state'
    );
  });
});

describe('#getToken', () => {
  it('should work', async () => {
    const { client, mock } = createMock();

    const reply = {
      access_token: 'access_token',
    };

    const code = 'code';

    const body = {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    mock.onPost().reply((config) => {
      expect(config.url).toEqual('/oauth/token');
      expect(querystring.decode(config.data)).toEqual(body);
      expect(config.headers['Content-Type']).toEqual(headers['Content-Type']);
      return [200, reply];
    });

    const result = await client.getToken('code');

    expect(result).toEqual('access_token');
  });
});

describe('#getStatus', () => {
  it('should work', async () => {
    const { client, apiMock } = createMock();

    const reply = {
      status: 200,
      message: 'message',
      targetType: 'USER',
      target: 'user name',
    };

    const headers = {
      Authorization: `Bearer access_token`,
    };

    apiMock.onGet().reply((config) => {
      expect(config.url).toEqual('/api/status');
      expect(config.headers.Authorization).toEqual(headers.Authorization);
      return [200, reply];
    });

    const result = await client.getStatus('access_token');

    expect(result).toEqual(reply);
  });
});

describe('#sendNotify', () => {
  it('should work', async () => {
    const { client, apiMock } = createMock();

    const reply = {
      status: 200,
      message: 'message',
    };

    const body = querystring.encode({
      message: 'message',
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer access_token`,
    };

    apiMock.onPost().reply((config) => {
      expect(config.url).toEqual('/api/notify');
      expect(config.data).toEqual(body);
      expect(config.headers['Content-Type']).toEqual(headers['Content-Type']);
      expect(config.headers.Authorization).toEqual(headers.Authorization);
      return [200, reply];
    });

    const result = await client.sendNotify('access_token', 'message');

    expect(result).toEqual(reply);
  });
});

describe('#revokeToken', () => {
  it('should work', async () => {
    const { client, apiMock } = createMock();

    const reply = {
      status: 200,
      message: 'message',
    };

    const body = {};

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer access_token`,
    };

    apiMock.onPost().reply((config) => {
      expect(config.url).toEqual('/api/revoke');
      expect(JSON.parse(config.data)).toEqual(body);
      expect(config.headers['Content-Type']).toEqual(headers['Content-Type']);
      expect(config.headers.Authorization).toEqual(headers.Authorization);
      return [200, reply];
    });

    const result = await client.revokeToken('access_token');

    expect(result).toEqual(reply);
  });
});
