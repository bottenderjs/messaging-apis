import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

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

  describe('create axios with Line API', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      LineClient.connect(ACCESS_TOKEN, CHANNEL_SECRET);

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.line.me/',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
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
      LineClient.connect({
        accessToken: ACCESS_TOKEN,
        channelSecret: CHANNEL_SECRET,
      });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.line.me/',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
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
    LineClient.connect({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
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

  describe('create axios with Line API', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new LineClient(ACCESS_TOKEN, CHANNEL_SECRET); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.line.me/',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
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
      // eslint-disable-next-line no-new
      new LineClient({
        accessToken: ACCESS_TOKEN,
        channelSecret: CHANNEL_SECRET,
      });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://api.line.me/',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
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
    new LineClient({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    let client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();

    client = new LineClient({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
    });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    let client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
    expect(client.accessToken).toBe(ACCESS_TOKEN);

    client = new LineClient({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
    });
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new LineClient({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url: 'https://api.line.me/path',
      body: {
        x: 1,
      },
      headers: {
        Authorization: 'Bearer 1234567890',
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
    });
  });
});

describe('Client instance', () => {
  it('prototype should be defined', () => {
    const sendTypes = ['reply', 'push', 'multicast'];
    const messageTypes = [
      'Text',
      'Image',
      'Video',
      'Audio',
      'Location',
      'Sticker',
      'Imagemap',
      'Template',
      'ButtonTemplate',
      'ConfirmTemplate',
      'CarouselTemplate',
      'ImageCarouselTemplate',
    ];

    let client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);

    sendTypes.forEach(sendType => {
      messageTypes.forEach(messageType => {
        expect(client[`${sendType}${messageType}`]).toBeDefined();
      });
    });

    client = new LineClient({
      accessToken: ACCESS_TOKEN,
      channelSecret: CHANNEL_SECRET,
    });

    sendTypes.forEach(sendType => {
      messageTypes.forEach(messageType => {
        expect(client[`${sendType}${messageType}`]).toBeDefined();
      });
    });
  });
});
