import WechatClient from '../WechatClient';

import {
  constants,
  getCurrentContext,
  setupWechatServer,
} from './testing-library';

setupWechatServer();

it('should support #uploadMedia', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.uploadMedia('image', Buffer.from('1234'));

  expect(res).toEqual({
    type: 'image',
    mediaId: 'MEDIA_ID_1',
    createdAt: expect.any(Number),
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=1234567890&type=image'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.url.searchParams.get('type')).toBe('image');
  expect(request?.body).toEqual({ media: '1234' });
  expect(request?.headers.get('Content-Type')).toMatch(
    /^multipart\/form-data; boundary=--------------------------/
  );
});

it('should handle #uploadMedia errors', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  await expect(
    // @ts-expect-error invalid media type for test
    wechat.uploadMedia('?', Buffer.from('1234'))
  ).rejects.toThrowError('WeChat API - 40004 invalid media type');
});

it('should support #getMedia', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const { mediaId } = await wechat.uploadMedia('video', Buffer.from('1234'));
  const res = await wechat.getMedia(mediaId);

  expect(res).toEqual({
    videoUrl: 'https://www.example.com/download/url',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/media/get?access_token=1234567890&media_id=MEDIA_ID_1'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.url.searchParams.get('media_id')).toBe('MEDIA_ID_1');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getMedia download', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const { mediaId } = await wechat.uploadMedia('image', Buffer.from('abcd'));
  const res = await wechat.getMedia(mediaId);

  expect(res).toBe('abcd');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/media/get?access_token=1234567890&media_id=MEDIA_ID_1'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.url.searchParams.get('media_id')).toBe('MEDIA_ID_1');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should handle #getMedia errors', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  await expect(wechat.getMedia('?')).rejects.toThrowError(
    'WeChat API - 40007 invalid media_id'
  );
});
