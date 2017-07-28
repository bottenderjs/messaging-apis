# messaging-api-line

> Messaging API client for LINE

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [Reply API](#reply-api)
  * [Push API](#push-api)
  * [Multicast API](#multicast-api)
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

### Call API

```js
async function fn() {
  await client.pushText(USER_ID, text);
}
```

or

```js
client.pushText(USER_ID, text).then(() => {
  // do something
});
```

## API Reference

All methods return a Promise.

### Reply API

[Official Docs](https://devdocs.line.me/en/#reply-message)

#### reply(token, message)

```js
client.reply(REPLY_TOKEN, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

#### replyText(token, text)

```js
client.reply(REPLY_TOKEN, 'Hello!');
```

#### replyImage(token, imageUrl, previewImageUrl)

```js
client.replyImage(
  REPLY_TOKEN,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

#### replyVideo(token, vedioUrl, previewImageUrl)

```js
client.replyVideo(
  REPLY_TOKEN,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

#### replyAudio(token, audioUrl, duration)

```js
client.replyAudio(REPLY_TOKEN, 'https://example.com/original.m4a', 240000);
```

#### replyLocation(token, location)

```js
client.replyLocation(REPLY_TOKEN, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

#### replySticker(token, packageId, stickerId)

```js
client.replySticker(REPLY_TOKEN, '1', '1');
```

#### replyImagemap(token, altText, imagemap)

```js
client.replyImagemap(REPLY_TOKEN, 'this is an imagemap', {
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

[Official Docs](https://devdocs.line.me/en/#imagemap-message)

#### replyTemplate(token, altText, template)

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

### Push API

[Official Docs](https://devdocs.line.me/en/#push-message)

#### push(userId, messages)

```js
client.push(USER_ID, [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

#### pushText(userId, text)

```js
client.pushText(USER_ID, 'Hello!');
```

#### pushImage(userId, imageUrl, previewImageUrl)

```js
client.pushImage(
  USER_ID,
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

#### pushVideo(userId, vedioUrl, previewImageUrl)

```js
client.pushVideo(
  USER_ID,
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

#### pushAudio(userId, audioUrl, duration)

```js
client.pushAudio(USER_ID, 'https://example.com/original.m4a', 240000);
```

#### pushLocation(userId, location)

```js
client.pushLocation(USER_ID, {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

#### pushSticker(userId, packageId, stickerId)

```js
client.pushSticker(USER_ID, '1', '1');
```

#### pushImagemap(userId, altText, imagemap)

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

[Official Docs](https://devdocs.line.me/en/#imagemap-message)

#### pushTemplate(userId, altText, template)

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

### Multicast API

[Official Docs](https://devdocs.line.me/en/#multicast)

#### multicast(userIds, messages)

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

```js
client.multicastText([USER_ID], 'Hello!');
```

### Others

#### getUserProfile

[Official Docs](https://devdocs.line.me/en/#bot-api-get-profile)

#### leaveGroup

[Official Docs](https://devdocs.line.me/en/#leave)

#### leaveRoom

[Official Docs](https://devdocs.line.me/en/#leave)

#### isValidSignature

[Official Docs](https://devdocs.line.me/en/#webhooks)

#### retrieveMessageContent

[Official Docs](https://devdocs.line.me/en/#content)
