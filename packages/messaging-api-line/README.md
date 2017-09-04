# messaging-api-line

> Messaging API client for LINE

<img src="http://is5.mzstatic.com/image/thumb/Purple117/v4/01/c2/4d/01c24d99-4aae-71ea-24e2-d0b68f8c53d2/source/1200x630bb.jpg" alt="LINE" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
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
  * [Others](#others)

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
const { LINEClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = LINEClient.connect(accessToken, channelSecret);
```

<br />

## API Reference

All methods return a Promise.

<br />

<a id="reply-api" />

### Reply API - [Official Docs](https://devdocs.line.me/en/#reply-message)

Responds to events from users, groups, and rooms.

#### reply(token, messages)

Responds messages using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### messages

Type: `Array<Object>`

```js
client.reply(REPLY_TOKEN, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

<br />

#### replyText(token, text)

Responds text message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### text

Type: `String`

```js
client.reply(REPLY_TOKEN, 'Hello!');
```

<br />

#### replyImage(token, imageUrl, previewImageUrl)

Responds image message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### imageUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.replyImage(
  REPLY_TOKEN,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

#### replyVideo(token, videoUrl, previewImageUrl)

Responds video message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### videoUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.replyVideo(
  REPLY_TOKEN,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

#### replyAudio(token, audioUrl, duration)

Responds audio message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### audioUrl

Type: `String`

###### duration

Type: `Number`

```js
client.replyAudio(REPLY_TOKEN, 'https://example.com/original.m4a', 240000);
```

<br />

#### replyLocation(token, location)

Responds location message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### location

Type: `Object`

###### location.title

Type: `String`

###### location.address

Type: `String`

###### location.latitude

Type: `Number`

###### location.longitude

Type: `Number`

```js
client.replyLocation(REPLY_TOKEN, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

#### replySticker(token, packageId, stickerId)

Responds sticker message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### packageId

Type: `String`

###### stickerId

Type: `String`

```js
client.replySticker(REPLY_TOKEN, '1', '1');
```

<br />

### Reply Imagemap Message

#### replyImagemap(token, altText, imagemap)

Responds imagemap message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### imagemap - [Official Docs](https://devdocs.line.me/en/#imagemap-message)

Type: `Object`

###### imagemap.baseUrl

Type: `String`

###### imagemap.baseWidth

Type: `Number`

Width of base image (set to 1040px）.

###### imagemap.baseHeight

Type: `Number`

Height of base image（set to the height that corresponds to a width of 1040px）.

###### imagemap.actions

Type: `Array<Object>`

Action when tapped.

```js
client.replyImagemap(REPLY_TOKEN, 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseWidth: 1040,
  baseHeight: 1040,
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

#### replyTemplate(token, altText, template)

Responds template message using specified reply token.

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### template

Type: `Object`

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

#### replyButtonTemplate(token, altText, buttonTemplate)

Responds button template message using specified reply token.

![](https://devdocs.line.me/images/buttons.png)

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### buttonTemplate

Type: `Object`

###### buttonTemplate.thumbnailImageUrl

Type: `String`

###### buttonTemplate.title

Type: `String`

###### buttonTemplate.text

Type: `String`

###### buttonTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### replyConfirmTemplate(token, altText, confirmTemplate)

Responds confirm template message using specified reply token.

![](https://devdocs.line.me/images/confirm.png)

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### confirmTemplate

Type: `Object`

###### confirmTemplate.text

Type: `String`

###### confirmTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### replyCarouselTemplate(token, altText, carouselItems)

Responds carousel template message using specified reply token.

![](https://devdocs.line.me/images/carousel.png)

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### replyImageCarouselTemplate(token, altText, carouselItems)

Responds image carousel template message using specified reply token.

![](https://devdocs.line.me/images/image_carousel.png)

###### token

Type: `String`

`replyToken` received via webhook.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### push(userId, messages)

Sends messages using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### messages

Type: `Array<Object>`

```js
client.push(USER_ID, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

<br />

#### pushText(userId, text)

Sends text message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### text

Type: `String`

```js
client.pushText(USER_ID, 'Hello!');
```

<br />

#### pushImage(userId, imageUrl, previewImageUrl)

Sends image message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### imageUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.pushImage(
  USER_ID,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

#### pushVideo(userId, videoUrl, previewImageUrl)

Sends video message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### videoUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.pushVideo(
  USER_ID,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

#### pushAudio(userId, audioUrl, duration)

Sends audio message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### audioUrl

Type: `String`

###### duration

Type: `Number`

```js
client.pushAudio(USER_ID, 'https://example.com/original.m4a', 240000);
```

<br />

#### pushLocation(userId, location)

Sends location message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### location

Type: `Object`

###### location.title

Type: `String`

###### location.address

Type: `String`

###### location.latitude

Type: `Number`

###### location.longitude

Type: `Number`

```js
client.pushLocation(USER_ID, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

#### pushSticker(userId, packageId, stickerId)

Sends sticker message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### packageId

Type: `String`

###### stickerId

Type: `String`

```js
client.pushSticker(USER_ID, '1', '1');
```

<br />

### Push Imagemap Message

#### pushImagemap(userId, altText, imagemap)

Sends imagemap message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### imagemap - [Official Docs](https://devdocs.line.me/en/#imagemap-message)

Type: `Object`

###### imagemap.baseUrl

Type: `String`

###### imagemap.baseWidth

Type: `Number`

Width of base image (set to 1040px）.

###### imagemap.baseHeight

Type: `Number`

Height of base image（set to the height that corresponds to a width of 1040px）.

###### imagemap.actions

Type: `Array<Object>`

Action when tapped.

```js
client.pushImagemap(USER_ID, 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseHeight: 1040,
  baseWidth: 1040,
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

#### pushTemplate(userId, altText, template)

Sends template message using ID of the receiver.

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### template

Type: `Object`

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

#### pushButtonTemplate(userId, altText, buttonTemplate)

Sends button template message using ID of the receiver.

![](https://devdocs.line.me/images/buttons.png)

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### buttonTemplate

Type: `Object`

###### buttonTemplate.thumbnailImageUrl

Type: `String`

###### buttonTemplate.title

Type: `String`

###### buttonTemplate.text

Type: `String`

###### buttonTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### pushConfirmTemplate(userId, altText, confirmTemplate)

Sends confirm template message using ID of the receiver.

![](https://devdocs.line.me/images/confirm.png)

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### confirmTemplate

Type: `Object`

###### confirmTemplate.text

Type: `String`

###### confirmTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### pushCarouselTemplate(userId, altText, carouselItems)

Sends carousel template message using ID of the receiver.

![](https://devdocs.line.me/images/carousel.png)

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### pushImageCarouselTemplate(userId, altText, carouselItems)

Sends image carousel template message using ID of the receiver.

![](https://devdocs.line.me/images/image_carousel.png)

###### userId

Type: `String`

ID of the receiver.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### multicast(userIds, messages)

Sends messages to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### messages

Type: `Array<Object>`

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

#### multicastText(userIds, text)

Sends text message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### text

Type: `String`

```js
client.multicastText([USER_ID], 'Hello!');
```

<br />

#### multicastImage(userIds, imageUrl, previewImageUrl)

Sends image message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### imageUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.multicastImage(
  [USER_ID],
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

<br />

#### multicastVideo(userIds, videoUrl, previewImageUrl)

Sends video message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### videoUrl

Type: `String`

###### previewImageUrl

Type: `String`

```js
client.multicastVideo(
  [USER_ID],
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

<br />

#### multicastAudio(userIds, audioUrl, duration)

Sends audio message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### audioUrl

Type: `String`

###### duration

Type: `Number`

```js
client.multicastAudio([USER_ID], 'https://example.com/original.m4a', 240000);
```

<br />

#### multicastLocation(userIds, location)

Sends location message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### location

Type: `Object`

###### location.title

Type: `String`

###### location.address

Type: `String`

###### location.latitude

Type: `Number`

###### location.longitude

Type: `Number`

```js
client.multicastLocation([USER_ID], {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

<br />

#### multicastSticker(userIds, packageId, stickerId)

Sends sticker message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### packageId

Type: `String`

###### stickerId

Type: `String`

```js
client.multicastSticker([USER_ID], '1', '1');
```

<br />

### Multicast Imagemap Message

#### multicastImagemap(userIds, altText, imagemap)

Sends imagemap message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### imagemap - [Official Docs](https://devdocs.line.me/en/#imagemap-message)

Type: `Object`

###### imagemap.baseUrl

Type: `String`

###### imagemap.baseWidth

Type: `Number`

Width of base image (set to 1040px）.

###### imagemap.baseHeight

Type: `Number`

Height of base image（set to the height that corresponds to a width of 1040px）.

###### imagemap.actions

Type: `Array<Object>`

Action when tapped.

```js
client.multicastImagemap([USER_ID], 'this is an imagemap', {
  baseUrl: 'https://example.com/bot/images/rm001',
  baseHeight: 1040,
  baseWidth: 1040,
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

#### multicastTemplate(userIds, altText, template)

Sends template message to multiple users.

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### template

Type: `Object`

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

#### multicastButtonTemplate(userIds, altText, buttonTemplate)

Sends button template message to multiple users.

![](https://devdocs.line.me/images/buttons.png)

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### buttonTemplate

Type: `Object`

###### buttonTemplate.thumbnailImageUrl

Type: `String`

###### buttonTemplate.title

Type: `String`

###### buttonTemplate.text

Type: `String`

###### buttonTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### multicastConfirmTemplate(userIds, altText, confirmTemplate)

Sends confirm template message to multiple users.

![](https://devdocs.line.me/images/confirm.png)

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### confirmTemplate

Type: `Object`

###### confirmTemplate.text

Type: `String`

###### confirmTemplate.actions

Type: `Array<Object>`

Action when tapped.

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

#### multicastCarouselTemplate(userIds, altText, carouselItems)

Sends carousel template message to multiple users.

![](https://devdocs.line.me/images/carousel.png)

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### multicastImageCarouselTemplate(userIds, altText, carouselItems)

Sends image carousel template message to multiple users.

![](https://devdocs.line.me/images/image_carousel.png)

###### userIds

Type: `String`

IDs of the receivers.

###### altText

Type: `String`

Alternative text.

###### carouselItems

Type: `Array<Object>`

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

#### retrieveMessageContent(messageId)

Retrieves image, video, and audio data sent in specified message.

###### messageId

Type: `String`

```js
client.retrieveMessageContent(MESSAGE_ID);
```

<br />

<a id="profile-api" />

### Profile API - [Official Docs](https://devdocs.line.me/en/#bot-api-get-profile)

#### getUserProfile(userId)

Gets user profile information.

###### userId

Type: `String`

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

#### getGroupMemberProfile(groupId, userId)

Gets the user profile of a member of a group that the bot is in.

###### groupId

Type: `String`

###### userId

Type: `String`

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

#### getRoomMemberProfile(roomId, userId)

Gets the user profile of a member of a room that the bot is in.

###### roomId

Type: `String`

###### userId

Type: `String`

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

#### getGroupMemberIds(groupId, start)

Gets the user IDs of the members of a group that the bot is in.

###### groupId

Type: `String`

###### start

Type: `String`

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

#### getAllGroupMemberIds(groupId)

Recursively gets the user IDs of the members of a group that the bot is in using cursors.

###### groupId

Type: `String`

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

#### getRoomMemberIds(roomId, start)

Gets the user IDs of the members of a room that the bot is in.

###### roomId

Type: `String`

###### start

Type: `String`

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

#### getAllRoomMemberIds(roomId)

Recursively gets the user IDs of the members of a room that the bot is in using cursors.

###### roomId

Type: `String`

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

#### leaveGroup(groupId)

Leave a group.

###### groupId

Type: `String`

```js
client.leaveGroup(GROUP_ID);
```

<br />

#### leaveRoom(roomId)

Leave a room.

###### roomId

Type: `String`

```js
client.leaveRoom(ROOM_ID);
```

<br />

### Others

#### isValidSignature - [Official Docs](https://devdocs.line.me/en/#webhooks)
