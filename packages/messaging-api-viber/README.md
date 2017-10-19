# messaging-api-viber

> Messaging API client for Viber

<img src="https://user-images.githubusercontent.com/3382565/31753411-0be75dfc-b456-11e7-9eea-b976d21fcc53.png" alt="Viber" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [Webhook API](#webhook-api)
  * [Send API](#send-api)
  * [Keyboards](#keyboards)
  * [Get Account Info](#get-account-info)
  * [Get User Details](#get-user-details)
  * [Get Online](#get-online)


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

### Webhook API

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

<br />

## `removeWebhook`

Example:
```js
client.removeWebhook();
```

<br />

### Send API

## `sendMessage(receiver, message)`

Example:
```js
client.sendMessage(USER_ID, {
  type: 'text',
  text: 'Hello',
});
```

<br />

## `sendText(receiver, text [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481925-61e46008-aeeb-11e7-842f-79fee8066c6a.jpg" width="300" />

Example:
```js
client.sendText(USER_ID, 'Hello');
```

<br />

## `sendPicture(receiver, picture [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481916-5ec6cdac-aeeb-11e7-878b-6c8c4211a760.jpg" width="300" />

Example:
```js
client.sendPicture(USER_ID, {
  text: 'Photo description',
  media: 'http://www.images.com/img.jpg',
  thumbnail: 'http://www.images.com/thumb.jpg',
});
```

<br />

## `sendVideo(receiver, video [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481918-5fa12074-aeeb-11e7-8287-830197d93b5b.jpg" width="300" />

Example:
```js
client.sendVideo(USER_ID, {
  media: 'http://www.images.com/video.mp4',
  size: 10000,
  thumbnail: 'http://www.images.com/thumb.jpg',
  duration: 10,
});
```

<br />

## `sendFile(receiver, file [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481919-600f437e-aeeb-11e7-9f13-7269a055cb86.jpg" width="300" />

Example:
```js
client.sendFile(USER_ID, {
  media: 'http://www.images.com/file.doc',
  size: 10000,
  file_name: 'name_of_file.doc',
});
```

<br />

## `sendContact(receiver, contact [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481924-615ce8b2-aeeb-11e7-8425-2d3bfa115fc1.jpg" width="300" />

Example:
```js
client.sendContact(USER_ID, {
  name: 'Itamar',
  phone_number: '+972511123123',
});
```

<br />

## `sendLocation(receiver, location [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481923-61199a9e-aeeb-11e7-8a25-e3813eceb25b.jpg" width="300" />

Example:
```js
client.sendLocation(USER_ID, {
  lat: '37.7898',
  lon: '-122.3942',
});
```

<br />

## `sendURL(receiver, url [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481921-6069f346-aeeb-11e7-97bf-83a17da0bc7a.jpg" width="300" />

Example:
```js
client.sendURL(USER_ID, 'http://developers.viber.com');
```

<br />

## `sendSticker(receiver, stickerId [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481922-60c2c444-aeeb-11e7-8fc9-bce2e5d06c42.jpg" width="300" />

Example:
```js
client.sendSticker(USER_ID, 46105);
```

<br />

## `sendCarouselContent(receiver, richMedia [, options])`

<img src="https://user-images.githubusercontent.com/3382565/31481917-5f1b43b4-aeeb-11e7-8557-e25951d69b53.jpg" width="300" />

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

<br />

### Keyboards

The Viber API allows sending a custom keyboard using the send_message API, to supply the user with a set of predefined replies or actions. Keyboards can be attached to any message type and be sent and displayed together. To attach a keyboard to a message simply add the keyboard’s parameters to the options:

```js
client.sendText(USER_ID, 'Hello', {
  keyboard: {
    DefaultHeight: true,
    BgColor: '#FFFFFF',
    Buttons: [
      {
        Columns: 6,
        Rows: 1,
        BgColor: '#2db9b9',
        BgMediaType: 'gif',
        BgMedia: 'http://www.url.by/test.gif',
        BgLoop: true,
        ActionType: 'open-url',
        ActionBody: 'www.tut.by',
        Image: 'www.tut.by/img.jpg',
        Text: 'Key text',
        TextVAlign: 'middle',
        TextHAlign: 'center',
        TextOpacity: 60,
        TextSize: 'regular',
      },
    ],
  },
});
```

Which in turn will look like this:

<img src="https://developers.viber.com/docs/img/example_keyboard.png" width="300" />

<br />

### Get Account Info

## `getAccountInfo()`

Example:
```js
client.getAccountInfo().then(info => {
  console.log(info);
  // {
  //   status: 0,
  //   status_message: 'ok',
  //   id: 'pa:75346594275468546724',
  //   name: 'account name',
  //   uri: 'accountUri',
  //   icon: 'http://example.com',
  //   background: 'http://example.com',
  //   category: 'category',
  //   subcategory: 'sub category',
  //   location: {
  //     lon: 0.1,
  //     lat: 0.2,
  //   },
  //   country: 'UK',
  //   webhook: 'https://my.site.com',
  //   event_types: ['delivered', 'seen'],
  //   subscribers_count: 35,
  //   members: [
  //     {
  //       id: '01234567890A=',
  //       name: 'my name',
  //       avatar: 'http://example.com',
  //       role: 'admin',
  //     },
  //   ],
  // }
});
```

<br />

### Get User Details

## `getUserDetails(id)`

Example:
```js
client.getUserDetails('01234567890A=').then(user => {
  console.log(user);
  // {
  //   id: '01234567890A=',
  //   name: 'John McClane',
  //   avatar: 'http://avatar.example.com',
  //   country: 'UK',
  //   language: 'en',
  //   primary_device_os: 'android 7.1',
  //   api_version: 1,
  //   viber_version: '6.5.0',
  //   mcc: 1,
  //   mnc: 1,
  //   device_type: 'iPhone9,4',
  // };
});
```

<br />

### Get Online

## `getOnlineStatus(ids)`

Example:
```js
client
  .getOnlineStatus(['01234567890=', '01234567891=', '01234567893='])
  .then(status => {
    console.log(status);
    // [
    //   {
    //     id: '01234567890=',
    //     online_status: 0,
    //     online_status_message: 'online',
    //   },
    //   {
    //     id: '01234567891=',
    //     online_status: 1,
    //     online_status_message: 'offline',
    //     last_online: 1457764197627,
    //   },
    //   {
    //     id: '01234567893=',
    //     online_status: 3,
    //     online_status_message: 'tryLater',
    //   },
    // ];
  });
```
