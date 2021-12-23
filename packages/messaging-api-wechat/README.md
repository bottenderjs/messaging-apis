# messaging-api-wechat

> Messaging API client for WeChat

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Send API](#send-api)
  - [Medai API](#media-api)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

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

`messaging-api-wechat` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

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

- [sendText](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendtext)
- [sendImage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendimage)
- [sendVoice](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendvoice)
- [sendVideo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendvideo)
- [sendMusic](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendmusic)
- [sendNews](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendnews)
- [sendMPNews](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendmpnews)
- [sendWXCard](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendwxcard)
- [sendMiniProgramPage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#sendminiprogrampage)

<a id="media-api" />

### Media API - [Official Docs](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140547)

- [uploadMedia](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#uploadmedia)
- [getMedia](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_wechat.WechatClient.html#getmedia)

## Debug Tips

### Log Requests Details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api:request
```

If you want to use a custom request logging function, just provide your own `onRequest`:

```js
const client = new WechatClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Testing

### Point Requests to Your Dummy Server

To avoid sending requests to real WeChat server, specify the `origin` option when constructing your client:

```js
const { WechatClient } = require('messaging-api-wechat');

const client = new WechatClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on your production server.
