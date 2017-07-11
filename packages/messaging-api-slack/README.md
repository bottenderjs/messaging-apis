# messaging-api-slack

> Messaging API client for Slack

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

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

Get your webhook url by adding a [Incoming Webhooks](https://api.slack.com/incoming-webhooks) integreation to your team or setup Incoming Webhooks function to your app.

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

#### sendRawBody(body)

```js
client.sendRawBody({ text: 'Hello!' });
```

#### sendText(text)

```js
client.sendText('Hello!');
```

#### sendAttachments(attachments)

[Official docs](https://api.slack.com/docs/message-attachments)

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
  }
]);
```

#### sendAttachment(attachment)

[Official docs](https://api.slack.com/docs/message-attachments)

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
