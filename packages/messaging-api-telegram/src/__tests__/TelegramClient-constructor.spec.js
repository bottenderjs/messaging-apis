import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  describe('create axios with Telegram API', () => {
    it('with args', () => {
      axios.create = jest.fn();
      TelegramClient.connect(ACCESS_TOKEN);

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
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
    axios.create = jest.fn();
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
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  describe('create axios with Telegram API', () => {
    it('with args', () => {
      axios.create = jest.fn();
      new TelegramClient(ACCESS_TOKEN); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
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
    axios.create = jest.fn();
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
    let client = new TelegramClient(ACCESS_TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();

    client = new TelegramClient({ accessToken: ACCESS_TOKEN });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    let client = new TelegramClient(ACCESS_TOKEN);
    expect(client.accessToken).toBe(ACCESS_TOKEN);

    client = new TelegramClient({ accessToken: ACCESS_TOKEN });
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});
