import WechatClient from '../WechatClient';

const APP_ID = 'APP_ID';
const APP_SECRET = 'APP_SECRET';

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

  it('create axios with WeChat API', () => {
    axios.create = jest.fn();
    WechatClient.connect(APP_ID, APP_SECRET);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.weixin.qq.com/cgi-bin/',
      headers: {
        'Content-Type': 'application/json',
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

  it('create axios with WeChat API', () => {
    axios.create = jest.fn();
    new WechatClient(APP_ID, APP_SECRET); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.weixin.qq.com/cgi-bin/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new WechatClient(APP_ID, APP_SECRET);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new WechatClient(APP_ID, APP_SECRET);
    expect(typeof client.accessToken).toBe('string');
  });
});
