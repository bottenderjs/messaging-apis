import ViberClient from '../ViberClient';

const AUTH_TOKEN = '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9';

const SENDER = {
  name: 'John McClane',
  avatar: 'http://avatar.example.com',
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
    ViberClient.connect(AUTH_TOKEN, SENDER);

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
    new ViberClient(AUTH_TOKEN, SENDER); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://chatapi.viber.com/pa/',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': AUTH_TOKEN,
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new ViberClient(AUTH_TOKEN, SENDER);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new ViberClient(AUTH_TOKEN, SENDER);
    expect(client.accessToken).toBe(AUTH_TOKEN);
  });
});
