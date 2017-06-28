# messaging-api-line

> Messaging API client for LINE

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
import { LINEClient } from 'messaging-api-line';

// get accessToken and channelSecret from LINE developers website
const client = LINEClient.connect(accessToken, channelSecret);
```

### Call API

```js
async function() {
  await client.pushText(id, text);
}
```

or

```js
client.pushText(id, text).then(() => {
  // do something
});
```

## API Reference

All methods return a Promise.

### Reply API

[Official Docs](https://devdocs.line.me/en/#reply-message)

- `reply(token, message)`

```js
client.reply('1qwyg56uj', [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

- `replyText(token, text)`

```js
client.reply('1qwyg56uj', 'Hello!');
```

### Push API

[Official Docs](https://devdocs.line.me/en/#push-message)

- `push(userId, messages)`

```js
client.push('1', [
  {
    type: 'text',
    text: 'Hello!',
  },
]);
```

- `pushText(userId, text)`

```js
client.pushText('1', 'Hello!');
```

- `pushImage(userId, imageUrl, previewImageUrl)`

```js
client.pushImage(
  '1',
  'https://example.com/original.jpg',
  'https://example.com/preview.jpg'
);
```

- `pushVideo(userId, vedioUrl, previewImageUrl)`

```js
client.pushVideo(
  '1',
  'https://example.com/original.mp4',
  'https://example.com/preview.jpg'
);
```

- `pushAudio(userId, audioUrl, duration)`

```js
client.pushAudio('1', 'https://example.com/original.m4a', 240000);
```

- `pushLocation(userId, location)`

```js
client.pushLocation('1', {
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203,
});
```

- `pushSticker(userId, packageId, stickerId)`

```js
client.pushSticker('1', '1', '1');
```

- `pushImagemap(userId, altText, imagemap)`

```js
client.pushImagemap(
  '1',
  'this is an imagemap',
  {
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
  }
);
```

[Official Docs](https://devdocs.line.me/en/#imagemap-message)

- `pushTemplate(userId, altText, template)`

```js
client.pushTemplate(
  '1',
  'this is a template',
  {
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
  }
);
```

- `pushButtonTemplate(userId, altText, buttonTemplate)`

```js
client.pushButtonTemplate(
  '1',
  'this is a template',
  {
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
  }
);
```

- `pushConfirmTemplate(userId, altText, confirmTemplate)`

```js
client.pushConfirmTemplate(
  '1',
  'this is a confirm template',
  {
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
  }
);
```

- `pushCarouselTemplate(userId, altText, carouselItems)`

```js
client.pushCarouselTemplate(
  '1',
  'this is a carousel template',
  [
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
  ]
);
```

### Others

- `getUserProfile`

[Official Docs](https://devdocs.line.me/en/#bot-api-get-profile)

- `multicast`

[Official Docs](https://devdocs.line.me/en/#multicast)

- `leaveGroup`

[Official Docs](https://devdocs.line.me/en/#leave)

- `leaveRoom`

[Official Docs](https://devdocs.line.me/en/#leave)

- `isValidSignature`

[Official Docs](https://devdocs.line.me/en/#webhooks)

- `retrieveMessageContent`

[Official Docs](https://devdocs.line.me/en/#content)
