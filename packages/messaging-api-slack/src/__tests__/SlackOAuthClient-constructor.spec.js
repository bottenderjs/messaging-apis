import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';

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

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new SlackOAuthClient(TOKEN);
    const http = client.axios;
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new SlackOAuthClient(TOKEN);
    expect(client.accessToken).toBe(TOKEN);
  });
});
