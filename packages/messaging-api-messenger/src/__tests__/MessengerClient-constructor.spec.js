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
  describe('create axios with default graphAPI version', () => {
    it('with args', () => {
      axios.create = jest.fn();
      MessengerClient.connect(ACCESS_TOKEN);

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.11/',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
      MessengerClient.connect({ accessToken: ACCESS_TOKEN });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.11/',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('create axios with custom graphAPI version', () => {
    it('with args', () => {
      axios.create = jest.fn();
      MessengerClient.connect(ACCESS_TOKEN, '2.6');

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.6/',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
      MessengerClient.connect({ accessToken: ACCESS_TOKEN, version: '2.6' });

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.6/',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});

describe('constructor', () => {
  describe('create axios with default graphAPI version', () => {
    it('with args', () => {
      axios.create = jest.fn();
      new MessengerClient(ACCESS_TOKEN); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.11/',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
      new MessengerClient({ accessToken: ACCESS_TOKEN }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.11/',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('create axios with custom graphAPI version', () => {
    it('with args', () => {
      axios.create = jest.fn();
      new MessengerClient(ACCESS_TOKEN, '2.6'); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.6/',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('with config', () => {
      axios.create = jest.fn();
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }); // eslint-disable-line no-new

      expect(axios.create).toBeCalledWith({
        baseURL: 'https://graph.facebook.com/v2.6/',
        headers: { 'Content-Type': 'application/json' },
      });
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

    expect(new MessengerClient({ accessToken: ACCESS_TOKEN }).version).toEqual(
      '2.11'
    );
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 'v2.6' })
        .version
    ).toEqual('2.6');
    expect(
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: '2.6' }).version
    ).toEqual('2.6');
    expect(() => {
      // eslint-disable-next-line no-new
      new MessengerClient({ accessToken: ACCESS_TOKEN, version: 2.6 });
    }).toThrow('Type of `version` must be string.');
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    let client = new MessengerClient(ACCESS_TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();

    client = new MessengerClient({ accessToken: ACCESS_TOKEN });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    let client = new MessengerClient(ACCESS_TOKEN);
    expect(client.accessToken).toBe(ACCESS_TOKEN);

    client = new MessengerClient({ accessToken: ACCESS_TOKEN });
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});
