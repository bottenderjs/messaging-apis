import LineClient from '../LineClient';

const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

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

  it('create axios with Line API', () => {
    axios.create = jest.fn();
    LineClient.connect(ACCESS_TOKEN, CHANNEL_SECRET);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.line.me/v2/bot/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
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

  it('create axios with Line API', () => {
    axios.create = jest.fn();
    new LineClient(ACCESS_TOKEN, CHANNEL_SECRET); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api.line.me/v2/bot/',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('Client instance', () => {
  it('prototype should be defined', () => {
    const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
    const sendTypes = ['reply', 'push', 'multicast'];
    const messageTypes = [
      'Text',
      'Image',
      'Video',
      'Audio',
      'Location',
      'Sticker',
      'Imagemap',
      'Template',
      'ButtonTemplate',
      'ConfirmTemplate',
      'CarouselTemplate',
      'ImageCarouselTemplate',
    ];
    sendTypes.forEach(sendType => {
      messageTypes.forEach(messageType => {
        expect(client[`${sendType}${messageType}`]).toBeDefined();
      });
    });
  });
});
