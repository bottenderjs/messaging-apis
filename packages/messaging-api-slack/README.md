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
- [Debug Tips](#debug-tips)
- [Testing](#testing)

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
const client = new SlackOAuthClient(
  'xoxb-000000000000-xxxxxxxxxxxxxxxxxxxxxxxx'
);
```

#### Error Handling

`messaging-api-slack` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly `console.log` on the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.callMethod(method, body).catch((error) => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});
```

<br />

### API Reference

All methods return a Promise.

<br />

#### Call available methods

## `callMethod(method, body)` - [Official docs](https://api.slack.com/methods)

Calling any API methods which follow [slack calling conventions](https://api.slack.com/web#basics).

| Param  | Type     | Description                                         |
| ------ | -------- | --------------------------------------------------- |
| method | `String` | One of [API Methods](https://api.slack.com/methods) |
| body   | `Object` | Body that the method needs.                         |

Example:

```js
client.callMethod('chat.postMessage', { channel: 'C8763', text: 'Hello!' });
```

<br />

#### Chat API

- [chat.postMessage]

## `postMessage(channel, message [, options])` - [Official docs](https://api.slack.com/methods/chat.postMessage)

Sends a message to a channel.

| Param               | Type                              | Description                                                                                |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| channel             | `String`                          | Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name. |
| message             | <code>String &#124; Object</code> | The message to be sent, can be text message or attachment message.                         |
| options             | `Object`                          | Other optional parameters.                                                                 |
| options.accessToken | `String`                          | Custom access token of the request.                                                        |

Example:

```js
client.postMessage('C8763', { text: 'Hello!' });
client.postMessage('C8763', { attachments: [someAttachments] });
client.postMessage('C8763', 'Hello!');
client.postMessage('C8763', 'Hello!', { as_user: true });
```

If you send message with `attachments`, `messaging-api-slack` will automatically stringify the `attachments` field for you.

```js
client.postMessage(
  'C8763',
  {
    text: 'Hello!',
    attachments: [
      {
        text: 'Choose a game to play',
        fallback: 'You are unable to choose a game',
        callback_id: 'wopr_game',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'game',
            text: 'Chess',
            type: 'button',
            value: 'chess',
          },
        ],
      },
    ],
  },
  {
    as_user: true,
  }
);
```

<br />

## `postEphemeral(channel, user, message [, options])` - [Official docs](https://api.slack.com/methods/chat.postEphemeral)

Sends an ephemeral message to a user in a channel.

| Param               | Type                              | Description                                                                                                                     |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| channel             | `String`                          | Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name.                                      |
| user                | `String`                          | `id` of the user who will receive the ephemeral message. The user should be in the channel specified by the `channel` argument. |
| message             | <code>String &#124; Object</code> | The message to be sent, can be text message or attachment message.                                                              |
| options             | `Object`                          | Other optional parameters.                                                                                                      |
| options.accessToken | `String`                          | Custom access token of the request.                                                                                             |

Example:

```js
client.postEphemeral('C8763', 'U56781234', { text: 'Hello!' });
client.postEphemeral('C8763', 'U56781234', { attachments: [someAttachments] });
client.postEphemeral('C8763', 'U56781234', 'Hello!');
client.postEphemeral('C8763', 'U56781234', 'Hello!', { as_user: true });
```

<br />

#### Users API

- [getUserList]()
- [getAllUserList]()
- [getUserInfo]()

<br />

#### Channels API

- [getChannelInfo]()

<br />

#### Conversations API

- [getConversationInfo]()
- [getConversationMembers]()
- [getAllConversationMembers]()

## `getConversationMembers(channelId, options?)` - [Official docs](https://api.slack.com/methods/conversations.members)

Retrieve members of a conversation.

| Param               | Type     | Description                         |
| ------------------- | -------- | ----------------------------------- |
| channelId           | `String` | Channel to get info on.             |
| options             | `Object` | Optional arguments.                 |
| options.accessToken | `String` | Custom access token of the request. |

Example:

```js
client.getConversationMembers(channelId, { cursor: 'xxx' });
client.getConversationMembers(channelId).then((res) => {
  console.log(res);
  // {
  //   members: ['U061F7AUR', 'U0C0NS9HN'],
  //   next: 'cursor',
  // }
});
```

<br />

## `getAllConversationMembers(channelId, options?)` - [Official docs](https://api.slack.com/methods/conversations.members)

Recursively retrieve members of a conversation using cursor.

| Param               | Type     | Description                         |
| ------------------- | -------- | ----------------------------------- |
| channelId           | `String` | Channel to get info on.             |
| options             | `Object` | Other optional parameters.          |
| options.accessToken | `String` | Custom access token of the request. |

Example:

```js
client.getAllConversationMembers(channelId).then((res) => {
  console.log(res);
  // ['U061F7AUR', 'U0C0NS9HN', ...]
});
```

<br />

## `getConversationList(options?)` - [Official docs](https://api.slack.com/methods/conversations.list)

Lists all channels in a Slack team.

| Param               | Type     | Description                         |
| ------------------- | -------- | ----------------------------------- |
| options             | `Object` | Optional arguments.                 |
| options.accessToken | `String` | Custom access token of the request. |

Example:

```js
client.getConversationList({ cursor: 'xxx' });
client.getConversationList().then((res) => {
  console.log(res);
  // {
  //   channels: [
  //     {
  //       id: 'C012AB3CD',
  //       name: 'general',
  //       ...
  //     },
  //     {
  //       id: 'C012AB3C5',
  //       name: 'random',
  //       ...
  //     },
  //   ],
  //   next: 'cursor',
  // }
});
```

<br />

## `getAllConversationList(options?)` - [Official docs](https://api.slack.com/methods/conversations.list)

Recursively lists all channels in a Slack team using cursor.

| Param               | Type     | Description                         |
| ------------------- | -------- | ----------------------------------- |
| options             | `Object` | Optional arguments.                 |
| options.accessToken | `String` | Custom access token of the request. |

Example:

```js
client.getAllConversationList().then((res) => {
  console.log(res);
  // [
  //   {
  //     id: 'C012AB3CD',
  //     name: 'general',
  //     ...
  //   },
  //   {
  //     id: 'C012AB3C5',
  //     name: 'random',
  //     ...
  //   },
  // ],
});
```

<br />

## Webhook Client

## Usage

Get your webhook url by adding a [Incoming Webhooks](https://api.slack.com/incoming-webhooks) integration to your team or setup Incoming Webhooks function to your app.

```js
const { SlackWebhookClient } = require('messaging-api-slack');

// get webhook URL by adding a Incoming Webhook integration to your team.
// https://my.slack.com/services/new/incoming-webhook/
const client = new SlackWebhookClient(
  'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ'
);
```

<br />

## API Reference

All methods return a Promise.

<br />

### Send API - [Official docs](https://api.slack.com/docs/messages)

- [sendRawBody](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackwebhookclient.html#sendrawbody)
- [sendText](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackwebhookclient.html#sendtext)
- [sendAttachments](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackwebhookclient.html#sendattachments)
- [sendAttachment](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackwebhookclient.html#sendattachment)

<br />

## Debug Tips

### Log Requests Details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api:request
```

If you want to use a custom request logging function, just provide your own `onRequest`:

```js
// for SlackOAuthClient
const client = new SlackOAuthClient({
  accessToken: ACCESS_TOKEN,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});

// for SlackWebhookClient
const client = new SlackWebhookClient({
  url: URL,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Testing

### Point Requests to Your Dummy Server

To avoid sending requests to real Slack server, specify the `origin` option when constructing your client:

```js
const { SlackOAuthClient } = require('messaging-api-slack');

const client = new SlackOAuthClient({
  accessToken: ACCESS_TOKEN,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on your production server.
