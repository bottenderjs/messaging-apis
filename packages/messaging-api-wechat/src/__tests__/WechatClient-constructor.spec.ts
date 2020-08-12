import MockAdapter from 'axios-mock-adapter';

import WechatClient from '../WechatClient';

const APP_ID = 'APP_ID';
const APP_SECRET = 'APP_SECRET';

it('should support using connect to create client', () => {
  const client = WechatClient.connect({ appId: APP_ID, appSecret: APP_SECRET });

  expect(client).toBeInstanceOf(WechatClient);
});

it('support origin', () => {
  // eslint-disable-next-line no-new
  new WechatClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
    origin: 'https://mydummytestserver.com',
  });

  // https://mydummytestserver.com/cgi-bin/
  // 'Content-Type': 'application/json',
});

it('#axios - should return the underlying http client', () => {
  const client = new WechatClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
  });

  expect(client.axios.get).toBeDefined();
  expect(client.axios.post).toBeDefined();
  expect(client.axios.put).toBeDefined();
  expect(client.axios.delete).toBeDefined();
});

it('#accessToken - should return the underlying access token', () => {
  const client = new WechatClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
  });

  expect(client.accessToken).toEqual(expect.any(String));
});

it('#onRequest - should call provided onRequest function when calling any API', async () => {
  const onRequest = jest.fn();

  const client = new WechatClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
    onRequest,
  });

  const mock = new MockAdapter(client.axios);

  mock.onPost('/path').reply(200, {});

  await client.axios.post('/path', { x: 1 });

  expect(onRequest).toBeCalledWith({
    method: 'post',
    url: 'https://api.weixin.qq.com/cgi-bin/path',
    body: {
      x: 1,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
});
