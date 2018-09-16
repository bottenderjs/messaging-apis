# Messaging APIs

[![Build Status](https://travis-ci.org/Yoctol/messaging-apis.svg?branch=master)](https://travis-ci.org/Yoctol/messaging-apis)
[![Build status](https://ci.appveyor.com/api/projects/status/d8br1kcybpikdm8m/branch/master?svg=true)](https://ci.appveyor.com/project/tw0517tw/messaging-apis/branch/master)
[![coverage](https://codecov.io/gh/Yoctol/messaging-apis/branch/master/graph/badge.svg)](https://codecov.io/gh/Yoctol/messaging-apis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Messaging APIs is a [mono repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) which collects APIs needed for bot development.

It helps you build your bots using similar API for multiple platforms, e.g. Messenger, LINE. Learn once and make writing cross-platform bots easier.

If you are looking for a framework to build your bots, [Bottender](https://github.com/Yoctol/bottender) may suit for your needs. It is built on top of [Messaging APIs](https://github.com/Yoctol/messaging-apis) and provides some powerful features for bot building.

![](https://user-images.githubusercontent.com/3382565/33652388-3644799e-daa4-11e7-97f1-e9af5788ff6e.png)

## Packages

| Package                                                        | Version                                                                                                                                     | Platform                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`messaging-api-messenger`](/packages/messaging-api-messenger) | [![npm](https://img.shields.io/npm/v/messaging-api-messenger.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-messenger) | [Messenger](https://www.messenger.com/) |
| [`messaging-api-line`](/packages/messaging-api-line)           | [![npm](https://img.shields.io/npm/v/messaging-api-line.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-line)           | [LINE](https://line.me/)                |
| [`messaging-api-slack`](/packages/messaging-api-slack)         | [![npm](https://img.shields.io/npm/v/messaging-api-slack.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-slack)         | [Slack](https://slack.com/)             |
| [`messaging-api-telegram`](/packages/messaging-api-telegram)   | [![npm](https://img.shields.io/npm/v/messaging-api-telegram.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-telegram)   | [Telegram](https://telegram.org/)       |
| [`messaging-api-viber`](/packages/messaging-api-viber)         | [![npm](https://img.shields.io/npm/v/messaging-api-viber.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-viber)         | [Viber](https://www.viber.com/)         |
| [`messaging-api-wechat`](/packages/messaging-api-wechat)       | [![npm](https://img.shields.io/npm/v/messaging-api-wechat.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-wechat)       | [WeChat](https://weixin.qq.com/)        |

## Usage

## Messenger

<img src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/R_1BAhxMP5I.png" alt="Messenger" width="100" />

Install `messaging-api-messenger` package from the registry:

```sh
npm i --save messaging-api-messenger
```

or

```sh
yarn add messaging-api-messenger
```

Then, create a `MessengerClient` to call Messenger APIs:

```js
const { MessengerClient } = require('messaging-api-messenger');

// get accessToken from facebook developers website
const client = MessengerClient.connect(accessToken);

client.sendText(userId, 'Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-messenger/README.md) for more detail information.

## LINE

<img src="http://is5.mzstatic.com/image/thumb/Purple117/v4/01/c2/4d/01c24d99-4aae-71ea-24e2-d0b68f8c53d2/source/1200x630bb.jpg" alt="LINE" width="100" />

Install `messaging-api-line` package from the registry:

```sh
npm i --save messaging-api-line
```

or

```sh
yarn add messaging-api-line
```

Then, create a `LineClient` to call LINE APIs:

```js
const { LineClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = LineClient.connect(
  accessToken,
  channelSecret
);

client.pushText(userId, 'Hello World').then(() => {
  console.log('pushed');
});
```

Check out [full API documentation](./packages/messaging-api-line/README.md) for more detail information.

## Slack

<img src="https://cdn-images-1.medium.com/max/1200/1*TiKyhAN2gx4PpbOsiBhYcw.png" alt="Slack" width="100" />

Install `messaging-api-slack` package from the registry:

```sh
npm i --save messaging-api-slack
```

or

```sh
yarn add messaging-api-slack
```

Then, create a `SlackOAuthClient` or `SlackWebhookClient` to call Slack APIs:

```js
const { SlackOAuthClient } = require('messaging-api-slack');

// get access token by setup OAuth & Permissions function to your app.
// https://api.slack.com/docs/oauth
const client = SlackOAuthClient.connect(
  'xoxb-000000000000-xxxxxxxxxxxxxxxxxxxxxxxx'
);

client.postMessage('#random', 'Hello World').then(() => {
  console.log('sent');
});
```

```js
const { SlackWebhookClient } = require('messaging-api-slack');

// get webhook URL by adding a Incoming Webhook integration to your team.
// https://my.slack.com/services/new/incoming-webhook/
const client = SlackWebhookClient.connect(
  'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ'
);

client.sendText('Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-slack/README.md) for more detail information.

## Telegram

<img src="https://telegram.org/img/t_logo.png" alt="Telegram" width="100" />

Install `messaging-api-telegram` package from the registry:

```sh
npm i --save messaging-api-telegram
```

or

```sh
yarn add messaging-api-telegram
```

Then, create a `TelegramClient` to call Telegram APIs:

```js
const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('12345678:AaBbCcDdwhatever');

client.sendMessage(chatId, 'Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-telegram/README.md) for more detail information.

## Viber

<img src="https://user-images.githubusercontent.com/3382565/31753411-0be75dfc-b456-11e7-9eea-b976d21fcc53.png" alt="Viber" width="100" />

Install `messaging-api-viber` package from the registry:

```sh
npm i --save messaging-api-viber
```

or

```sh
yarn add messaging-api-viber
```

Then, create a `ViberClient` to call Viber APIs:

```js
const { ViberClient } = require('messaging-api-viber');

// get authToken from the "edit info" screen of your Public Account.
const client = ViberClient.connect(authToken);

client.sendText(userId, 'Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-viber/README.md) for more detail information.

## WeChat

<img src="https://user-images.githubusercontent.com/3382565/33652361-1dc854c6-daa4-11e7-997e-e1dedd818881.jpg" alt="WeChat" width="100" />

Install `messaging-api-wechat` package from the registry:

```sh
npm i --save messaging-api-wechat
```

or

```sh
yarn add messaging-api-wechat
```

Then, create a `WechatClient` to call Wechat APIs:

```js
const { WechatClient } = require('messaging-api-wechat');

// get appId, appSecret from「微信公众平台-开发-基本配置」page
const client = WechatClient.connect(
  appId,
  appSecret
);

client.sendText(userId, 'Hello World').then(() => {
  console.log('sent');
});
```

Check out [full API documentation](./packages/messaging-api-wechat/README.md) for more detail information.

## Documentation

- [Messenger](./packages/messaging-api-messenger/README.md)
- [LINE](./packages/messaging-api-line/README.md)
- [Slack](./packages/messaging-api-slack/README.md)
- [Telegram](./packages/messaging-api-telegram/README.md)
- [Viber](./packages/messaging-api-viber/README.md)
- [WeChat](./packages/messaging-api-wechat/README.md)

## Change Log

Every release, along with the migration instructions, is documented on the [CHANGELOG.md](./CHANGELOG.md) file.

## License

MIT © [Yoctol](https://github.com/Yoctol/messaging-apis)
