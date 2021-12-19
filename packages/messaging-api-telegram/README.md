# messaging-api-telegram

> Messaging API client for Telegram

<img src="https://telegram.org/img/t_logo.png" alt="Telegram" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Webhook API](#webhook-api)
  - [Send API](#send-api)
  - [Get API](#get-api)
  - [Updating API](#updating-api)
  - [Group API](#group-api)
  - [Payments API](#payments-api)
  - [Inline Mode API](#inline-mode-api)
  - [Game API](#game-api)
  - [Others](#others)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

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
const client = new TelegramClient({
  accessToken: '12345678:AaBbCcDdwhatever',
});
```

### Error Handling

`messaging-api-telegram` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/bottenderjs/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.getWebhookInfo().catch((error) => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});
```

<br />

## API Reference

All methods return a Promise.

<br />

### Webhook API

- [getWebhookInfo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getwebhookinfo)
- [getUpdates](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getupdates)
- [setWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setwebhook)
- [deleteWebhook](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#deletewebhook)

<br />

<a id="send-api" />

### Send API - [Official Docs](https://core.telegram.org/bots/api#available-methods)

- [sendMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendmessage)
- [sendPhoto](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendphoto)
- [sendAudio](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendaudio)
- [sendDocument](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#senddocument)
- [sendSticker](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendsticker)
- [sendVideo](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvideo)
- [sendVoice](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvoice)
- [sendVideoNote](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvideonote)
- [sendMediaGroup](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendmediagroup)
- [sendLocation](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendlocation)
- [sendVenue](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendvenue)
- [sendContact](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendcontact)
- [sendChatAction](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendchataction)

<br />

### Get API

- [getMe](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getme)
- [getUserProfilePhotos](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getuserprofilephotos)
- [getFile](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getfile)
- [getFileLink](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getfilelink)
- [getChat](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getchat)
- [getChatAdministrators](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getchatadministrators)
- [getChatMembersCount](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getchatmemberscount)
- [getChatMember](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getchatmember)

<br />

### Updating API

- [editMessageText](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#editmessagetext)
- [editMessageCaption](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#editmessagecaption)
- [editMessageReplyMarkup](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#editmessagereplymarkup)
- [deleteMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#deletemessage)
- [editMessageLiveLocation](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#editmessagelivelocation)
- [stopMessageLiveLocation](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#stopmessagelivelocation)

<br />

### Group API

- [kickChatMember](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#kickchatmember)
- [unbanChatMember](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#unbanchatmember)
- [restrictChatMember](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#restrictchatmember)
- [promoteChatMember](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#promotechatmember)
- [exportChatInviteLink](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#exportchatinvitelink)
- [deleteChatPhoto](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#deletechatphoto)
- [setChatTitle](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setchattitle)
- [setChatDescription](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setchatdescription)
- [setChatStickerSet](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setchatstickerset)
- [deleteChatStickerSet](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#deletechatstickerset)
- [pinChatMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#pinchatmessage)
- [unpinChatMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#unpinchatmessage)
- [leaveChat](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#leavechat)

<br />

### Payments API

- [sendInvoice](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendinvoice)
- [answerShippingQuery](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#answershippingquery)
- [answerPreCheckoutQuery](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#answerprecheckoutquery)

<br />

### Inline mode API

- [answerInlineQuery](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#answerinlinequery)

<br />

### Game API

- [sendGame](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#sendgame)
- [setGameScore](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#setgamescore)
- [getGameHighScores](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#getgamehighscores)

<br />

### Others

- [forwardMessage](https://bottenderjs.github.io/messaging-apis/latest/classes/messaging_api_telegram.TelegramClient.html#forwardmessage)

<br />

## Debug Tips

### Log Requests Details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api:request
```

If you want to use a custom request logging function, just provide your own `onRequest`:

```js
const client = new TelegramClient({
  accessToken: ACCESS_TOKEN,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Testing

### Point Requests to Your Dummy Server

To avoid sending requests to real Telegram server, specify the `origin` option when constructing your client:

```js
const { TelegramClient } = require('messaging-api-telegram');

const client = new TelegramClient({
  accessToken: ACCESS_TOKEN,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on your production server.
