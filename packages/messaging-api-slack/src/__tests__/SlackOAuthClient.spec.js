import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';
const CHANNEL = 'C1234567890';

const createMock = () => {
  const client = new SlackOAuthClient(TOKEN);
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

  it('create axios with slack api url', () => {
    axios.create = jest.fn();
    SlackOAuthClient.connect(TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://slack.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  it('create axios with with slack api url', () => {
    axios.create = jest.fn();
    new SlackOAuthClient(TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://slack.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new SlackOAuthClient(TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('#postMessage', () => {
  it('should call chat.postMessage with channel and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello');

    expect(res).toEqual(reply);
  });
});
