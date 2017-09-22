# messaging-api-viber

> Messaging API client for Viber

<img src="https://www.viber.com/app/uploads/Icon_1024.png" alt="Viber" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)


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
const client = ViberClient.connect(authToken);
```

<br />

## API Reference

All methods return a Promise.

<br />


## `setWebhook(url [, eventTypes])`

Example:
```js
client.setWebhook('https://4a16faff.ngrok.io/');
```

You can filter event types using optional parameter:

```js
client.setWebhook('https://4a16faff.ngrok.io/', [
  'delivered',
  'seen',
  'conversation_started',
]);
```

## `removeWebhook`

Example:
```js
client.removeWebhook();
```

## `sendMessage(receiver, message)`

Example:
```js
client.sendMessage(USER_ID, {
  type: 'text',
  text: 'Hello',
});
```

## `sendText(receiver, text [, options])`

Example:
```js
client.sendText(USER_ID, 'Hello');
```

## `sendPicture(receiver, picture)`

Example:
```js
client.sendPicture(USER_ID, {
  text: 'Photo description',
  media: 'http://www.images.com/img.jpg',
  thumbnail: 'http://www.images.com/thumb.jpg',
});
```

## `sendVideo(receiver, video)`

Example:
```js
client.sendVideo(USER_ID, {
  media: 'http://www.images.com/video.mp4',
  size: 10000,
  thumbnail: 'http://www.images.com/thumb.jpg',
  duration: 10,
});
```

## `sendFile(receiver, file)`

Example:
```js
client.sendFile(USER_ID, {
  media: 'http://www.images.com/file.doc',
  size: 10000,
  file_name: 'name_of_file.doc',
});
```

## `sendContact(receiver, contact [, options])`

Example:
```js
client.sendContact(USER_ID, {
  name: 'Itamar',
  phone_number: '+972511123123',
});
```

## `sendLocation(receiver, location [, options])`

Example:
```js
client.sendLocation(USER_ID, {
  lat: '37.7898',
  lon: '-122.3942',
});
```

## `sendURL(receiver, url [, options])`

Example:
```js
client.sendURL(USER_ID, 'http://developers.viber.com');
```

## `sendSticker(receiver, stickerId [, options])`

Example:
```js
client.sendSticker(USER_ID, 46105);
```

## `sendCarouselContent(receiver, richMedia [, options])`

Example:
```js
client.sendCarouselContent(USER_ID, {
  Type: 'rich_media',
  ButtonsGroupColumns: 6,
  ButtonsGroupRows: 7,
  BgColor: '#FFFFFF',
  Buttons: [
    {
      Columns: 6,
      Rows: 3,
      ActionType: 'open-url',
      ActionBody: 'https://www.google.com',
      Image: 'http://html-test:8080/myweb/guy/assets/imageRMsmall2.png',
    },
    {
      Columns: 6,
      Rows: 2,
      Text:
        '<font color=#323232><b>Headphones with Microphone, On-ear Wired earphones</b></font><font color=#777777><br>Sound Intone </font><font color=#6fc133>$17.99</font>',
      ActionType: 'open-url',
      ActionBody: 'https://www.google.com',
      TextSize: 'medium',
      TextVAlign: 'middle',
      TextHAlign: 'left',
    },
    {
      Columns: 6,
      Rows: 1,
      ActionType: 'reply',
      ActionBody: 'https://www.google.com',
      Text: '<font color=#ffffff>Buy</font>',
      TextSize: 'large',
      TextVAlign: 'middle',
      TextHAlign: 'middle',
      Image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
    },
    {
      Columns: 6,
      Rows: 1,
      ActionType: 'reply',
      ActionBody: 'https://www.google.com',
      Text: '<font color=#8367db>MORE DETAILS</font>',
      TextSize: 'small',
      TextVAlign: 'middle',
      TextHAlign: 'middle',
    },
    {
      Columns: 6,
      Rows: 3,
      ActionType: 'open-url',
      ActionBody: 'https://www.google.com',
      Image: 'https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png',
    },
    {
      Columns: 6,
      Rows: 2,
      Text:
        "<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
      ActionType: 'open-url',
      ActionBody: 'https://www.google.com',
      TextSize: 'medium',
      TextVAlign: 'middle',
      TextHAlign: 'left',
    },
    {
      Columns: 6,
      Rows: 1,
      ActionType: 'reply',
      ActionBody: 'https://www.google.com',
      Text: '<font color=#ffffff>Buy</font>',
      TextSize: 'large',
      TextVAlign: 'middle',
      TextHAlign: 'middle',
      Image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
    },
    {
      Columns: 6,
      Rows: 1,
      ActionType: 'reply',
      ActionBody: 'https://www.google.com',
      Text: '<font color=#8367db>MORE DETAILS</font>',
      TextSize: 'small',
      TextVAlign: 'middle',
      TextHAlign: 'middle',
    },
  ],
});
```
