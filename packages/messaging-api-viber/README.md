# messaging-api-viber

> Messaging API client for Viber

<img src="https://user-images.githubusercontent.com/3382565/31753411-0be75dfc-b456-11e7-9eea-b976d21fcc53.png" alt="Viber" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Webhook API](#webhook-api)
  - [Send API](#send-api)
  - [Keyboards](#keyboards)
  - [Broadcast API](#broadcast-api)
  - [Get Account Info](#get-account-info)
  - [Get User Details](#get-user-details)
  - [Get Online](#get-online)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

## Installation

```sh
npm i --save messaging-api-viber
```

or

```sh
yarn add messaging-api-viber
```

<br />

## Usage

### Initialize

```js
const { ViberClient } = require('messaging-api-viber');

// get authToken from the "edit info" screen of your Public Account.
const client = new ViberClient({
  accessToken: authToken,
  sender: {
    name: 'Sender',
  },
});
```

### Error Handling

`messaging-api-viber` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.setWebhook(url).catch((error) => {
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

- [setWebhook](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#setwebhook)
- [removeWebhook](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#removewebhook)

<br />

### Send API

- [sendMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendmessage)
- [sendText](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendtext)
- [sendPicture](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendpicture)
- [sendVideo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendvideo)
- [sendFile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendfile)
- [sendContact](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendcontact)
- [sendLocation](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendlocation)
- [sendURL](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendurl)
- [sendSticker](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendsticker)
- [sendCarouselContent](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#sendcarouselcontent)

<br />

<a id="keyboards" />

### Keyboards - [Official Docs](https://developers.viber.com/docs/api/rest-bot-api/#keyboards)

The Viber API allows sending a custom keyboard using the send_message API, to supply the user with a set of predefined replies or actions. Keyboards can be attached to any message type and be sent and displayed together. To attach a keyboard to a message simply add the keyboard’s parameters to the options:

```js
client.sendText(USER_ID, 'Hello', {
  keyboard: {
    type: 'keyboard',
    defaultHeight: true,
    bgColor: '#FFFFFF',
    buttons: [
      {
        columns: 6,
        rows: 1,
        bgColor: '#2db9b9',
        bgMediaType: 'gif',
        bgMedia: 'http://www.url.by/test.gif',
        bgLoop: true,
        actionType: 'open-url',
        actionBody: 'www.tut.by',
        image: 'www.tut.by/img.jpg',
        text: 'Key text',
        textVAlign: 'middle',
        textHAlign: 'center',
        textOpacity: 60,
        textSize: 'regular',
      },
    ],
  },
});
```

<img src="https://developers.viber.com/docs/img/example_keyboard.png" width="300" />

<br />

<a id="broadcast-api" />

### Broadcast API - [Official Docs](https://developers.viber.com/docs/api/rest-bot-api/#broadcast-message)

Those API methods use the same parameters as the send methods with a few variations described below. You should specify a list of receivers instead of a single receiver.

- [broadcastMessage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastmessage)
- [broadcastText](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcasttext)
- [broadcastPicture](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastpicture)
- [broadcastVideo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastvideo)
- [broadcastFile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastfile)
- [broadcastContact](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastcontact)
- [broadcastLocation](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastlocation)
- [broadcastURL](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcasturl)
- [broadcastSticker](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcaststicker)
- [broadcastCarouselContent](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#broadcastcarouselcontent)

| Param         | Type            | Description                                                                                                                                                        |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| broadcastList | `Array<String>` | This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers. |

Example:

```js
await client.broadcastText(
  [
    'pttm25kSGUo1919sBORWyA==',
    '2yBSIsbzs7sSrh4oLm2hdQ==',
    'EGAZ3SZRi6zW1D0uNYhQHg==',
    'kBQYX9LrGyF5mm8JTxdmpw==',
  ],
  'a broadcast to everybody'
);
// {
//   messageToken: 40808912438712,
//   status: 0,
//   statusMessage: 'ok',
//   failedList: [
//     {
//       receiver: 'pttm25kSGUo1919sBORWyA==',
//       status: 6,
//       statusMessage: 'Not subscribed',
//     },
//     {
//       receiver: 'EGAZ3SZRi6zW1D0uNYhQHg==',
//       status: 5,
//       statusMessage: 'Not found',
//     },
//   ],
// }
```

<br />

### Get Account Info

- [getAccountInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#getaccountinfo)

<br />

### Get User Details

- [getUserDetails](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#getuserdetails)

<br />

### Get Online

- [getOnlineStatus](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_viber.ViberClient.html#getonlinestatus)

<br />

## Debug Tips

### Log Requests Details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api:request
```

If you want to use a custom request logging function, just provide your own `onRequest`:

```js
const client = new ViberClient({
  accessToken: ACCESS_TOKEN,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Testing

### Point Requests to Your Dummy Server

To avoid sending requests to real Viber server, specify the `origin` option when constructing your client:

```js
const { ViberClient } = require('messaging-api-viber');

const client = new ViberClient({
  accessToken: ACCESS_TOKEN,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on your production server.
