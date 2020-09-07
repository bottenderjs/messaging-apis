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
const client = new SlackOAuthClient({
  accessToken: 'xoxb-000000000000-xxxxxxxxxxxxxxxxxxxxxxxx',
});
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

- [chat.postMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#chat)
- [chat.postEphemeral](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#chat)

<br />

#### Users API

- [getUserList](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getuserlist)
- [getAllUserList](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getalluserlist)
- [getUserInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getuserinfo)

<br />

#### Channels API

- [getChannelInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getchannelinfo)

<br />

#### Conversations API

- [getConversationInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getconversationinfo)
- [getConversationMembers](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getconversationmembers)
- [getAllConversationMembers](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getallconversationmembers)
- [getConversationList](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getconversationlist)
- [getAllConversationList](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_slack.slackoauthclient.html#getallconversationlist)

<br />

## Webhook Client

## Usage

Get your webhook url by adding a [Incoming Webhooks](https://api.slack.com/incoming-webhooks) integration to your team or setup Incoming Webhooks function to your app.

```js
const { SlackWebhookClient } = require('messaging-api-slack');

// get webhook URL by adding a Incoming Webhook integration to your team.
// https://my.slack.com/services/new/incoming-webhook/
const client = new SlackWebhookClient({
  url: 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ',
});
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
