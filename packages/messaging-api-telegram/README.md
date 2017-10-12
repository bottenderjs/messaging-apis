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
  * [Payments API](#payments-api)
  * [Others](#others)

## Installation

```sh
npm i --save messaging-api-telegram
```
or
```sh
yarn add messaging-api-telegram
```

<br />

## Usage

### Initialize

```js
const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('12345678:AaBbCcDdwhatever');
```

<br />

## API Reference

All methods return a Promise.

<br />

### Webhook API

## `getWebhookInfo` - [Official Docs](https://core.telegram.org/bots/api#getwebhookinfo)  

Gets current webhook status.

Example:
```js
client.getWebhookInfo();
```

<br />

## `setWebhook(url)` - [Official Docs](https://core.telegram.org/bots/api#setwebhook)  

Specifies a url and receive incoming updates via an outgoing webhook.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | HTTPS url to send updates to.

Example:
```js
client.setWebhook('https://4a16faff.ngrok.io/');
```

<br />

## `deleteWebhook` - [Official Docs](https://core.telegram.org/bots/api#deletewebhook)  

Removes webhook integration.

Example:
```js
client.deleteWebhook();
```

<br />

<a id="send-api" />

### Send API - [Official Docs](https://core.telegram.org/bots/api#available-methods)  

## `sendMessage(chatId, text [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendmessage)

Sends text messages.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
text    | `String`                          | Text of the message to be sent.
options | `Object`                          | Other optional parameters.

Exmaple:
```js
client.sendMessage(CHAT_ID, 'hi', {
  disable_web_page_preview: true,
  disable_notification: true,
});
```

<br />

## `sendPhoto(chatId, photo [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendphoto)

Sends photos.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
photo   | `String`                          | Pass a file id (recommended) or HTTP URL to send photo.
options | `Object`                          | Other optional parameters.

Example:
```js
client.sendPhoto(CHAT_ID, 'https://example.com/image.png', {
  caption: 'gooooooodPhoto',
  disable_notification: true,
});
```

<br />

## `sendAudio(chatId, audio [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendaudio)

Sends audio files.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
audio   | `String`                          | Pass a file id (recommended) or HTTP URL to send audio.
options | `Object`                          | Other optional parameters.

Example:
```js
client.sendAudio(CHAT_ID, 'https://example.com/audio.mp3', {
  caption: 'gooooooodAudio',
  disable_notification: true,
});
```

<br />

## `sendDocument(chatId, document [, options])` - [Official Docs](https://core.telegram.org/bots/api/#senddocument)

Sends general files.

Param    |  Type                             | Description
-------- | --------------------------------- | -----------
chatId   | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
document | `String`                          | Pass a file id (recommended) or HTTP URL to send document.
options  | `Object`                          | Other optional parameters.

Example:
```js
client.sendDocument(CHAT_ID, 'https://example.com/doc.gif', {
  caption: 'gooooooodDocument',
  disable_notification: true,
});
```

<br />

## `sendSticker(chatId, sticker [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendsticker)

Sends `.webp` stickers.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
sticker | `String`                          | Pass a file id (recommended) or HTTP URL to send sticker.
options | `Object`                          | Other optional parameters.

Example:
```js
client.sendSticker(CHAT_ID, 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI', {
  disable_notification: true,
});
```

<br />

## `sendVideo(chatId, video [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendvideo)

Sends video files, Telegram clients support `mp4` videos (other formats may be sent as Document).

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
video   | `String`                          | Pass a file id (recommended) or HTTP URL to send video.
options | `Object`                          | Other optional parameters.

Example:
```js
client.sendVideo(CHAT_ID, 'https://example.com/video.mp4', {
  caption: 'gooooooodVideo',
  disable_notification: true,
});
```

<br />

## `sendVoice(chatId, voice [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendvoice)

Sends audio files.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
voice   | `String`                          | Pass a file id (recommended) or HTTP URL to send voice.
options | `Object`                          | Other optional parameters.

Example:
```js
client.sendVoice(CHAT_ID, 'https://example.com/voice.ogg', {
  caption: 'gooooooodVoice',
  disable_notification: true,
});
```

<br />

## `sendLocation(chatId, location [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendlocation)

Sends point on the map.

Param    |  Type                             | Description
-------- | --------------------------------- | -----------
chatId   | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
location | `Object`                          | Object contains latitude and longitude.
location.latitude | `Number`                 | Latitude of the location.
location.longitude | `Number`                | Longitude of the location.
options  | `Object`                          | Other optional parameters.

Example:
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

<br />

## `sendVenue(chatId, venue [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendvenue)

Sends information about a venue.

Param    |  Type                             | Description
-------- | --------------------------------- | -----------
chatId   | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
venue    | `Object`                          | Object contains information of the venue.
venue.latitude | `Number`                    | Latitude of the venue.
venue.longitude | `Number`                   | Longitude of the venue.
venue.title | `String`                       | Name of the venue.
venue.address | `String`                     | Address of the venue.
options  | `Object`                          | Other optional parameters.

Example:
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

<br />

## `sendContact(chatId, contact [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendcontact)

Sends phone contacts.

Param    |  Type                             | Description
-------- | --------------------------------- | -----------
chatId   | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
contact  | `Object`                          | Object contains information of the contact.
contact.phone_number | `String`              | Phone number of the contact.
contact.first_name   | `String`              | First name of the contact.
options  | `Object`                          | Other optional parameters.

Example:
```js
client.sendContact(
  CHAT_ID,
  {
    phone_number: '886123456789',
    first_name: 'first',
  },
  { last_name: 'last' }
);
```

<br />

## `sendChatAction(chatId, action)` - [Official Docs](https://core.telegram.org/bots/api/#sendchataction)

Tells the user that something is happening on the bot's side.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
action  | `String`                          | Type of action to broadcast.

Example:
```js
client.sendChatAction(CHAT_ID, 'typing');
```

<br />

### Get API

## `getMe` - [Official Docs](https://core.telegram.org/bots/api/#getme)

Gets bot's information.

Example:
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

<br />

## `getUserProfilePhotos(userId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#getuserprofilephotos)

Gets a list of profile pictures for a user.

Param    |  Type    | Description
-------- | -------- | -----------
chatId   | `String` | Unique identifier of the target user.
options  | `Object` | Other optional parameters

Example:
```js
client.getUserProfilePhotos(USER_ID, { limit: 2 });
```

<br />

## `getFile(fileId)` - [Official Docs](https://core.telegram.org/bots/api/#getfile)

Gets basic info about a file and prepare it for downloading.

Param    |  Type    | Description
-------- | -------- | -----------
fileId   | `String` | File identifier to get info about.

Example:
```js
client.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2');
```

<br />

## `getFileLink(fileId)`

Gets link of the file.

Param    |  Type    | Description
-------- | -------- | -----------
fileId   | `String` | File identifier to get info about.

Example:
```js
client.getFileLink('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2');
```

<br />

## `getChat(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#getchat)

Gets up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.)

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.getChat(CHAT_ID);
```

<br />

## `getChatAdministrators(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#getchatadministrators)

Gets a list of administrators in a chat.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.getChatAdministrators(CHAT_ID);
```

<br />

## `getChatMembersCount(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#getchatmemberscount)

Gets the number of members in a chat.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.getChatMembersCount(CHAT_ID);
```

<br />

## `getChatMember(chatId, userId)` - [Official Docs](https://core.telegram.org/bots/api/#getchatmember)

Gets information about a member of a chat.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
userId  | `Number`                          | Unique identifier of the target user.

Example:
```js
client.getChatMember(CHAT_ID, USER_ID);
```

<br />

### updating API

## `editMessageText(text [, options])` - [Official Docs](https://core.telegram.org/bots/api/#editmessagetext)

Edits text and game messages sent by the bot or via the bot (for inline bots).

Param   |  Type                                     | Description
------- | ----------------------------------------- | -----------
text    | `String`                                  | New text of the message.
options | `Object`                                  | One of chat_id, message_id or inline_message_id is required.
options.chat_id | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
options.message_id | `Number`                       | Identifier of the sent message.
options.inline_message_id | `String`                | Identifier of the inline message.

Example:
```js
client.editMessageText('new_text', { message_id: MESSAGE_ID });
```

<br />

## `editMessageCaption(caption [, options])` - [Official Docs](https://core.telegram.org/bots/api/#editmessagecaption)

Edits captions of messages sent by the bot or via the bot (for inline bots).

Param   |  Type                                     | Description
------- | ----------------------------------------- | -----------
caption | `String`                                  | New caption of the message.
options | `Object`                                  | One of chat_id, message_id or inline_message_id is required.
options.chat_id | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
options.message_id | `Number`                       | Identifier of the sent message.
options.inline_message_id | `String`                | Identifier of the inline message.

Example:
```js
client.editMessageCaption('new_caption', { message_id: MESSAGE_ID });
```

<br />

## `editMessageReplyMarkup(replyMarkup [, options])` - [Official Docs](https://core.telegram.org/bots/api/#editmessagereplymarkup)

Edits only the reply markup of messages sent by the bot or via the bot (for inline bots).

Param       |  Type                                 | Description
----------- | ------------------------------------- | -----------
replyMarkup | `Object`                              | New replyMarkup of the message.
options     | `Object`                              | One of chat_id, message_id or inline_message_id is required.
options.chat_id | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
options.message_id | `Number`                       | Identifier of the sent message.
options.inline_message_id | `String`                | Identifier of the inline message.

Example:
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

<br />

## `deleteMessage(chatId, messageId)` - [Official Docs](https://core.telegram.org/bots/api/#deletemessage)

Deletes a message, including service messages.

Param     |  Type                             | Description
--------- | --------------------------------- | -----------
chatId    | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
messageId | `Number`                          | Identifier of the message to delete.

Example:
```js
client.deleteMessage(CHAT_ID, MESSAGE_ID);
```

<br />

## `editMessageLiveLocation(location [, options])` - [Official Docs](https://core.telegram.org/bots/api/#editmessagelivelocation)

Edit live location messages sent by the bot or via the bot (for inline bots).

Param   |  Type                                     | Description
------- | ----------------------------------------- | -----------
location | `Object`                                 | Object contains new latitude and longitude.
location.latitude | `Number`                        | Latitude of new location.
location.longitude | `Number`                       | Longitude of new location.
options | `Object`                                  | One of chat_id, message_id or inline_message_id is required.
options.chat_id | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
options.message_id | `Number`                       | Identifier of the sent message.
options.inline_message_id | `String`                | Identifier of the inline message.

Example:
```js
client.editMessageLiveLocation(
  {
    latitude: 30,
    longitude: 45,
  },
  {
    message_id: MESSAGE_ID,
  }
);
```

<br />

### Group API

## `kickChatMember(chatId, userId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#kickchatmember)

Kicks a user from a group, a supergroup or a channel.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
userId  | `Number`                          | Unique identifier of the target user.
options | `Object`                          | Other optional parameters.

Example:
```js
client.kickChatMember(CHAT_ID, USER_ID, { until_date: UNIX_TIME });
```

<br />

## `unbanChatMember(chatId, userId)` - [Official Docs](https://core.telegram.org/bots/api/#unbanChatMember)

Unbans a previously kicked user in a supergroup or channel.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
userId | `Number`                          | Unique identifier of the target user.

Example:
```js
client.unbanChatMember(CHAT_ID, USER_ID);
```

<br />

## `restrictChatMember(chatId, userId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#restrictChatMember)

Restricts a user in a supergroup

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
userId  | `Number`                          | Unique identifier of the target user.
options | `Object`                          | Other optional parameters.

Example:
```js
client.restrictChatMember(CHAT_ID, USER_ID, { can_send_messages: true });
```

<br />

## `promoteChatMember(chatId, userId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#promoteChatMember)

Promotes or demotes a user in a supergroup or a channel.

Param   |  Type                             | Description
------- | --------------------------------- | -----------
chatId  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
userId  | `Number`                          | Unique identifier of the target user.
options | `Object`                          | Other optional parameters.

Example:
```js
client.promoteChatMember(CHAT_ID, USER_ID, {
  can_change_info: true,
  can_invite_users: true,
});
```

<br />

## `exportChatInviteLink(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#exportChatInviteLink)

Exports an invite link to a supergroup or a channel.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.exportChatInviteLink(CHAT_ID);
```

<br />

## `setChatPhoto(chatId, photo)` - [Official Docs](https://core.telegram.org/bots/api/#setChatPhoto)

Sets a new profile photo for the chat.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
photo  | `String`                          | Pass a file id (recommended) or HTTP URL to send photo.

Example:
```js
client.setChatPhoto(CHAT_ID, 'https://example.com/image.png');
```

<br />

## `deleteChatPhoto(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#deleteChatPhoto)

Deletes a chat photo.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.deleteChatPhoto(CHAT_ID);
```

<br />

## `setChatTitle(chatId, title)` - [Official Docs](https://core.telegram.org/bots/api/#setChatTitle)

Changes the title of a chat.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
title  | `String`                          | New chat title, 1-255 characters.

Example:
```js
client.setChatTitle(CHAT_ID, 'New Title');
```

<br />

## `setChatDescription(chatId, description)` - [Official Docs](https://core.telegram.org/bots/api/#setChatDescription)

Changes the description of a supergroup or a channel.

Param       |  Type                             | Description
----------- | --------------------------------- | -----------
chatId      | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
description | `String`                          | New chat description, 0-255 characters.

Example:
```js
client.setChatDescription(CHAT_ID, 'New Description');
```

<br />

## `pinChatMessage(chatId, messageId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#pinChatMessage)

Pins a message in a supergroup.

Param     |  Type                             | Description
--------- | --------------------------------- | -----------
chatId    | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
messageId | `Number`                          | Identifier of a message to pin.
options   | `Object`                          | Other optional parameters.

Example:
```js
client.pinChatMessage(CHAT_ID, MESSAGE_ID, { disable_notification: true });
```

<br />

## `unpinChatMessage(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#unpinChatMessage)

Unpins a message in a supergroup chat.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.unpinChatMessage(CHAT_ID);
```

<br />

## `leaveChat(chatId)` - [Official Docs](https://core.telegram.org/bots/api/#leaveChat)

Leaves a group, supergroup or channel.

Param  |  Type                             | Description
------ | --------------------------------- | -----------
chatId | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.

Example:
```js
client.leaveChat(CHAT_ID);
```

<br />

### Payments API

## `sendInvoice(chatId, product [, options])` - [Official Docs](https://core.telegram.org/bots/api/#sendinvoice)

Sends invoice.

Param                   |  Type                             | Description
----------------------- | --------------------------------- | -----------
chatId                  | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
product                 | `Object`                          | Object of the product.
product.title           | `String`                          | Product name.
product.description     | `String`                          | Product description.
product.payload         | `String`                          | Bot defined invoice payload.
product.provider_token  | `String`                          | Payments provider token.
product.start_parameter | `String`                          | Deep-linking parameter.
product.currency        | `String`                          | Three-letter ISO 4217 currency code.
product.prices          | `Array<Object>`                   | Breakdown of prices.
options                 | `Object`                          | Additional Telegram query options.

Example:
```js
client.sendInvoice(CHAT_ID, {
  title: 'product name',
  description: 'product description',
  payload: 'bot-defined invoice payload',
  provider_token: 'PROVIDER_TOKEN',
  start_parameter: 'pay',
  currency: 'USD',
  prices: [
    { label: 'product', amount: 11000 },
    { label: 'tax', amount: 11000 },
  ],
});
```

<br />

## `answerShippingQuery(shippingQueryId, ok [, options])` - [Official Docs](https://core.telegram.org/bots/api/#answershippingquery)

Reply to shipping queries.

Param           |  Type     | Description
--------------- | --------- | -----------
shippingQueryId | `String`  | Unique identifier for the query to be answered.
ok              | `Boolean` | Specify if delivery of the product is possible.
options         | `Object`  | Additional Telegram query options.

Example:
```js
client.answerShippingQuery('UNIQUE_ID', true);
```

<br />

## `answerPreCheckoutQuery(preCheckoutQueryId, ok [, options])` - [Official Docs](https://core.telegram.org/bots/api/#answerprecheckoutquery)

Respond to such pre-checkout queries.

Param              |  Type     | Description
------------------ | --------- | -----------
preCheckoutQueryId | `String`  | Unique identifier for the query to be answered.
ok                 | `Boolean` | Specify if delivery of the product is possible.
options            | `Object`  | Additional Telegram query options.

Example:
```js
client.answerPreCheckoutQuery('UNIQUE_ID', true);
```

<br />

### Others

## `forwardMessage(chatId, fromChatId, messageId [, options])` - [Official Docs](https://core.telegram.org/bots/api/#forwardmessage)

Forwards messages of any kind.

Param      |  Type                             | Description
---------- | --------------------------------- | -----------
chatId     | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target supergroup or channel.
fromChatId | <code>Number &#124; String</code> | Unique identifier for the chat where the original message was sent.
messageId  | `Number`                          | Message identifier in the chat specified in from_chat_id.
options    | `Object`                          | Other optional parameters.

Example:
```js
client.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID, {
  disable_notification: true,
});
```

<br />

## `stopMessageLiveLocation(options)` - [Official Docs](https://core.telegram.org/bots/api/#stopmessagelivelocation)

Stop updating a live location message sent by the bot or via the bot (for inline bots) before *live_period* expires.

Param      |  Type                                     | Description
---------- | ----------------------------------------- | -----------
identifier | `Object`                                  | One of chat_id, message_id or inline_message_id is required.
identifier.chat_id | <code>Number &#124; String</code> | Unique identifier for the target chat or username of the target channel.
identifier.message_id | `Number`                       | Identifier of the sent message.
identifier.inline_message_id | `String`                | Identifier of the inline message.

Example:
```js
client.stopMessageLiveLocation({ message_id: MESSAGE_ID });
```
