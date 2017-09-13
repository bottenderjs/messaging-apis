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

Param  | Type     | Description
------ | -------- | -----------
method | `String` | One of <code>`chat.postMessage` &#124; `channels.info` &#124; `channels.list` &#124; `users.info` &#124; `users.list`</code>
body   | `Object` | Body that the method needs.

Example:
```js
client.callMethod('chat.postMessage', { channel: 'C8763', text: 'Hello!' });
```

<br />

#### Chat API

## `postMessage(channel, text [, options])` - [Official docs](https://api.slack.com/methods/chat.postMessage)

Sends a message to a channel.

Param   | Type     | Description
------- | -------- | -----------
channel | `String` | Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name.
text    | `String` | Text of the message to be sent.
options | `Object` | Other optional parameters.

Example:
```js
client.postMessage('C8763', 'Hello!');
client.postMessage('C8763', 'Hello!', { as_user: true });
```

<br />

#### Users API

## `getUserList(cursor?)` - [Official docs](https://api.slack.com/methods/users.list)

Lists all users in a Slack team.

Param  | Type     | Description
------ | -------- | -----------
cursor | `String` | Paginate through collections of data by setting the `cursor` parameter to a `next_cursor` attribute returned by a previous request's `response_metadata`.

Example:
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

Example:
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

Param  | Type     | Description
------ | -------- | -----------
userId | `String` | User to get info on.

Example:
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

Example:
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

Param     | Type     | Description
--------- | -------- | -----------
channelId | `String` | Channel to get info on.

Example:
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

## Usage

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

## API Reference

All methods return a Promise.

<br />

### Send API - [Official docs](https://api.slack.com/docs/messages)

## `sendRawBody(body)`

Param | Type     | Description
----- | -------- | -----------
body  | `Object` | Raw data to be sent.

Example:
```js
client.sendRawBody({ text: 'Hello!' });
```

<br />

## `sendText(text)`

Param | Type     | Description
----- | -------- | -----------
text  | `String` | Text of the message to be sent.

Example:
```js
client.sendText('Hello!');
```

<br />

## `sendAttachments(attachments)` - [Official docs](https://api.slack.com/docs/message-attachments)

Send multiple attachments which let you add more context to a message.

Param       | Type            | Description
----------- | --------------- | -----------
attachments | `Array<Object>` | Messages are attachments, defined as an array. Each object contains the parameters to customize the appearance of a message attachment.

Example:
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

Send only one attachment.

Param       | Type     | Description
----------- | -------- | -----------
attachments | `Object` | Message is an attachment. The object contains the parameters to customize the appearance of a message attachment.

Example:
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
