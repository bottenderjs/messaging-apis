# messaging-api-line

> Messaging API client for LINE

## Installation

```sh
npm i --save messaging-api-line
```
or
```sh
yarn add messaging-api-line
```

## Usage

### Initialize

```js
import { LINEClient } from 'messaging-api-line';

// get accessToken and channelSecret from LINE developers website
const client = LINEClient.factory(accessToken, channelSecret);
```

### API

```js
await client.pushText(id, text);
```

or

```js
client.pushText(id, text).then(() => {
  // do something
});
```

## Supported Methods

All methods return a Promise resolves an API response.

### Reply API

[Official Docs](https://devdocs.line.me/en/#reply-message)

- `reply`
- `replyText`

### Push API

[Official Docs](https://devdocs.line.me/en/#push-message)

- `push`
- `pushText`
- `pushImage`
- `pushVideo`
- `pushAudio`
- `pushLocation`
- `pushSticker`
- `pushImagemap`
  - [Official Docs](https://devdocs.line.me/en/#imagemap-message)
- `pushTemplate`
- `pushButtonTemplate`
- `pushConfirmTemplate`
- `pushCarouselTemplate`

### Others

- `getUserProfile`
  - [Official Docs](https://devdocs.line.me/en/#bot-api-get-profile)
- `multicast`
  - [Official Docs](https://devdocs.line.me/en/#multicast)
- `leaveGroup`
  - [Official Docs](https://devdocs.line.me/en/#leave)
- `leaveRoom`
  - [Official Docs](https://devdocs.line.me/en/#leave)
- `isValidSignature`
  - [Official Docs](https://devdocs.line.me/en/#webhooks)
- `retrieveMessageContent`
  - [Official Docs](https://devdocs.line.me/en/#content)
