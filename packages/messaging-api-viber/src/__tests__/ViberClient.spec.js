import MockAdapter from 'axios-mock-adapter';

import ViberClient from '../ViberClient';

const AUTH_TOKEN = '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9';

const createMock = () => {
  const client = new ViberClient(AUTH_TOKEN);
  const mock = new MockAdapter(client.getHTTPClient());
  return { client, mock };
};

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

  it('create axios with Viber API', () => {
    axios.create = jest.fn();
    ViberClient.connect(AUTH_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://chatapi.viber.com/pa/',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': AUTH_TOKEN,
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

  it('create axios with Viber API', () => {
    axios.create = jest.fn();
    new ViberClient(AUTH_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://chatapi.viber.com/pa/',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': AUTH_TOKEN,
      },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new ViberClient(AUTH_TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('webhooks', () => {
  describe('#setWebhook', () => {
    it('should response event_types was set', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
        event_types: [
          'delivered',
          'seen',
          'failed',
          'subscribed',
          'unsubscribed',
          'conversation_started',
        ],
      };

      mock
        .onPost('/set_webhook', { url: 'https://4a16faff.ngrok.io/' })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(reply);
    });

    it('should work with custom event types', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
        event_types: ['delivered', 'seen', 'conversation_started'],
      };

      mock
        .onPost('/set_webhook', {
          url: 'https://4a16faff.ngrok.io/',
          event_types: ['delivered', 'seen', 'conversation_started'],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', [
        'delivered',
        'seen',
        'conversation_started',
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#removeWebhook', () => {
    it('should remove subscribed webhook', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
      };

      mock.onPost('/set_webhook', { url: '' }).reply(200, reply);

      const res = await client.removeWebhook();

      expect(res).toEqual(reply);
    });
  });
});
