import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

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

  describe('create axios with Telegram API', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      TelegramClient.connect({ accessToken: ACCESS_TOKEN });

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
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
    TelegramClient.connect({
      accessToken: ACCESS_TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL:
        'https://mydummytestserver.com/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
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

  describe('create axios with Telegram API', () => {
    it('with config', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new TelegramClient({ accessToken: ACCESS_TOKEN }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
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
    new TelegramClient({
      accessToken: ACCESS_TOKEN,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL:
        'https://mydummytestserver.com/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new TelegramClient({ accessToken: ACCESS_TOKEN });

    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });

  it('should throw error when ok is false', async () => {
    const { client, mock } = createMock();
    const reply = {
      ok: false,
      description: 'Delete webhook failed',
    };

    mock.onPost('/deleteWebhook').reply(200, reply);

    expect(client.deleteWebhook().then).toThrow();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new TelegramClient({ accessToken: ACCESS_TOKEN });

    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new TelegramClient({
      accessToken: ACCESS_TOKEN,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url:
        'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/path',
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
