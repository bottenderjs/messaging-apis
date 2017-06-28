# messaging-api-slack

> Messaging API client for Slack

## Installation

```sh
npm i --save messaging-api-slack
```
or
```sh
yarn add messaging-api-slack
```

## Usage

### Initialize

There are two options to use messaging-api-slack:

1. [Web API](https://api.slack.com/methods/chat.postMessage)

Using OAuth token to authenticate.

```js
import { SlackClient } from 'messaging-api-slack';

// get accessToken from Slack OAuth or "Your Apps".
// https://api.slack.com/apps
const client = SlackClient.connect({
  channel: '#general' // which the token has "chat:write:bot" access to
  accessToken: 'this-is-a-token',
});
```

2. [Incoming Webhooks](https://api.slack.com/incoming-webhooks)

Using URL to authenticate

```js
import { SlackClient } from 'messaging-api-slack';

// get webhook URL by adding a Incoming Webhook integration to your team.
// https://my.slack.com/services/new/incoming-webhook/
const client = SlackClient.connect('https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/zzzzzZZZZZ');
```

## API Reference

All methods return a Promise.

### Send API

[Official docs](https://api.slack.com/docs/messages) 

- `sendRawBody(body)`

```js
client.sendRawBody({ text: 'Hello!' });
```

- `sendText(text)`

```js
client.sendText('Hello!');
```
