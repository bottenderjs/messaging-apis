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

`messaging-api-telegram` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

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

- [getWebhookInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getwebhookinfo)
- [getUpdates](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getupdates)
- [setWebhook](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#setwebhook)
- [deleteWebhook](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#deletewebhook)

<br />

<a id="send-api" />

### Send API - [Official Docs](https://core.telegram.org/bots/api#available-methods)

- [sendMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendmessage)
- [sendPhoto](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendphoto)
- [sendAudio](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendaudio)
- [sendDocument](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#senddocument)
- [sendSticker](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendsticker)
- [sendVideo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendvideo)
- [sendVoice](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendvoice)
- [sendVideoNote](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendvideonote)
- [sendMediaGroup](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendmediagroup)
- [sendLocation](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendlocation)
- [sendVenue](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendvenue)
- [sendContact](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendcontact)
- [sendChatAction](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendchataction)

<br />

### Get API

- [getMe](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getme)
- [getUserProfilePhotos](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getuserprofilephotos)
- [getFile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getfile)
- [getFileLink](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getfilelink)
- [getChat](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getchat)
- [getChatAdministrators](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getchatadministrators)
- [getChatMembersCount](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getchatmemberscount)
- [getChatMember](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getchatmember)

<br />

### Updating API

- [editMessageText](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#editmessagetext)
- [editMessageCaption](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#editmessagecaption)
- [editMessageReplyMarkup](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#editmessagereplymarkup)
- [deleteMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#deletemessage)
- [editMessageLiveLocation](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#editmessagelivelocation)
- [stopMessageLiveLocation](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#stopmessagelivelocation)

<br />

### Group API

- [kickChatMember](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#kickchatmember)
- [unbanChatMember](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#unbanchatmember)
- [restrictChatMember](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#restrictchatmember)
- [promoteChatMember](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#promotechatmember)
- [exportChatInviteLink](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#exportchatinvitelink)
- [deleteChatPhoto](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#deletechatphoto)
- [setChatTitle](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#setchattitle)
- [setChatDescription](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#setchatdescription)
- [setChatStickerSet](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#setchatstickerset)
- [deleteChatStickerSet](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#deletechatstickerset)
- [pinChatMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#pinchatmessage)
- [unpinChatMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#unpinchatmessage)
- [leaveChat](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#leavechat)

<br />

### Payments API

- [sendInvoice](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendinvoice)
- [answerShippingQuery](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#answershippingquery)
- [answerPreCheckoutQuery](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#answerprecheckoutquery)

<br />

### Inline mode API

- [answerInlineQuery](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#answerinlinequery)

<br />

### Game API

- [sendGame](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#sendgame)
- [setGameScore](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#setgamescore)
- [getGameHighScores](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#getgamehighscores)

<br />

### Others

- [forwardMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_telegram.telegramclient.html#forwardmessage)

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
