# messaging-api-telegram

> Messaging API client for Telegram

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [Webhook API](#webhook-api)
  * [Send API](#send-api)
  * [Get API](#get-api)
  * [Updating API](#updating-api)
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
const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('12345678:AaBbCcDdwhatever');
```

## API Reference

All methods return a Promise.

### Webhook API

#### getWebhookInfo

```js
client.getWebhookInfo();
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
[Content type](https://core.telegram.org/bots/api/#available-types)

#### sendMessage(chatId, text, options)

```js
client.sendMessage(CHAT_ID, 'hi', {
  disable_web_page_preview: true,
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendmessage)

#### sendPhoto(chatId, photo, options)

```js
client.sendPhoto(CHAT_ID, 'https://example.com/image.png', {
  caption: 'gooooooodPhoto',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendphoto)

#### sendAudio(chatId, audio, options)

```js
client.sendAudio(CHAT_ID, 'https://example.com/audio.mp3', {
  caption: 'gooooooodAudio',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendaudio)

#### sendDocument(chatId, document, options)

```js
client.sendDocument(CHAT_ID, 'https://example.com/doc.gif', {
  caption: 'gooooooodDocument',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#senddocument)

#### sendSticker(chatId, sticker, options)

```js
client.sendSticker(CHAT_ID, 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI', {
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendsticker)

#### sendVideo(chatId, video, options)

```js
client.sendVideo(CHAT_ID, 'https://example.com/video.mp4', {
  caption: 'gooooooodVideo',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendvideo)

#### sendVoice(chatId, voice, options)

```js
client.sendVoice(CHAT_ID, 'https://example.com/voice.ogg', {
  caption: 'gooooooodVoice',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendvoice)

#### sendLocation(chatId, location, options)

```js
client.sendLocation(
  CHAT_ID,
  {
    latitude: 30,
    longitude: 45,
  },
  {
    disable_notification: true,
  }
);
```

[Official docs](https://core.telegram.org/bots/api/#sendlocation)

#### sendVenue(chatId, venue, options)

```js
client.sendVenue(
  CHAT_ID,
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

[Official docs](https://core.telegram.org/bots/api/#sendvenue)

#### sendContact(chatId, contact, options)

```js
client.sendContact(
  CHAT_ID,
  {
    phoneNumber: '886123456789',
    firstName: 'first',
  },
  { last_name: 'last' }
);
```

[Official docs](https://core.telegram.org/bots/api/#sendcontact)

#### sendChatAction(chatId, action)

```js
client.sendChatAction(CHAT_ID, 'typing');
```

[Official docs](https://core.telegram.org/bots/api/#sendchataction)

### Get API

#### getMe

```js
client.getMe().then(result => {
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

[Official docs](https://core.telegram.org/bots/api/#getme)

#### getUserProfilePhotos(userId, options)

```js
client.getUserProfilePhotos(USER_ID, { limit: 2 });
```

[Official docs](https://core.telegram.org/bots/api/#getuserprofilephotos)

#### getFile(fileId)

```js
client.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2');
```

[Official docs](https://core.telegram.org/bots/api/#getfile)

#### getChat(chatId)

```js
client.getChat(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchat)

#### getChatAdministrators(chatId)

```js
client.getChatAdministrators(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatadministrators)

#### getChatMembersCount(chatId)

```js
client.getChatMembersCount(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatmemberscount)

#### getChatMember(chatId, userId)

```js
client.getChatMember(CHAT_ID, USER_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatmember)

### updating API

#### editMessageText(text, options)

```js
client.editMessageText('new_text', { message_id: MESSAGE_ID });
```

[Official docs](https://core.telegram.org/bots/api/#editmessagetext)

#### editMessageCaption(caption, options)

```js
client.editMessageCaption('new_caption', { message_id: MESSAGE_ID });
```

[Official docs](https://core.telegram.org/bots/api/#editmessagecaption)

#### editMessageReplyMarkup(replyMarkup, options)

```js
client.editMessageReplyMarkup(
  {
    keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
  { message_id: MESSAGE_ID }
);
```

[Official docs](https://core.telegram.org/bots/api/#editmessagereplymarkup)

#### deleteMessage(chatId, messageId)

```js
client.deleteMessage(CHAT_ID, MESSAGE_ID);
```

[Official docs](https://core.telegram.org/bots/api/#deletemessage)

### Others

#### forwardMessage(chatId, fromChatId, messageId, options)

```js
client.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID, {
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#forwardmessage)
