import MockAdapter from 'axios-mock-adapter';

import SlackWebhookClient from '../SlackWebhookClient';

const URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ';

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

  describe('create axios with webhook url', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      SlackWebhookClient.connect({
        url: URL,
      });

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
        headers: { 'Content-Type': 'application/json' },
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
      SlackWebhookClient.connect(URL);

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
        headers: { 'Content-Type': 'application/json' },
      });
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

  describe('create axios with with webhook url', () => {
    it('with args', () => {
      axios.create = jest.fn().mockReturnValue({
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
      });
      new SlackWebhookClient(URL); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
        headers: { 'Content-Type': 'application/json' },
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
      new SlackWebhookClient({
        url: URL,
      });

      expect(axios.create).toBeCalledWith({
        baseURL:
          'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new SlackWebhookClient(URL);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#onRequest', () => {
  it('should call onRequest when calling any API', async () => {
    const onRequest = jest.fn();
    const client = new SlackWebhookClient({
      url: URL,
      onRequest,
    });

    const mock = new MockAdapter(client.axios);

    mock.onPost('/path').reply(200, {});

    await client.axios.post('/path', { x: 1 });

    expect(onRequest).toBeCalledWith({
      method: 'post',
      url: 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ/path',
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
