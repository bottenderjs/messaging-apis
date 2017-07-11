# messaging-api-telegram

> Messaging API client for Telegram

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [Webhook API](#webhook-api)
  * [Send API](#send-api)
  * [Others](#others)

## Installation

```sh
npm i --save messaging-api-telegram
```
or
```sh
yarn add messaging-api-telegram
```

## Usage

### Initialize

```js
import { TelegramClient } from 'messaging-api-telegram';

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('12345678:AaBbCcDdwhatever');
```

## API Reference

All methods return a Promise.

### Webhook API

#### getWebhookInfo

```js
client.getWebhookInfo()
```

#### setWebhook(url)

```js
client.setWebhook('https://4a16faff.ngrok.io/');
```

#### deleteWebhook

```js
client.deleteWebhook();
```

### Send API

[Official docs](https://core.telegram.org/bots/api#available-methods)

#### sendMessage(chatId, text, options)

```js
client.sendMessage(427770117, 'hi', {
  disable_web_page_preview: true,
  disable_notification: true,
});
```

#### sendPhoto(chatId, photo, options)

```js
client.sendPhoto(
  427770117,
  'https://example.com/image.png',
  {
    caption: 'gooooooodPhoto',
    disable_notification: true,
  }
);
```

#### sendAudio(chatId, audio, options)

```js
client.sendAudio(
  427770117,
  'https://example.com/audio.mp3',
  {
    caption: 'gooooooodAudio',
    disable_notification: true,
  }
);
```

#### sendDocument(chatId, document, options)

```js
client.sendDocument(
  427770117,
  'https://example.com/doc.gif',
  {
    caption: 'gooooooodDocument',
    disable_notification: true,
  }
);
```

#### sendSticker(chatId, sticker, options)

```js
client.sendSticker(
  427770117,
  'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
  {
    disable_notification: true,
  }
);
```

#### sendVideo(chatId, video, options)

```js
client.sendVideo(
  427770117,
  'https://example.com/video.mp4',
  {
    caption: 'gooooooodVideo',
    disable_notification: true,
  }
);
```

#### sendVoice(chatId, voice, options)

```js
client.sendVoice(
  427770117,
  'https://example.com/voice.ogg',
  {
    caption: 'gooooooodVoice',
    disable_notification: true,
  }
);
```

#### sendLocation(chatId, location, options)

```js
client.sendLocation(
  427770117,
  {
    latitude: 30,
    longitude: 45,
  },
  {
    disable_notification: true,
  }
);
```

#### sendVenue(chatId, venue, options)

```js
client.sendVenue(
  427770117,
  {
    latitude: 30,
    longitude: 45,
    title: 'a_title',
    address: 'an_address',
  },
  {
    disable_notification: true,
  }
);
```

#### sendContact(chatId, contact, options)

```js
client.sendContact(
  427770117,
  {
    phoneNumber: '886123456789',
    firstName: 'first',
  },
  { last_name: 'last' }
);
```

#### sendChatAction(chatId, action)

```js
client.sendChatAction(427770117, 'typing');
```

### Others

#### getMe

```js
client.getMe()
.then(result => {
  console.log(result);
  // {
  //   ok: true,
  //   result: {
  //     id: 313534466,
  //     first_name: 'first',
  //     username: 'a_bot'
  //   }
  // }
});
```
