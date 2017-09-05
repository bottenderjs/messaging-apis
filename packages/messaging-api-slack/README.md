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

<br />

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

<br />

### API Reference

All methods return a Promise.

<br />

#### Call available methods

## `callMethod(method, body)` - [Official docs](https://api.slack.com/methods)

Calling any API methods which follow [slack calling conventions](https://api.slack.com/web#basics).

###### method

Type: `String`
Value: One of `chat.postMessage | 'channels.info' | 'channels.list' | 'users.info' | 'users.list`

###### body

Type: `Object`

```js
client.callMethod('chat.postMessage', { channel: 'C8763', text: 'Hello!' });
```

<br />

#### Chat API

## `postMessage(channel, text, options?)` - [Official docs](https://api.slack.com/methods/chat.postMessage)

Sends a message to a channel.

###### channel

Type: `String`

###### text

Type: `String`

###### options

Type: `Object`

###### options.as_user

Type: `Boolean`

```js
client.postMessage('C8763', 'Hello!');
client.postMessage('C8763', 'Hello!', { as_user: true });
```

<br />

#### Users API

## `getUserList(cursor?)` - [Official docs](https://api.slack.com/methods/users.list)

Lists all users in a Slack team.

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

<br />

## `getAllUserList()` - [Official docs](https://api.slack.com/methods/users.list)

Recursively lists all users in a Slack team using cursor.

```js
client.getAllUserList().then(res => {
  console.log(res);
  // [
  //   { ... },
  //   { ... },
  // ]
});
```

<br />

## `getUserInfo(userId)` - [Official docs](https://api.slack.com/methods/users.info)

Gets information about an user.

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

<br />

#### Channels API

## `getChannelList()` - [Official docs](https://api.slack.com/methods/channels.list)

Lists all channels in a Slack team.

```js
client.getChannelList().then(res => {
  console.log(res);
  // [
  //   { ... },
  //   { ... },
  // ]
});
```

## `getChannelInfo(channelId)` - [Official docs](https://api.slack.com/methods/channels.info)

Gets information about a channel.

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

<br />

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

<br />

### API Reference

All methods return a Promise.

<br />

#### Send API - [Official docs](https://api.slack.com/docs/messages)

## `sendRawBody(body)`

###### body

Type: `Object`

```js
client.sendRawBody({ text: 'Hello!' });
```

<br />

## `sendText(text)`

###### text

Type: `String`

```js
client.sendText('Hello!');
```

<br />

## `sendAttachments(attachments)` - [Official docs](https://api.slack.com/docs/message-attachments)

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

<br />

## `sendAttachment(attachment)` - [Official docs](https://api.slack.com/docs/message-attachments)

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
