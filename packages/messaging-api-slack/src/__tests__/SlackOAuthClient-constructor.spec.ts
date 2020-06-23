import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';

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

  describe('create axios with slack api url', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      SlackOAuthClient.connect(TOKEN);

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://slack.com/api/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      SlackOAuthClient.connect({ accessToken: TOKEN });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://slack.com/api/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    SlackOAuthClient.connect({
      accessToken: TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  describe('create axios with with slack api url', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new SlackOAuthClient(TOKEN); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://slack.com/api/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new SlackOAuthClient({ accessToken: TOKEN }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://slack.com/api/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    new SlackOAuthClient({
      accessToken: TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    let client = new SlackOAuthClient(TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();

    client = new SlackOAuthClient({ accessToken: TOKEN });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    let client = new SlackOAuthClient(TOKEN);
    expect(client.accessToken).toBe(TOKEN);

    client = new SlackOAuthClient({ accessToken: TOKEN });
    expect(client.accessToken).toBe(TOKEN);
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new SlackOAuthClient({
      accessToken: TOKEN,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url: 'https://slack.com/api/path',
      body: {
        x: 1,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
      },
    });
  });
});
