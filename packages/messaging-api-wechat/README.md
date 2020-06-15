# messaging-api-wechat

> Messaging API client for WeChat

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Send API](#send-api)
  - [Medai API](#media-api)
- [Debug Tips](#debug-tips)
- [Test](#test)

## Installation

```sh
npm i --save messaging-api-wechat
```

or

```sh
yarn add messaging-api-wechat
```

<br />

## Usage

### Initialize

```js
const { WechatClient } = require('messaging-api-wechat');

// get appId, appSecret from「微信公众平台-开发-基本配置」page
const client = new WechatClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
});
```

### Error Handling

`messaging-api-wechat` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly `console.log` on the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.sendText(userId, text).catch((error) => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});
```

<br />

## API Reference

All methods return a Promise.

<br />

<a id="send-api" />

### Send API - [Official Docs](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140547)

## `sendText(userId, text)`

> 发送文本消息

| Param  | Type     | Description                     |
| ------ | -------- | ------------------------------- |
| userId | `String` | user ID of the recipient.       |
| text   | `String` | Text of the message to be sent. |

Example:

```js
client.sendText(USER_ID, 'Hello!');
```

<br />

## `sendImage(userId, mediaId)`

> 发送图片消息

Example:

```js
client.sendImage(USER_ID, 'MEDIA_ID');
```

<br />

## `sendVoice(userId, mediaId)`

> 发送语音消息

Example:

```js
client.sendVoice(USER_ID, 'MEDIA_ID');
```

<br />

## `sendVideo(userId, video)`

> 发送视频消息

Example:

```js
client.sendVideo(USER_ID, {
  media_id: 'MEDIA_ID',
  thumb_media_id: 'THUMB_MEDIA_ID',
  title: 'VIDEO_TITLE',
  description: 'VIDEO_DESCRIPTION',
});
```

<br />

## `sendMusic(userId, music)`

> 发送音乐消息

Example:

```js
client.sendMusic(USER_ID, {
  musicurl: 'MUSIC_URL',
  hqmusicurl: 'HQ_MUSIC_URL',
  thumb_media_id: 'THUMB_MEDIA_ID',
  title: 'MUSIC_TITLE',
  description: 'MUSIC_DESCRIPTION',
});
```

<br />

## `sendNews(userId, news)`

> 发送图文消息（点击跳转到外链）

Example:

```js
client.sendNews(USER_ID, {
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
});
```

<br />

## `sendMPNews(userId, mediaId)`

> 发送图文消息（点击跳转到图文消息页面）

Example:

```js
client.sendMPNews(USER_ID, 'MEDIA_ID');
```

<br />

## `sendWXCard(userId, cardId)`

> 发送卡券

Example:

```js
client.sendWXCard(USER_ID, '123dsdajkasd231jhksad');
```

<br />

## `sendMiniProgramPage(userId, miniProgramPage)`

> 发送小程序卡片

Example:

```js
client.sendMiniProgramPage(USER_ID, {
  title: 'title',
  appid: 'appid',
  pagepath: 'pagepath',
  thumb_media_id: 'thumb_media_id',
});
```

<br />

<a id="media-api" />

### Media API - [Official Docs](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140547)

## `uploadMedia(type, media)`

> 多媒体文件上传接口

Example:

```js
const fs = require('fs');

const buffer = fs.readFileSync('test.jpg');

client.uploadMedia('image', buffer).then((media) => {
  console.log(media);
  // {
  //   type: 'image',
  //   media_id: 'MEDIA_ID',
  //   created_at: 123456789
  // }
});
```

<br />

## `getMedia(mediaiD)`

> 下载多媒体文件接口

Example:

```js
client.getMedia(MEDIA_ID).then((media) => {
  console.log(media);
  // {
  //   video_url: "..."
  // }
});
```

## Debug Tips

### Log requests details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api-wechat
```

If you want to use custom request logging function, just define your own `onRequest`:

```js
const client = new WechatClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Test

### Point requests to your dummy server

To avoid sending requests to real WeChat server, specify `origin` option when constructing your client:

```js
const { WechatClient } = require('messaging-api-wechat');

const client = new WechatClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on production server.

### Manual Mock with [Jest](https://facebook.github.io/jest/)

create `__mocks__/messaging-api-wechat.js` in your project root:

```js
// __mocks__/messaging-api-wechat.js
const jestMock = require('jest-mock');
const { WechatClient } = require.requireActual('messaging-api-wechat');

module.exports = {
  WechatClient: {
    connect: jest.fn(() => {
      const Mock = jestMock.generateFromMetadata(
        jestMock.getMetadata(WechatClient)
      );
      return new Mock();
    }),
  },
};
```

Then, mock `messaging-api-wechat` package in your tests:

```js
// __tests__/mytest.spec.js
jest.mock('messaging-api-wechat');
```
