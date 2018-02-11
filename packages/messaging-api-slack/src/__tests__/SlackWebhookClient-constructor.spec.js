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
