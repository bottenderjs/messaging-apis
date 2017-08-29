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

## Usage

### Initialize

```js
const { LINEClient } = require('messaging-api-line');

// get accessToken and channelSecret from LINE developers website
const client = LINEClient.connect(accessToken, channelSecret);
```

## API Reference

All methods return a Promise.

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

#### multicastImage(userId, imageUrl, previewImageUrl)

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

#### multicastVideo(userId, videoUrl, previewImageUrl)

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

#### multicastAudio(userId, audioUrl, duration)

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

#### multicastLocation(userId, location)

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

#### multicastSticker(userId, packageId, stickerId)

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

### Multicast Imagemap Message

#### multicastImagemap(userId, altText, imagemap)

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

### Multicast Template Messages

#### multicastTemplate(userId, altText, template)

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

#### multicastButtonTemplate(userId, altText, buttonTemplate)

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

#### multicastConfirmTemplate(userId, altText, confirmTemplate)

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

#### multicastCarouselTemplate(userId, altText, carouselItems)

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

<a id="content-api" />

### Content API - [Official Docs](https://devdocs.line.me/en/#content)

#### retrieveMessageContent(messageId)

Retrieves image, video, and audio data sent in specified message.

###### messageId

Type: `String`

```js
client.retrieveMessageContent(MESSAGE_ID);
```

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

<a id="leave-api" />

### Leave API - [Official Docs](https://devdocs.line.me/en/#leave)

#### leaveGroup(groupId)

Leave a group.

###### groupId

Type: `String`

```js
client.leaveGroup(GROUP_ID);
```

#### leaveRoom(roomId)

Leave a room.

###### roomId

Type: `String`

```js
client.leaveRoom(ROOM_ID);
```

### Others

#### isValidSignature - [Official Docs](https://devdocs.line.me/en/#webhooks)
