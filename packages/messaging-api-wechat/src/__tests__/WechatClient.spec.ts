import { rest } from 'msw';

import WechatClient from '../WechatClient';

import {
  constants,
  getCurrentContext,
  setupWechatServer,
} from './testing-library';

const wechatServer = setupWechatServer();

it('should support origin', async () => {
  wechatServer.use(
    rest.get('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
    origin: 'https://mydummytestserver.com',
  });

  await wechat.getAccessToken();

  expect(getCurrentContext().request?.url.href).toBe(
    'https://mydummytestserver.com/cgi-bin/token?grant_type=client_credential&appid=APP_ID&secret=APP_SECRET'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
    onRequest,
  });

  await wechat.getAccessToken();

  expect(onRequest).toBeCalledWith({
    body: undefined,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'get',
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APP_ID&secret=APP_SECRET',
  });
});

it('should support #getAccessToken', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.getAccessToken();

  expect(res).toEqual({
    accessToken: '1234567890',
    expiresIn: 7200,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APP_ID&secret=APP_SECRET'
  );
  expect(request?.url.searchParams.get('grant_type')).toBe('client_credential');
  expect(request?.url.searchParams.get('appid')).toBe('APP_ID');
  expect(request?.url.searchParams.get('secret')).toBe('APP_SECRET');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should handle request errors', async () => {
  wechatServer.use(
    rest.get('https://api.weixin.qq.com/cgi-bin/token', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          errcode: 40013,
          errmsg: 'invalid appid rid: 616c12e7-5ea20f02-726b4422',
        })
      );
    })
  );

  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  await expect(wechat.getAccessToken()).rejects.toThrowError(
    'WeChat API - 40013 invalid appid rid: 616c12e7-5ea20f02-726b4422'
  );
});
