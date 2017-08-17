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

#### getWebhookInfo - [Official Docs](https://core.telegram.org/bots/api#getwebhookinfo)  

```js
client.getWebhookInfo();
```

#### setWebhook(url) - [Official Docs](https://core.telegram.org/bots/api#setwebhook)  

###### url

Type: `String`

```js
client.setWebhook('https://4a16faff.ngrok.io/');
```

#### deleteWebhook - [Official Docs](https://core.telegram.org/bots/api#deletewebhook)  

```js
client.deleteWebhook();
```

<a id="send-api" />

### Send API - [Official Docs](https://core.telegram.org/bots/api#available-methods)  

#### sendMessage(chatId, text, options) - [Official Docs](https://core.telegram.org/bots/api/#sendmessage)

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

#### sendPhoto(chatId, photo, options) - [Official Docs](https://core.telegram.org/bots/api/#sendphoto)


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

#### sendAudio(chatId, audio, options) - [Official Docs](https://core.telegram.org/bots/api/#sendaudio)

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

#### sendDocument(chatId, document, options) - [Official Docs](https://core.telegram.org/bots/api/#senddocument)

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

#### sendSticker(chatId, sticker, options) - [Official Docs](https://core.telegram.org/bots/api/#sendsticker)

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

#### sendVideo(chatId, video, options) - [Official Docs](https://core.telegram.org/bots/api/#sendvideo)

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

#### sendVoice(chatId, voice, options) - [Official Docs](https://core.telegram.org/bots/api/#sendvoice)

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

#### sendLocation(chatId, location, options) - [Official Docs](https://core.telegram.org/bots/api/#sendlocation)

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

#### sendVenue(chatId, venue, options) - [Official Docs](https://core.telegram.org/bots/api/#sendvenue)

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

#### sendContact(chatId, contact, options) - [Official Docs](https://core.telegram.org/bots/api/#sendcontact)

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

#### sendChatAction(chatId, action) - [Official Docs](https://core.telegram.org/bots/api/#sendchataction)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).

###### action

Type: `String`

```js
client.sendChatAction(CHAT_ID, 'typing');
```

### Get API

#### getMe - [Official Docs](https://core.telegram.org/bots/api/#getme)

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

#### getUserProfilePhotos(userId, options) - [Official Docs](https://core.telegram.org/bots/api/#getuserprofilephotos)

###### userId

Type: `String`

Unique identifier of the target user.

###### options

Type: `Object`

```js
client.getUserProfilePhotos(USER_ID, { limit: 2 });
```

#### getFile(fileId) - [Official Docs](https://core.telegram.org/bots/api/#getfile)

###### fileId

Type: `String`

File identifier to get info about.

```js
client.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2');
```

#### getChat(chatId) - [Official Docs](https://core.telegram.org/bots/api/#getchat)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChat(CHAT_ID);
```

#### getChatAdministrators(chatId) - [Official Docs](https://core.telegram.org/bots/api/#getchatadministrators)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChatAdministrators(CHAT_ID);
```

#### getChatMembersCount(chatId) - [Official Docs](https://core.telegram.org/bots/api/#getchatmemberscount)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.getChatMembersCount(CHAT_ID);
```

#### getChatMember(chatId, userId) - [Official Docs](https://core.telegram.org/bots/api/#getchatmember)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `String`

Unique identifier of the target user.

```js
client.getChatMember(CHAT_ID, USER_ID);
```

### updating API

#### editMessageText(text, options) - [Official Docs](https://core.telegram.org/bots/api/#editmessagetext)

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

#### editMessageCaption(caption, options) - [Official Docs](https://core.telegram.org/bots/api/#editmessagecaption)

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

#### editMessageReplyMarkup(replyMarkup, options) - [Official Docs](https://core.telegram.org/bots/api/#editmessagereplymarkup)

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

#### deleteMessage(chatId, messageId) - [Official Docs](https://core.telegram.org/bots/api/#deletemessage)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### messageId

Type: `Number`

Identifier of the message to delete.

```js
client.deleteMessage(CHAT_ID, MESSAGE_ID);
```

### Group API

#### kickChatMember(chatId, userId, options) - [Official Docs](https://core.telegram.org/bots/api/#kickchatmember)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `Number`

Unique identifier of the target user.

###### options

Type: `Object`

###### options.until_date

Date when the user will be unbanned, unix time.

```js
client.kickChatMember(CHAT_ID, USER_ID, { until_date: UNIX_TIME });
```

#### unbanChatMember(chatId, userId) - [Official Docs](https://core.telegram.org/bots/api/#unbanChatMember)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `Number`

Unique identifier of the target user.

```js
client.unbanChatMember(CHAT_ID, USER_ID);
```

#### restrictChatMember(chatId, userId, options) - [Official Docs](https://core.telegram.org/bots/api/#restrictChatMember)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `Number`

Unique identifier of the target user.

###### options

Type: `Object`

```js
client.restrictChatMember(CHAT_ID, USER_ID, { can_send_messages: true });
```

#### promoteChatMember(chatId, userId, options) - [Official Docs](https://core.telegram.org/bots/api/#promoteChatMember)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### userId

Type: `Number`

Unique identifier of the target user.

###### options

Type: `Object`

```js
client.promoteChatMember(CHAT_ID, USER_ID, { can_change_info: true, can_invite_users: true });
```

#### exportChatInviteLink(chatId) - [Official Docs](https://core.telegram.org/bots/api/#exportChatInviteLink)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.exportChatInviteLink(CHAT_ID);
```

#### setChatPhoto(chatId, photo) - [Official Docs](https://core.telegram.org/bots/api/#setChatPhoto)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### photo

Type: `String`

Pass a file id as String to send a photo that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a photo from the Internet.

```js
client.setChatPhoto(CHAT_ID, 'https://example.com/image.png');
```

#### deleteChatPhoto(chatId) - [Official Docs](https://core.telegram.org/bots/api/#deleteChatPhoto)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.deleteChatPhoto(CHAT_ID);
```

#### setChatTitle(chatId, title) - [Official Docs](https://core.telegram.org/bots/api/#setChatTitle)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### title

Type: `String`

New chat title, 1-255 characters.

```js
client.setChatTitle(CHAT_ID, 'New Title');
```

#### setChatDescription(chatId, description) - [Official Docs](https://core.telegram.org/bots/api/#setChatDescription)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### description

Type: `String`

New chat description, 0-255 characters.

```js
client.setChatDescription(CHAT_ID, 'New Description');
```

#### pinChatMessage(chatId, messageId, options) - [Official Docs](https://core.telegram.org/bots/api/#pinChatMessage)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

###### messageId

Type: `Number`

Identifier of a message to pin

###### options

Type: `Object`

###### options.disable_notification

```js
client.pinChatMessage(CHAT_ID, MESSAGE_ID, { disable_notification: true });
```

#### unpinChatMessage(chatId) - [Official Docs](https://core.telegram.org/bots/api/#unpinChatMessage)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.unpinChatMessage(CHAT_ID);
```

#### leaveChat(chatId) - [Official Docs](https://core.telegram.org/bots/api/#leaveChat)

###### chatId

Type: `Number | String`

Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).

```js
client.leaveChat(CHAT_ID);
```

### Others

#### forwardMessage(chatId, fromChatId, messageId, options) - [Official Docs](https://core.telegram.org/bots/api/#forwardmessage)

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
