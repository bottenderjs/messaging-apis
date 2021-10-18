import WechatClient from '../WechatClient';

import {
  constants,
  getCurrentContext,
  setupWechatServer,
} from './testing-library';

const RECIPIENT_ID = '1QAZ2WSX';

const customservice = {
  kfAccount: 'test1@kftest',
};

setupWechatServer();

it('should support #sendMessage', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendMessage({
    touser: RECIPIENT_ID,
    msgtype: 'text',
    text: {
      content: 'Hello!',
    },
    customservice,
  });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'text',
    text: {
      content: 'Hello!',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendText', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendText(RECIPIENT_ID, 'Hello!', { customservice });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'text',
    text: {
      content: 'Hello!',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendImage', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendImage(RECIPIENT_ID, 'MEDIA_ID', {
    customservice,
  });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'image',
    image: {
      media_id: 'MEDIA_ID',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVoice', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendVoice(RECIPIENT_ID, 'MEDIA_ID', {
    customservice,
  });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'voice',
    voice: {
      media_id: 'MEDIA_ID',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideo', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendVideo(
    RECIPIENT_ID,
    {
      mediaId: 'MEDIA_ID',
      thumbMediaId: 'MEDIA_ID',
      title: 'TITLE',
      description: 'DESCRIPTION',
    },
    { customservice }
  );

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'video',
    video: {
      media_id: 'MEDIA_ID',
      thumb_media_id: 'MEDIA_ID',
      title: 'TITLE',
      description: 'DESCRIPTION',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMusic', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendMusic(
    RECIPIENT_ID,
    {
      title: 'MUSIC_TITLE',
      description: 'MUSIC_DESCRIPTION',
      musicurl: 'MUSIC_URL',
      hqmusicurl: 'HQ_MUSIC_URL',
      thumbMediaId: 'THUMB_MEDIA_ID',
    },
    { customservice }
  );

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'music',
    music: {
      title: 'MUSIC_TITLE',
      description: 'MUSIC_DESCRIPTION',
      musicurl: 'MUSIC_URL',
      hqmusicurl: 'HQ_MUSIC_URL',
      thumb_media_id: 'THUMB_MEDIA_ID',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendNews', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendNews(
    RECIPIENT_ID,
    {
      articles: [
        {
          title: 'Happy Day',
          description: 'Is Really A Happy Day',
          url: 'URL',
          picurl: 'PIC_URL',
        },
        {
          title: 'Happy Day',
          description: 'Is Really A Happy Day',
          url: 'URL',
          picurl: 'PIC_URL',
        },
      ],
    },
    { customservice }
  );

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'news',
    news: {
      articles: [
        {
          title: 'Happy Day',
          description: 'Is Really A Happy Day',
          url: 'URL',
          picurl: 'PIC_URL',
        },
        {
          title: 'Happy Day',
          description: 'Is Really A Happy Day',
          url: 'URL',
          picurl: 'PIC_URL',
        },
      ],
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMPNews', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendMPNews(RECIPIENT_ID, 'MEDIA_ID', {
    customservice,
  });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'mpnews',
    mpnews: {
      media_id: 'MEDIA_ID',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMsgMenu', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendMsgMenu(
    RECIPIENT_ID,
    {
      headContent: 'HEAD',
      list: [
        { id: '101', content: 'Yes' },
        { id: '102', content: 'No' },
      ],
      tailContent: 'TAIL',
    },
    { customservice }
  );

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'msgmenu',
    msgmenu: {
      head_content: 'HEAD',
      list: [
        { id: '101', content: 'Yes' },
        { id: '102', content: 'No' },
      ],
      tail_content: 'TAIL',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendWXCard', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendWXCard(RECIPIENT_ID, '123dsdajkasd231jhksad', {
    customservice,
  });

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'wxcard',
    wxcard: {
      card_id: '123dsdajkasd231jhksad',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMiniProgramPage', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.sendMiniProgramPage(
    RECIPIENT_ID,
    {
      title: 'title',
      appid: 'appid',
      pagepath: 'pagepath',
      thumbMediaId: 'thumb_media_id',
    },
    {
      customservice,
    }
  );

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    msgtype: 'miniprogrampage',
    miniprogrampage: {
      title: 'title',
      appid: 'appid',
      pagepath: 'pagepath',
      thumb_media_id: 'thumb_media_id',
    },
    customservice: {
      kf_account: 'test1@kftest',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #typing', async () => {
  const wechat = new WechatClient({
    appId: constants.APP_ID,
    appSecret: constants.APP_SECRET,
  });

  const res = await wechat.typing(RECIPIENT_ID, 'Typing');

  expect(res).toEqual({
    errcode: 0,
    errmsg: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.weixin.qq.com/cgi-bin/message/custom/typing?access_token=1234567890'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('1234567890');
  expect(request?.body).toEqual({
    touser: RECIPIENT_ID,
    command: 'Typing',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
