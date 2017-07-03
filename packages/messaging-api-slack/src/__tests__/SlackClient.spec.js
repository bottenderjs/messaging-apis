import MockAdapter from 'axios-mock-adapter';

import SlackClient from '../SlackClient';

const URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ';

const createMock = () => {
  const client = new SlackClient(URL);
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

  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    SlackClient.connect(URL);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
      headers: { 'Content-Type': 'application/json' },
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

  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    new SlackClient(URL); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new SlackClient(URL);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('sendRawBody', () => {
  it('should call messages api', async () => {
    const { client, mock } = createMock();

    const reply = 'ok';

    mock
      .onPost('', {
        text: 'hello',
      })
      .reply(200, reply);

    const res = await client.sendRawBody({
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });
});

describe('sendText', () => {
  it('should call messages api', async () => {
    const { client, mock } = createMock();

    const reply = 'ok';

    mock
      .onPost('', {
        text: 'hello',
      })
      .reply(200, reply);

    const res = await client.sendText('hello');

    expect(res).toEqual(reply);
  });
});

describe('sendAttachments', () => {
  it('should call messages api', async () => {
    const { client, mock } = createMock();

    const reply = 'ok';

    mock
      .onPost('', {
        attachments: [{ fallback: 'aaa' }, { fallback: 'bbb' }],
      })
      .reply(200, reply);

    const res = await client.sendAttachments([
      { fallback: 'aaa' },
      { fallback: 'bbb' },
    ]);

    expect(res).toEqual(reply);
  });
});

describe('sendAttachment', () => {
  it('should call messages api', async () => {
    const { client, mock } = createMock();

    const reply = 'ok';

    mock
      .onPost('', {
        attachments: [{ fallback: 'aaa' }],
      })
      .reply(200, reply);

    const res = await client.sendAttachment({ fallback: 'aaa' });

    expect(res).toEqual(reply);
  });
});
