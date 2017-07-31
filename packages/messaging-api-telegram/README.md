# messaging-api-telegram

> Messaging API client for Telegram

<img src="https://telegram.org/img/t_logo.png" alt="Telegram" width="150" />

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

###### url

Type: `String`

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

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### text

Type: `String`

##### options

Type: `Object`

```js
client.sendMessage(CHAT_ID, 'hi', {
  disable_web_page_preview: true,
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendmessage)

#### sendPhoto(chatId, photo, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### photo

Type: `String`

Pass a file id as String to send a photo that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a photo from the Internet.

##### options

Type: `Object`

```js
client.sendPhoto(CHAT_ID, 'https://example.com/image.png', {
  caption: 'gooooooodPhoto',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendphoto)

#### sendAudio(chatId, audio, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### audio

Type: `String`

Pass a file id as String to send an audio that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get an audio from the Internet.

##### options

Type: `Object`

```js
client.sendAudio(CHAT_ID, 'https://example.com/audio.mp3', {
  caption: 'gooooooodAudio',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendaudio)

#### sendDocument(chatId, document, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### document

Type: `String`

Pass a file id as String to send a document that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a document from the Internet.

##### options

Type: `Object`

```js
client.sendDocument(CHAT_ID, 'https://example.com/doc.gif', {
  caption: 'gooooooodDocument',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#senddocument)

#### sendSticker(chatId, sticker, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### sticker

Type: `String`

Pass a file id as String to send a sticker that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a sticker from the Internet.

##### options

Type: `Object`

```js
client.sendSticker(CHAT_ID, 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI', {
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendsticker)

#### sendVideo(chatId, video, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### video

Type: `String`

Pass a file id as String to send a video that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a video from the Internet.

##### options

Type: `Object`

```js
client.sendVideo(CHAT_ID, 'https://example.com/video.mp4', {
  caption: 'gooooooodVideo',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendvideo)

#### sendVoice(chatId, voice, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### voice

Type: `String`

Pass a file id as String to send a voice that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a voice from the Internet.

##### options

Type: `Object`

```js
client.sendVoice(CHAT_ID, 'https://example.com/voice.ogg', {
  caption: 'gooooooodVoice',
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#sendvoice)

#### sendLocation(chatId, location, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### location

Type: `Object`

###### location.latitude

Type: `Number`

Latitude of location.

###### location.longitude

Type: `Number`

Longitude of location.

##### options

Type: `Object`

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

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### venue

Type: `Object`

###### venue.latitude

Type: `Number`

Latitude of the venue.

###### venue.longitude

Type: `Number`

Longitude of the venue.

###### venue.title

Type: `String`

Name of the venue.

###### venue.address

Type: `String`

Address of the venue.

##### options

Type: `Object`

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

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### contact

Type: `Object`

###### options

Type: `Object`

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

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### action

Type: `String`

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

###### userId

Type: `String`

Unique identifier of the target user.

###### options

Type: `Object`

```js
client.getUserProfilePhotos(USER_ID, { limit: 2 });
```

[Official docs](https://core.telegram.org/bots/api/#getuserprofilephotos)

#### getFile(fileId)

###### fileId

Type: `String`

File identifier to get info about.

```js
client.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2');
```

[Official docs](https://core.telegram.org/bots/api/#getfile)

#### getChat(chatId)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChat(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchat)

#### getChatAdministrators(chatId)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChatAdministrators(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatadministrators)

#### getChatMembersCount(chatId)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChatMembersCount(CHAT_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatmemberscount)

#### getChatMember(chatId, userId)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `String`

Unique identifier of the target user.

```js
client.getChatMember(CHAT_ID, USER_ID);
```

[Official docs](https://core.telegram.org/bots/api/#getchatmember)

### updating API

#### editMessageText(text, options)

###### text

Type: `String`

New text of the message.

###### options

Type: `Object`

###### options.chat_id

###### options.message_id

###### options.inline_message_id

```js
client.editMessageText('new_text', { message_id: MESSAGE_ID });
```

[Official docs](https://core.telegram.org/bots/api/#editmessagetext)

#### editMessageCaption(caption, options)

###### caption

Type: `String`

New caption of the message.

###### options

Type: `Object`

###### options.chat_id

###### options.message_id

###### options.inline_message_id

```js
client.editMessageCaption('new_caption', { message_id: MESSAGE_ID });
```

[Official docs](https://core.telegram.org/bots/api/#editmessagecaption)

#### editMessageReplyMarkup(replyMarkup, options)

###### replyMarkup

Type: `Object`

###### options

Type: `Object`

###### options.chat_id

###### options.message_id

###### options.inline_message_id

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

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### messageId

Type: `Number`

Identifier of the message to delete.

```js
client.deleteMessage(CHAT_ID, MESSAGE_ID);
```

[Official docs](https://core.telegram.org/bots/api/#deletemessage)

### Others

#### forwardMessage(chatId, fromChatId, messageId, options)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### fromChatId

Type: `Number | String`

Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`).

###### messageId

Type: `Number`

Message identifier in the chat specified in from_chat_id.

###### options

Type: `Object`

```js
client.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID, {
  disable_notification: true,
});
```

[Official docs](https://core.telegram.org/bots/api/#forwardmessage)
