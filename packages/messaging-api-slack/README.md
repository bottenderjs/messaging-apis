# messaging-api-slack

> Messaging API client for Slack

<img src="https://cdn-images-1.medium.com/max/1200/1*TiKyhAN2gx4PpbOsiBhYcw.png" alt="Slack" width="150" />

## Table of Contents

- [Installation](#installation)
- [OAuth Client](#oauth-client)
  - [Usage](#usage)
  - [API Reference](#api-reference)
- [Webhook Client](#webhook-client)
  - [Usage](#usage-1)
  - [API Reference](#api-reference-1)

## Installation

```sh
npm i --save messaging-api-slack
```
or
```sh
yarn add messaging-api-slack
```

## OAuth Client

### Usage

Get your bot user OAuth access token by setup OAuth & Permissions function to your app or check the [Using OAuth 2.0](https://api.slack.com/docs/oauth) document.

```js
const { SlackOAuthClient } = require('messaging-api-slack');

// get access token by setup OAuth & Permissions function to your app.
// https://api.slack.com/docs/oauth
const client = SlackOAuthClient.connect(
  'xoxb-000000000000-xxxxxxxxxxxxxxxxxxxxxxxx'
);
```

### API Reference

All methods return a Promise.

#### Call available methods

##### callMethod(method, body) - [Official docs](https://api.slack.com/methods)

###### method

Type: `String`
Value: One of `chat.postMessage | 'channels.info' | 'channels.list' | 'users.info' | 'users.list`

###### body

Type: `Object`

```js
client.callMethod('chat.postMessage', { channel: 'C8763', text: 'Hello!' });
```

#### Chat API

##### postMessage(channel, text, options?) - [Official docs](https://api.slack.com/methods/chat.postMessage)

###### channel

Type: `String`

###### text

Type: `String`

###### options

Type: `Object`

```js
client.postMessage('C8763', 'Hello!');
client.postMessage('C8763', 'Hello!', { as_user: true });
```

#### Users API

##### getUserList(cursor?) - [Official docs](https://api.slack.com/methods/users.list)

###### cursor

Type: `String`

```js
client.getUserList(cursor).then(res => {
  console.log(res);
  // {
  //   members: [
  //     { ... },
  //     { ... },
  //   ],
  //   next: 'abcdefg',
  // }
});
```

##### getAllUserList() - [Official docs](https://api.slack.com/methods/users.list)

```js
client.getAllUserList().then(res => {
  console.log(res);
  // [
  //   { ... },
  //   { ... },
  // ]
});
```

##### getUserInfo(userId) - [Official docs](https://api.slack.com/methods/users.info)

###### userId

Type: `String`

```js
client.getUserInfo(userId).then(res => {
  console.log(res);
  // {
  //   id: 'U123456',
  //   name: 'bobby',
  //   ...
  // }
});
```

#### Channels API

##### getChannelList() - [Official docs](https://api.slack.com/methods/channels.list)

```js
client.getChannelList().then(res => {
  console.log(res);
  // [
  //   { ... },
  //   { ... },
  // ]
});
```

##### getChannelInfo(channelId) - [Official docs](https://api.slack.com/methods/channels.info)

###### channelId

Type: `String`

```js
client.getChannelInfo(channelId).then(res => {
  console.log(res);
  // {
  //   id: 'C8763',
  //   name: 'fun',
  //   ...
  // }
});
```

## Webhook Client

### Usage

Get your webhook url by adding a [Incoming Webhooks](https://api.slack.com/incoming-webhooks) integreation to your team or setup Incoming Webhooks function to your app.

```js
const { SlackWebhookClient } = require('messaging-api-slack');

// get webhook URL by adding a Incoming Webhook integration to your team.
// https://my.slack.com/services/new/incoming-webhook/
const client = SlackWebhookClient.connect(
  'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ'
);
```

### API Reference

All methods return a Promise.

#### Send API - [Official docs](https://api.slack.com/docs/messages)

##### sendRawBody(body)

###### body

Type: `Object`

```js
client.sendRawBody({ text: 'Hello!' });
```

##### sendText(text)

###### text

Type: `String`

```js
client.sendText('Hello!');
```

##### sendAttachments(attachments) - [Official docs](https://api.slack.com/docs/message-attachments)

###### attachments

Type: `Array<Object>`

```js
client.sendAttachments([
  {
    fallback: 'some text',
    pretext: 'some pretext',
    color: 'good',
    fields: [
      {
        title: 'aaa',
        value: 'bbb',
        short: false,
      },
    ],
  },
  {
    fallback: 'some other text',
    pretext: 'some pther pretext',
    color: '#FF0000',
    fields: [
      {
        title: 'ccc',
        value: 'ddd',
        short: false,
      },
    ],
  },
]);
```

##### sendAttachment(attachment) - [Official docs](https://api.slack.com/docs/message-attachments)

###### attachment

Type: `Object`

```js
client.sendAttachment({
  fallback: 'some text',
  pretext: 'some pretext',
  color: 'good',
  fields: [
    {
      title: 'aaa',
      value: 'bbb',
      short: false,
    },
  ],
});
```
