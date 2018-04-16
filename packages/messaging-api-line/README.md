# messaging-api-line

> Messaging API client for LINE

<img src="http://is5.mzstatic.com/image/thumb/Purple117/v4/01/c2/4d/01c24d99-4aae-71ea-24e2-d0b68f8c53d2/source/1200x630bb.jpg" alt="LINE" width="150" />

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API Reference](#api-reference)
  * [Reply API](#reply-api)
    * [Imagemap Message](#reply-imagemap-message)
    * [Template Messages](#reply-template-messages)
  * [Push API](#push-api)
    * [Imagemap Message](#push-imagemap-message)
    * [Template Messages](#push-template-messages)
  * [Multicast API](#multicast-api)
    * [Imagemap Message](#multicast-imagemap-message)
    * [Template Messages](#multicast-template-messages)
  * [Content API](#content-api)
  * [Profile API](#profile-api)
  * [Group/Room Member Profile API](#grouproom-member-profile-api)
  * [Group/Room Member IDs API](#grouproom-member-ids-api)
  * [Leave API](#leave-api)
  * [Rich Menu API](#rich-menu-api)
* [Test](#test)

## Installation

```sh
npm i --save messaging-api-line
```

or

```sh
yarn add messaging-api-line
```

<br />

## Usage

### Initialize

```js
const { LineClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = LineClient.connect(accessToken, channelSecret);
```

<br />

## API Reference

All methods return a Promise.

<br />

<a id="reply-api" />

### Reply API - [Official Docs](https://devdocs.line.me/en/#reply-message)

Responds to events from users, groups, and rooms.

## `reply(token, messages)`

Responds messages using specified reply token.

| Param    | Type            | Description                                                             |
| -------- | --------------- | ----------------------------------------------------------------------- |
| token    | `String`        | `replyToken` received via webhook.                                      |
| messages | `Array<Object>` | Array of objects which contains the contents of the message to be sent. |

Example:

```js
client.reply(REPLY_TOKEN, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

`replyToken` can only be used once, but you can send up to 5 messages using the same token.

```js
const { Line } = require('messaging-api-line');

client.reply(REPLY_TOKEN, [
  Line.createText('Hello'),
  Line.createImage(
    'https://example.com/original.jpg',
    'https://example.com/preview.jpg'
  ),
  Line.createText('End'),
]);
```

<br />

## `replyText(token, text)`

Responds text message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/text-bf530b30.png" width="250px" />

You can include LINE original emoji in text messages using character codes. For a list of LINE emoji that can be sent in LINE chats, see the [emoji list](https://developers.line.me/media/messaging-api/emoji-list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/emoji-b3285d27.png" width="250px" />

| Param | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| token | `String` | `replyToken` received via webhook. |
| text  | `String` | Text of the message to be sent.    |

Example:

```js
client.reply(REPLY_TOKEN, 'Hello!');
```

<br />

## `replyImage(token, imageUrl, previewImageUrl)`

Responds image message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/image-167efb33.png" width="250px" /><img src="https://developers.line.me/media/messaging-api/messages/image-full-04fbba55.png" width="250px" />

| Param           | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| token           | `String` | `replyToken` received via webhook. |
| imageUrl        | `String` | Image URL.                         |
| previewImageUrl | `String` | Preview image URL.                 |

Example:

```js
client.replyImage(
  REPLY_TOKEN,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

## `replyVideo(token, videoUrl, previewImageUrl)`

Responds video message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/video-a1bc08a4.png" width="250px" />

| Param           | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| token           | `String` | `replyToken` received via webhook. |
| videoUrl        | `String` | URL of video file.                 |
| previewImageUrl | `String` | URL of preview image.              |

Example:

```js
client.replyVideo(
  REPLY_TOKEN,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

## `replyAudio(token, audioUrl, duration)`

Responds audio message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/audio-6290d91b.png" width="250px" />

| Param    | Type     | Description                        |
| -------- | -------- | ---------------------------------- |
| token    | `String` | `replyToken` received via webhook. |
| audioUrl | `String` | URL of audio file.                 |
| duration | `Number` | Length of audio file.              |

Example:

```js
client.replyAudio(REPLY_TOKEN, 'https://example.com/original.m4a', 240000);
```

<br />

## `replyLocation(token, location)`

Responds location message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/location-8f9b6b79.png" width="250px" />

| Param              | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| token              | `String` | `replyToken` received via webhook.     |
| location           | `Object` | Object contains location's parameters. |
| location.title     | `String` | Title of the location.                 |
| location.address   | `String` | Address of the location.               |
| location.latitude  | `Number` | Latitude of the location.              |
| location.longitude | `Number` | Longitude of the location.             |

Example:

```js
client.replyLocation(REPLY_TOKEN, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

## `replySticker(token, packageId, stickerId)`

Responds sticker message using specified reply token.  
For a list of stickers that can be sent with the Messaging API, see the [sticker list](https://developers.line.me/media/messaging-api/messages/sticker_list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/sticker-cb1a6a3a.png" width="250px" />

| Param     | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| token     | `String` | `replyToken` received via webhook. |
| packageId | `String` | Package ID.                        |
| stickerId | `String` | Sticker ID.                        |

Example:

```js
client.replySticker(REPLY_TOKEN, '1', '1');
```

<br />

### Reply Imagemap Message

## `replyImagemap(token, altText, imagemap)`

Responds imagemap message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/imagemap-dd854fa7.png" width="250px" />

| Param                    | Type            | Description                            |
| ------------------------ | --------------- | -------------------------------------- |
| token                    | `String`        | `replyToken` received via webhook.     |
| altText                  | `String`        | Alternative text.                      |
| imagemap                 | `Object`        | Object contains imagemap's parameters. |
| imagemap.baseUrl         | `String`        | Base URL of image.                     |
| imagemap.baseSize        | `Object`        | Base size object.                      |
| imagemap.baseSize.width  | `Number`        | Width of base image.                   |
| imagemap.baseSize.height | `Number`        | Height of base image.                  |
| imagemap.actions         | `Array<Object>` | Action when tapped.                    |

Example:

```js
client.replyImagemap(REPLY_TOKEN, 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseSize: {
    width: 1040,
    height: 1040,
  },
  actions: [
    {
      type: 'uri',
      linkUri: 'https://example.com/',
      area: {
        x: 0,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
    {
      type: 'message',
      text: 'hello',
      area: {
        x: 520,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
  ],
});
```

<br />

### Reply Template Messages

## `replyTemplate(token, altText, template)`

Responds template message using specified reply token.

| Param    | Type     | Description                               |
| -------- | -------- | ----------------------------------------- |
| token    | `String` | `replyToken` received via webhook.        |
| altText  | `String` | Alternative text.                         |
| template | `Object` | Object with the contents of the template. |

Example:

```js
client.replyTemplate(REPLY_TOKEN, 'this is a template', {
  type: 'buttons',
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `replyButtonTemplate(token, altText, buttonTemplate)`

Responds button template message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/buttons-86e14165.png" width="250px" />

| Param                               | Type            | Description                                                                                   |
| ----------------------------------- | --------------- | --------------------------------------------------------------------------------------------- |
| token                               | `String`        | `replyToken` received via webhook.                                                            |
| altText                             | `String`        | Alternative text.                                                                             |
| buttonTemplate                      | `Object`        | Object contains buttonTemplate's parameters.                                                  |
| buttonTemplate.thumbnailImageUrl    | `String`        | Image URL of buttonTemplate.                                                                  |
| buttonTemplate.imageAspectRatio     | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square`         |
| buttonTemplate.imageSize            | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`                    |
| buttonTemplate.imageBackgroundColor | `String`        | Background color of image. Specify a RGB color value. The default value is `#FFFFFF` (white). |
| buttonTemplate.title                | `String`        | Title of buttonTemplate.                                                                      |
| buttonTemplate.text                 | `String`        | Message text of buttonTemplate.                                                               |
| buttonTemplate.actions              | `Array<Object>` | Action when tapped.                                                                           |

Example:

```js
client.replyButtonTemplate(REPLY_TOKEN, 'this is a template', {
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `replyConfirmTemplate(token, altText, confirmTemplate)`

Responds confirm template message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/confirm-444aead5.png" width="250px" />

| Param                   | Type            | Description                                   |
| ----------------------- | --------------- | --------------------------------------------- |
| token                   | `String`        | `replyToken` received via webhook.            |
| altText                 | `String`        | Alternative text.                             |
| confirmTemplate         | `Object`        | Object contains confirmTemplate's parameters. |
| confirmTemplate.text    | `String`        | Message text of confirmTemplate.              |
| confirmTemplate.actions | `Array<Object>` | Action when tapped.                           |

Example:

```js
client.replyConfirmTemplate(REPLY_TOKEN, 'this is a confirm template', {
  text: 'Are you sure?',
  actions: [
    {
      type: 'message',
      label: 'Yes',
      text: 'yes',
    },
    {
      type: 'message',
      label: 'No',
      text: 'no',
    },
  ],
});
```

<br />

## `replyCarouselTemplate(token, altText, carouselItems, options)`

Responds carousel template message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/carousel-c59baef6.png" width="250px" />

| Param                    | Type            | Description                                                                           |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| token                    | `String`        | `replyToken` received via webhook.                                                    |
| altText                  | `String`        | Alternative text.                                                                     |
| carouselItems            | `Array<Object>` | Array of columns which contains object for carousel.                                  |
| options                  | `Object`        | Object contains options.                                                              |
| options.imageAspectRatio | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square` |
| options.imageSize        | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`            |

Example:

```js
client.replyCarouselTemplate(REPLY_TOKEN, 'this is a carousel template', [
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=111',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/111',
      },
    ],
  },
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=222',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=222',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    ],
  },
]);
```

<br />

## `replyImageCarouselTemplate(token, altText, carouselItems)`

Responds image carousel template message using specified reply token.

<img src="https://developers.line.me/media/messaging-api/messages/image-carousel-301701f6.png" width="250px" />

| Param         | Type            | Description                                                |
| ------------- | --------------- | ---------------------------------------------------------- |
| token         | `String`        | `replyToken` received via webhook.                         |
| altText       | `String`        | Alternative text.                                          |
| carouselItems | `Array<Object>` | Array of columns which contains object for image carousel. |

Example:

```js
client.replyImageCarouselTemplate(
  REPLY_TOKEN,
  'this is an image carousel template',
  [
    {
      imageUrl: 'https://example.com/bot/images/item1.jpg',
      action: {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item2.jpg',
      action: {
        type: 'message',
        label: 'Yes',
        text: 'yes',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item3.jpg',
      action: {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    },
  ]
);
```

<br />

<a id="push-api" />

### Push API - [Official Docs](https://devdocs.line.me/en/#push-message)

Sends messages to a user, group, or room at any time.

## `push(userId, messages)`

Sends messages using ID of the receiver.

| Param    | Type            | Description                                                             |
| -------- | --------------- | ----------------------------------------------------------------------- |
| userId   | `String`        | ID of the receiver.                                                     |
| messages | `Array<Object>` | Array of objects which contains the contents of the message to be sent. |

Example:

```js
client.push(USER_ID, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

<br />

## `pushText(userId, text)`

Sends text message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/text-bf530b30.png" width="250px" />

You can include LINE original emoji in text messages using character codes. For a list of LINE emoji that can be sent in LINE chats, see the [emoji list](https://developers.line.me/media/messaging-api/emoji-list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/emoji-b3285d27.png" width="250px" />

| Param  | Type     | Description                     |
| ------ | -------- | ------------------------------- |
| userId | `String` | ID of the receiver.             |
| text   | `String` | Text of the message to be sent. |

Example:

```js
client.pushText(USER_ID, 'Hello!');
```

<br />

## `pushImage(userId, imageUrl, previewImageUrl)`

Sends image message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/image-167efb33.png" width="250px" /><img src="https://developers.line.me/media/messaging-api/messages/image-full-04fbba55.png" width="250px" />

| Param           | Type     | Description         |
| --------------- | -------- | ------------------- |
| userId          | `String` | ID of the receiver. |
| imageUrl        | `String` | Image URL.          |
| previewImageUrl | `String` | Preview image URL.  |

Example:

```js
client.pushImage(
  USER_ID,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

## `pushVideo(userId, videoUrl, previewImageUrl)`

Sends video message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/video-a1bc08a4.png" width="250px" />

| Param           | Type     | Description           |
| --------------- | -------- | --------------------- |
| userId          | `String` | ID of the receiver.   |
| videoUrl        | `String` | URL of video file.    |
| previewImageUrl | `String` | URL of preview image. |

Example:

```js
client.pushVideo(
  USER_ID,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

## `pushAudio(userId, audioUrl, duration)`

Sends audio message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/audio-6290d91b.png" width="250px" />

| Param    | Type     | Description           |
| -------- | -------- | --------------------- |
| userId   | `String` | ID of the receiver.   |
| audioUrl | `String` | URL of audio file.    |
| duration | `Number` | Length of audio file. |

Example:

```js
client.pushAudio(USER_ID, 'https://example.com/original.m4a', 240000);
```

<br />

## `pushLocation(userId, location)`

Sends location message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/location-8f9b6b79.png" width="250px" />

| Param              | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| userId             | `String` | ID of the receiver.                    |
| location           | `Object` | Object contains location's parameters. |
| location.title     | `String` | Title of the location.                 |
| location.address   | `String` | Address of the location.               |
| location.latitude  | `Number` | Latitude of the location.              |
| location.longitude | `Number` | Longitude of the location.             |

Example:

```js
client.pushLocation(USER_ID, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

## `pushSticker(userId, packageId, stickerId)`

Sends sticker message using ID of the receiver.  
For a list of stickers that can be sent with the Messaging API, see the [sticker list](https://developers.line.me/media/messaging-api/messages/sticker_list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/sticker-cb1a6a3a.png" width="250px" />

| Param     | Type     | Description         |
| --------- | -------- | ------------------- |
| userId    | `String` | ID of the receiver. |
| packageId | `String` | Package ID.         |
| stickerId | `String` | Sticker ID.         |

Example:

```js
client.pushSticker(USER_ID, '1', '1');
```

<br />

### Push Imagemap Message

## `pushImagemap(userId, altText, imagemap)`

Sends imagemap message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/imagemap-dd854fa7.png" width="250px" />

| Param                    | Type            | Description                            |
| ------------------------ | --------------- | -------------------------------------- |
| userId                   | `String`        | ID of the receiver.                    |
| altText                  | `String`        | Alternative text.                      |
| imagemap                 | `Object`        | Object contains imagemap's parameters. |
| imagemap.baseUrl         | `String`        | Base URL of image.                     |
| imagemap.baseSize        | `Object`        | Base size object.                      |
| imagemap.baseSize.width  | `Number`        | Width of base image.                   |
| imagemap.baseSize.height | `Number`        | Height of base image.                  |
| imagemap.actions         | `Array<Object>` | Action when tapped.                    |

Example:

```js
client.pushImagemap(USER_ID, 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseSize: {
    width: 1040,
    height: 1040,
  },
  actions: [
    {
      type: 'uri',
      linkUri: 'https://example.com/',
      area: {
        x: 0,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
    {
      type: 'message',
      text: 'hello',
      area: {
        x: 520,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
  ],
});
```

<br />

### Push Template Messages

## `pushTemplate(userId, altText, template)`

Sends template message using ID of the receiver.

| Param    | Type     | Description                               |
| -------- | -------- | ----------------------------------------- |
| userId   | `String` | ID of the receiver.                       |
| altText  | `String` | Alternative text.                         |
| template | `Object` | Object with the contents of the template. |

Example:

```js
client.pushTemplate(USER_ID, 'this is a template', {
  type: 'buttons',
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `pushButtonTemplate(userId, altText, buttonTemplate)`

Sends button template message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/buttons-86e14165.png" width="250px" />

| Param                               | Type            | Description                                                                                   |
| ----------------------------------- | --------------- | --------------------------------------------------------------------------------------------- |
| userId                              | `String`        | ID of the receiver.                                                                           |
| altText                             | `String`        | Alternative text.                                                                             |
| buttonTemplate                      | `Object`        | Object contains buttonTemplate's parameters.                                                  |
| buttonTemplate.thumbnailImageUrl    | `String`        | Image URL of buttonTemplate.                                                                  |
| buttonTemplate.imageAspectRatio     | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square`         |
| buttonTemplate.imageSize            | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`                    |
| buttonTemplate.imageBackgroundColor | `String`        | Background color of image. Specify a RGB color value. The default value is `#FFFFFF` (white). |
| buttonTemplate.title                | `String`        | Title of buttonTemplate.                                                                      |
| buttonTemplate.text                 | `String`        | Message text of buttonTemplate.                                                               |
| buttonTemplate.actions              | `Array<Object>` | Action when tapped.                                                                           |

Example:

```js
client.pushButtonTemplate(USER_ID, 'this is a template', {
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `pushConfirmTemplate(userId, altText, confirmTemplate)`

Sends confirm template message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/confirm-444aead5.png" width="250px" />

| Param                   | Type            | Description                                   |
| ----------------------- | --------------- | --------------------------------------------- |
| userId                  | `String`        | ID of the receiver.                           |
| altText                 | `String`        | Alternative text.                             |
| confirmTemplate         | `Object`        | Object contains confirmTemplate's parameters. |
| confirmTemplate.text    | `String`        | Message text of confirmTemplate.              |
| confirmTemplate.actions | `Array<Object>` | Action when tapped.                           |

Example:

```js
client.pushConfirmTemplate(USER_ID, 'this is a confirm template', {
  text: 'Are you sure?',
  actions: [
    {
      type: 'message',
      label: 'Yes',
      text: 'yes',
    },
    {
      type: 'message',
      label: 'No',
      text: 'no',
    },
  ],
});
```

<br />

## `pushCarouselTemplate(userId, altText, carouselItems, options)`

Sends carousel template message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/carousel-c59baef6.png" width="250px" />

| Param                    | Type            | Description                                                                           |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| userId                   | `String`        | ID of the receiver.                                                                   |
| altText                  | `String`        | Alternative text.                                                                     |
| carouselItems            | `Array<Object>` | Array of columns which contains object for carousel.                                  |
| options                  | `Object`        | Object contains options.                                                              |
| options.imageAspectRatio | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square` |
| options.imageSize        | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`            |

Example:

```js
client.pushCarouselTemplate(USER_ID, 'this is a carousel template', [
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=111',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/111',
      },
    ],
  },
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=222',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=222',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    ],
  },
]);
```

<br />

## `pushImageCarouselTemplate(userId, altText, carouselItems)`

Sends image carousel template message using ID of the receiver.

<img src="https://developers.line.me/media/messaging-api/messages/image-carousel-301701f6.png" width="250px" />

| Param         | Type            | Description                                                |
| ------------- | --------------- | ---------------------------------------------------------- |
| userId        | `String`        | ID of the receiver.                                        |
| altText       | `String`        | Alternative text.                                          |
| carouselItems | `Array<Object>` | Array of columns which contains object for image carousel. |

Example:

```js
client.pushImageCarouselTemplate(
  USER_ID,
  'this is an image carousel template',
  [
    {
      imageUrl: 'https://example.com/bot/images/item1.jpg',
      action: {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item2.jpg',
      action: {
        type: 'message',
        label: 'Yes',
        text: 'yes',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item3.jpg',
      action: {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    },
  ]
);
```

<br />

<a id="multicast-api" />

### Multicast API - [Official Docs](https://devdocs.line.me/en/#multicast)

Sends messages to multiple users at any time.

## `multicast(userIds, messages)`

Sends messages to multiple users.

| Param    | Type            | Description                                                             |
| -------- | --------------- | ----------------------------------------------------------------------- |
| userIds  | `Array<String>` | IDs of the receivers.                                                   |
| messages | `Array<Object>` | Array of objects which contains the contents of the message to be sent. |

Example:

```js
client.multicast(
  [USER_ID],
  [
    {
      type: 'text',
      text: 'Hello!',
    },
  ]
);
```

<br />

## `multicastText(userIds, text)`

Sends text message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/text-bf530b30.png" width="250px" />

You can include LINE original emoji in text messages using character codes. For a list of LINE emoji that can be sent in LINE chats, see the [emoji list](https://developers.line.me/media/messaging-api/emoji-list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/emoji-b3285d27.png" width="250px" />

| Param   | Type            | Description                     |
| ------- | --------------- | ------------------------------- |
| userIds | `Array<String>` | IDs of the receivers.           |
| text    | `String`        | Text of the message to be sent. |

Example:

```js
client.multicastText([USER_ID], 'Hello!');
```

<br />

## `multicastImage(userIds, imageUrl, previewImageUrl)`

Sends image message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/image-167efb33.png" width="250px" /><img src="https://developers.line.me/media/messaging-api/messages/image-full-04fbba55.png" width="250px" />

| Param           | Type            | Description           |
| --------------- | --------------- | --------------------- |
| userIds         | `Array<String>` | IDs of the receivers. |
| imageUrl        | `String`        | Image URL.            |
| previewImageUrl | `String`        | Preview image URL.    |

Example:

```js
client.multicastImage(
  [USER_ID],
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

## `multicastVideo(userIds, videoUrl, previewImageUrl)`

Sends video message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/video-a1bc08a4.png" width="250px" />

| Param           | Type            | Description           |
| --------------- | --------------- | --------------------- |
| userIds         | `Array<String>` | IDs of the receivers. |
| videoUrl        | `String`        | URL of video file.    |
| previewImageUrl | `String`        | URL of preview image. |

Example:

```js
client.multicastVideo(
  [USER_ID],
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

## `multicastAudio(userIds, audioUrl, duration)`

Sends audio message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/audio-6290d91b.png" width="250px" />

| Param    | Type            | Description           |
| -------- | --------------- | --------------------- |
| userIds  | `Array<String>` | IDs of the receivers. |
| audioUrl | `String`        | URL of audio file.    |
| duration | `Number`        | Length of audio file. |

Example:

```js
client.multicastAudio([USER_ID], 'https://example.com/original.m4a', 240000);
```

<br />

## `multicastLocation(userIds, location)`

Sends location message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/location-8f9b6b79.png" width="250px" />

| Param              | Type            | Description                            |
| ------------------ | --------------- | -------------------------------------- |
| userIds            | `Array<String>` | IDs of the receivers.                  |
| location           | `Object`        | Object contains location's parameters. |
| location.title     | `String`        | Title of the location.                 |
| location.address   | `String`        | Address of the location.               |
| location.latitude  | `Number`        | Latitude of the location.              |
| location.longitude | `Number`        | Longitude of the location.             |

Example:

```js
client.multicastLocation([USER_ID], {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

## `multicastSticker(userIds, packageId, stickerId)`

Sends sticker message to multiple users.  
For a list of stickers that can be sent with the Messaging API, see the [sticker list](https://developers.line.me/media/messaging-api/messages/sticker_list.pdf).

<img src="https://developers.line.me/media/messaging-api/messages/sticker-cb1a6a3a.png" width="250px" />

| Param     | Type            | Description           |
| --------- | --------------- | --------------------- |
| userIds   | `Array<String>` | IDs of the receivers. |
| packageId | `String`        | Package ID.           |
| stickerId | `String`        | Sticker ID.           |

Example:

```js
client.multicastSticker([USER_ID], '1', '1');
```

<br />

### Multicast Imagemap Message

## `multicastImagemap(userIds, altText, imagemap)`

Sends imagemap message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/imagemap-dd854fa7.png" width="250px" />

| Param                    | Type            | Description                            |
| ------------------------ | --------------- | -------------------------------------- |
| userIds                  | `Array<String>` | IDs of the receivers.                  |
| altText                  | `String`        | Alternative text.                      |
| imagemap                 | `Object`        | Object contains imagemap's parameters. |
| imagemap.baseUrl         | `String`        | Base URL of image.                     |
| imagemap.baseSize        | `Object`        | Base size object.                      |
| imagemap.baseSize.width  | `Number`        | Width of base image.                   |
| imagemap.baseSize.height | `Number`        | Height of base image.                  |
| imagemap.actions         | `Array<Object>` | Action when tapped.                    |

Example:

```js
client.multicastImagemap([USER_ID], 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseSize: {
    width: 1040,
    height: 1040,
  },
  actions: [
    {
      type: 'uri',
      linkUri: 'https://example.com/',
      area: {
        x: 0,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
    {
      type: 'message',
      text: 'hello',
      area: {
        x: 520,
        y: 0,
        width: 520,
        height: 1040,
      },
    },
  ],
});
```

<br />

### Multicast Template Messages

## `multicastTemplate(userIds, altText, template)`

Sends template message to multiple users.

| Param    | Type            | Description                               |
| -------- | --------------- | ----------------------------------------- |
| userIds  | `Array<String>` | IDs of the receivers.                     |
| altText  | `String`        | Alternative text.                         |
| template | `Object`        | Object with the contents of the template. |

Example:

```js
client.multicastTemplate([USER_ID], 'this is a template', {
  type: 'buttons',
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `multicastButtonTemplate(userIds, altText, buttonTemplate)`

Sends button template message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/buttons-86e14165.png" width="250px" />

| Param                               | Type            | Description                                                                                   |
| ----------------------------------- | --------------- | --------------------------------------------------------------------------------------------- |
| userIds                             | `Array<String>` | IDs of the receivers.                                                                         |
| altText                             | `String`        | Alternative text.                                                                             |
| buttonTemplate                      | `Object`        | Object contains buttonTemplate's parameters.                                                  |
| buttonTemplate.thumbnailImageUrl    | `String`        | Image URL of buttonTemplate.                                                                  |
| buttonTemplate.imageAspectRatio     | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square`         |
| buttonTemplate.imageSize            | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`                    |
| buttonTemplate.imageBackgroundColor | `String`        | Background color of image. Specify a RGB color value. The default value is `#FFFFFF` (white). |
| buttonTemplate.title                | `String`        | Title of buttonTemplate.                                                                      |
| buttonTemplate.text                 | `String`        | Message text of buttonTemplate.                                                               |
| buttonTemplate.actions              | `Array<Object>` | Action when tapped.                                                                           |

Example:

```js
client.multicastButtonTemplate([USER_ID], 'this is a template', {
  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
  title: 'Menu',
  text: 'Please select',
  actions: [
    {
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123',
    },
    {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123',
    },
    {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123',
    },
  ],
});
```

<br />

## `multicastConfirmTemplate(userIds, altText, confirmTemplate)`

Sends confirm template message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/confirm-444aead5.png" width="250px" />

| Param                   | Type            | Description                                   |
| ----------------------- | --------------- | --------------------------------------------- |
| userIds                 | `Array<String>` | IDs of the receivers.                         |
| altText                 | `String`        | Alternative text.                             |
| confirmTemplate         | `Object`        | Object contains confirmTemplate's parameters. |
| confirmTemplate.text    | `String`        | Message text of confirmTemplate.              |
| confirmTemplate.actions | `Array<Object>` | Action when tapped.                           |

Example:

```js
client.multicastConfirmTemplate([USER_ID], 'this is a confirm template', {
  text: 'Are you sure?',
  actions: [
    {
      type: 'message',
      label: 'Yes',
      text: 'yes',
    },
    {
      type: 'message',
      label: 'No',
      text: 'no',
    },
  ],
});
```

<br />

## `multicastCarouselTemplate(userIds, altText, carouselItems, options)`

Sends carousel template message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/carousel-c59baef6.png" width="250px" />

| Param                    | Type            | Description                                                                           |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| userIds                  | `Array<String>` | IDs of the receivers.                                                                 |
| altText                  | `String`        | Alternative text.                                                                     |
| carouselItems            | `Array<Object>` | Array of columns which contains object for carousel.                                  |
| options                  | `Object`        | Object contains options.                                                              |
| options.imageAspectRatio | `String`        | Aspect ratio of the image. Specify one of the following values: `rectangle`, `square` |
| options.imageSize        | `String`        | Size of the image. Specify one of the following values: `cover`, `contain`            |

Example:

```js
client.multicastCarouselTemplate([USER_ID], 'this is a carousel template', [
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=111',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/111',
      },
    ],
  },
  {
    thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
    title: 'this is menu',
    text: 'description',
    actions: [
      {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=222',
      },
      {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=222',
      },
      {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    ],
  },
]);
```

<br />

## `multicastImageCarouselTemplate(userIds, altText, carouselItems)`

Sends image carousel template message to multiple users.

<img src="https://developers.line.me/media/messaging-api/messages/image-carousel-301701f6.png" width="250px" />

| Param         | Type            | Description                                                |
| ------------- | --------------- | ---------------------------------------------------------- |
| userIds       | `Array<String>` | IDs of the receivers.                                      |
| altText       | `String`        | Alternative text.                                          |
| carouselItems | `Array<Object>` | Array of columns which contains object for image carousel. |

Example:

```js
client.multicastImageCarouselTemplate(
  [USER_ID],
  'this is an image carousel template',
  [
    {
      imageUrl: 'https://example.com/bot/images/item1.jpg',
      action: {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item2.jpg',
      action: {
        type: 'message',
        label: 'Yes',
        text: 'yes',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item3.jpg',
      action: {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    },
  ]
);
```

<br />

<a id="content-api" />

### Content API - [Official Docs](https://devdocs.line.me/en/#content)

## `retrieveMessageContent(messageId)`

Retrieves image, video, and audio data sent in specified message.

| Param     | Type     | Description |
| --------- | -------- | ----------- |
| messageId | `String` | Message ID. |

Example:

```js
client.retrieveMessageContent(MESSAGE_ID).then(buffer => {
  console.log(buffer);
  // <Buffer 61 61 73 64 ...>
});
```

<br />

<a id="profile-api" />

### Profile API - [Official Docs](https://devdocs.line.me/en/#bot-api-get-profile)

## `getUserProfile(userId)`

Gets user profile information.

| Param  | Type     | Description     |
| ------ | -------- | --------------- |
| userId | `String` | ID of the user. |

Example:

```js
client.getUserProfile(USER_ID).then(profile => {
  console.log(profile);
  // {
  //   displayName: 'LINE taro',
  //   userId: USER_ID,
  //   pictureUrl: 'http://obs.line-apps.com/...',
  //   statusMessage: 'Hello, LINE!',
  // }
});
```

<br />

<a id="grouproom-member-profile-api" />

### Group/Room Member Profile API - [Official Docs](https://devdocs.line.me/en/#get-group-room-member-profile)

## `getGroupMemberProfile(groupId, userId)`

Gets the user profile of a member of a group that the bot is in. This includes the user IDs of users who has not added the bot as a friend or has blocked the bot.

| Param   | Type     | Description      |
| ------- | -------- | ---------------- |
| groupId | `String` | ID of the group. |
| userId  | `String` | ID of the user.  |

Example:

```js
client.getGroupMemberProfile(GROUP_ID, USER_ID).then(member => {
  console.log(member);
  // {
  //   "displayName":"LINE taro",
  //   "userId":"Uxxxxxxxxxxxxxx...",
  //   "pictureUrl":"http://obs.line-apps.com/..."
  // }
});
```

<br />

## `getRoomMemberProfile(roomId, userId)`

Gets the user profile of a member of a room that the bot is in. This includes the user IDs of users who has not added the bot as a friend or has blocked the bot.

| Param  | Type     | Description      |
| ------ | -------- | ---------------- |
| roomId | `String` | ID of the group. |
| userId | `String` | ID of the user.  |

Example:

```js
client.getRoomMemberProfile(ROOM_ID, USER_ID).then(member => {
  console.log(member);
  // {
  //   "displayName":"LINE taro",
  //   "userId":"Uxxxxxxxxxxxxxx...",
  //   "pictureUrl":"http://obs.line-apps.com/..."
  // }
});
```

<br />

<a id="grouproom-member-ids-api" />

### Group/Room Member IDs API - [Official Docs](https://devdocs.line.me/en/#get-group-room-member-ids)

## `getGroupMemberIds(groupId, start)`

Gets the ID of the users of the members of a group that the bot is in. This includes the user IDs of users who have not added the bot as a friend or has blocked the bot.  
This feature is only available for LINE@ Approved accounts or official accounts.

| Param   | Type     | Description          |
| ------- | -------- | -------------------- |
| groupId | `String` | ID of the group.     |
| start   | `String` | `continuationToken`. |

Example:

```js
client.getGroupMemberIds(GROUP_ID, CURSOR).then(res => {
  console.log(res);
  // {
  //   memberIds: [
  //     'Uxxxxxxxxxxxxxx...',
  //     'Uxxxxxxxxxxxxxx...',
  //     'Uxxxxxxxxxxxxxx...'
  //   ],
  //   next: 'jxEWCEEP...'
  // }
});
```

<br />

## `getAllGroupMemberIds(groupId)`

Recursively gets the ID of the users of the members of a group that the bot is in using cursors.  
This feature is only available for LINE@ Approved accounts or official accounts.

| Param   | Type     | Description      |
| ------- | -------- | ---------------- |
| groupId | `String` | ID of the group. |

Example:

```js
client.getAllGroupMemberIds(GROUP_ID).then(ids => {
  console.log(ids);
  // [
  //   'Uxxxxxxxxxxxxxx..1',
  //   'Uxxxxxxxxxxxxxx..2',
  //   'Uxxxxxxxxxxxxxx..3',
  //   'Uxxxxxxxxxxxxxx..4',
  //   'Uxxxxxxxxxxxxxx..5',
  //   'Uxxxxxxxxxxxxxx..6',
  // ]
});
```

<br />

## `getRoomMemberIds(roomId, start)`

Gets the ID of the users of the members of a room that the bot is in. This includes the user IDs of users who have not added the bot as a friend or has blocked the bot.  
This feature is only available for LINE@ Approved accounts or official accounts.

| Param  | Type     | Description          |
| ------ | -------- | -------------------- |
| roomId | `String` | ID of the room.      |
| start  | `String` | `continuationToken`. |

Example:

```js
client.getRoomMemberIds(ROOM_ID, CURSOR).then(res => {
  console.log(res);
  // {
  //   memberIds: [
  //     'Uxxxxxxxxxxxxxx...',
  //     'Uxxxxxxxxxxxxxx...',
  //     'Uxxxxxxxxxxxxxx...'
  //   ],
  //   next: 'jxEWCEEP...'
  // }
});
```

<br />

## `getAllRoomMemberIds(roomId)`

Recursively gets the ID of the users of the members of a room that the bot is in using cursors.  
This feature is only available for LINE@ Approved accounts or official accounts.

| Param  | Type     | Description     |
| ------ | -------- | --------------- |
| roomId | `String` | ID of the room. |

Example:

```js
client.getAllRoomMemberIds(ROOM_ID).then(ids => {
  console.log(ids);
  // [
  //   'Uxxxxxxxxxxxxxx..1',
  //   'Uxxxxxxxxxxxxxx..2',
  //   'Uxxxxxxxxxxxxxx..3',
  //   'Uxxxxxxxxxxxxxx..4',
  //   'Uxxxxxxxxxxxxxx..5',
  //   'Uxxxxxxxxxxxxxx..6',
  // ]
});
```

<br />

<a id="leave-api" />

### Leave API - [Official Docs](https://devdocs.line.me/en/#leave)

## `leaveGroup(groupId)`

Leave a group.

| Param   | Type     | Description      |
| ------- | -------- | ---------------- |
| groupId | `String` | ID of the group. |

Example:

```js
client.leaveGroup(GROUP_ID);
```

<br />

## `leaveRoom(roomId)`

Leave a room.

| Param  | Type     | Description     |
| ------ | -------- | --------------- |
| roomId | `String` | ID of the room. |

Example:

```js
client.leaveRoom(ROOM_ID);
```

<br />

<a id="rich-menu-api" />

### Rich Menu API - [Official Docs](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu)

## `getRichMenuList`

Gets a list of all uploaded rich menus.

Example:

```js
client.getRichMenuList().then(richMenus => {
  console.log(richMenus);
  // [
  //   {
  //     richMenuId: 'RICH_MENU_ID',
  //     size: {
  //       width: 2500,
  //       height: 1686,
  //     },
  //     selected: false,
  //     name: 'Nice richmenu',
  //     chatBarText: 'Tap here',
  //     areas: [
  //       {
  //         bounds: {
  //           x: 0,
  //           y: 0,
  //           width: 2500,
  //           height: 1686,
  //         },
  //         action: {
  //           type: 'postback',
  //           data: 'action=buy&itemid=123',
  //         },
  //       },
  //     ],
  //   },
  // ]
});
```

<br />

## `getRichMenu(richMenuId)`

Gets a rich menu via a rich menu ID.

| Param      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| richMenuId | `String` | ID of an uploaded rich menu. |

Example:

```js
client.getRichMenu(RICH_MENU_ID).then(richMenu => {
  console.log(richMenu);
  // {
  //   richMenuId: 'RICH_MENU_ID',
  //   size: {
  //     width: 2500,
  //     height: 1686,
  //   },
  //   selected: false,
  //   name: 'Nice richmenu',
  //   chatBarText: 'Tap here',
  //   areas: [
  //     {
  //       bounds: {
  //         x: 0,
  //         y: 0,
  //         width: 2500,
  //         height: 1686,
  //       },
  //       action: {
  //         type: 'postback',
  //         data: 'action=buy&itemid=123',
  //       },
  //     },
  //   ],
  // }
});
```

<br />

## `createRichMenu(richMenu)`

Creates a rich menu.

| Param    | Type       | Description                                                                                         |
| -------- | ---------- | --------------------------------------------------------------------------------------------------- |
| richMenu | `RichMenu` | A [rich menu object](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu-object). |

Example:

```js
client
  .createRichMenu({
    size: {
      width: 2500,
      height: 1686,
    },
    selected: false,
    name: 'Nice richmenu',
    chatBarText: 'Tap here',
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 2500,
          height: 1686,
        },
        action: {
          type: 'postback',
          data: 'action=buy&itemid=123',
        },
      },
    ],
  })
  .then(richMenu => {
    console.log(richMenu);
    // {
    //   richMenuId: "{richMenuId}"
    // }
  });
```

<br />

## `deleteRichMenu(richMenuId)`

Deletes a rich menu.

| Param      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| richMenuId | `String` | ID of an uploaded rich menu. |

Example:

```js
client.deleteRichMenu(RICH_MENU_ID);
```

<br />

## `getLinkedRichMenu(userId)`

Gets the ID of the rich menu linked to a user.

| Param  | Type     | Description     |
| ------ | -------- | --------------- |
| userId | `String` | ID of the user. |

Example:

```js
client.getLinkedRichMenu(USER_ID).then(richMenu => {
  console.log(richMenu);
  // {
  //   richMenuId: "{richMenuId}"
  // }
});
```

<br />

## `linkRichMenu(userId, richMenuId)`

Links a rich menu to a user.

| Param      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| userId     | `String` | ID of the user.              |
| richMenuId | `String` | ID of an uploaded rich menu. |

Example:

```js
client.linkRichMenu(USER_ID, RICH_MENU_ID);
```

<br />

## `unlinkRichMenu(userId)`

Unlinks a rich menu from a user.

| Param  | Type     | Description     |
| ------ | -------- | --------------- |
| userId | `String` | ID of the user. |

Example:

```js
client.unlinkRichMenu(USER_ID);
```

<br />

## `downloadRichMenuImage(richMenuId)`

Downloads an image associated with a rich menu.

| Param      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| richMenuId | `String` | ID of an uploaded rich menu. |

Example:

```js
client.downloadRichMenuImage(RICH_MENU_ID).then(imageBuffer => {
  console.log(imageBuffer);
  // <Buffer 61 61 73 64 ...>
});
```

<br />

## `uploadRichMenuImage(richMenuId, buffer)`

Uploads and attaches an image to a rich menu.

| Param      | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| richMenuId | `String` | ID of an uploaded rich menu.                   |
| buffer     | `Buffer` | Image buffer which must be jpeg or png format. |

Example:

```js
const fs = require('fs');

client.uploadRichMenuImage(RICH_MENU_ID, fs.readFileSync('image.png'));
```

## Test

### Point requests to your dummy server

To avoid sending requests to real LINE server, specify `origin` option when constructing your client:

```js
const { LineClient } = require('messaging-api-line');

const client = LineClient.connect({
  accessToken: ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on production server.

### Manual Mock with [Jest](https://facebook.github.io/jest/)

create `__mocks__/messaging-api-line.js` in your project root:

```js
// __mocks__/messaging-api-line.js
const jestMock = require('jest-mock');
const { Line, LineClient } = require.requireActual('messaging-api-line');

module.exports = {
  Line: jestMock.generateFromMetadata(jestMock.getMetadata(Line)),
  LineClient: {
    connect: jest.fn(() => {
      const Mock = jestMock.generateFromMetadata(
        jestMock.getMetadata(LineClient)
      );
      return new Mock();
    }),
  },
};
```

Then, mock `messaging-api-line` package in your tests:

```js
// __tests__/mytest.spec.js
jest.mock('messaging-api-line');
```
