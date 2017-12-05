import MockAdapter from 'axios-mock-adapter';

import SlackWebhookClient from '../SlackWebhookClient';

const URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ';

const createMock = () => {
  const client = new SlackWebhookClient(URL);
  const mock = new MockAdapter(client.axios);
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

  it('create axios with webhook url', () => {
    axios.create = jest.fn();
    SlackWebhookClient.connect(URL);

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

  it('create axios with with webhook url', () => {
    axios.create = jest.fn();
    new SlackWebhookClient(URL); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
      headers: { 'Content-Type': 'application/json' },
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
