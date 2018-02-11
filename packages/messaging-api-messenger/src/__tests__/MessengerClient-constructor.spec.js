import MessengerClient from '../MessengerClient';

const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios'); // eslint-disable-line global-require
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

describe('connect', () => {
  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.11/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN, '2.6');

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('constructor', () => {
  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.11/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN, '2.6'); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('#version', () => {
  it('should return version of graph api', () => {
    expect(new MessengerClient(ACCESS_TOKEN).version).toEqual('2.11');
    expect(new MessengerClient(ACCESS_TOKEN, 'v2.6').version).toEqual('2.6');
    expect(new MessengerClient(ACCESS_TOKEN, '2.6').version).toEqual('2.6');
    expect(() => {
      // eslint-disable-next-line no-new
      new MessengerClient(ACCESS_TOKEN, 2.6);
    }).toThrow('Type of `version` must be string.');
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new MessengerClient(ACCESS_TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new MessengerClient(ACCESS_TOKEN);
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});
