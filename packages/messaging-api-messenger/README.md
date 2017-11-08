# messaging-api-messenger

> Messaging API client for Messenger

<img src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/R_1BAhxMP5I.png" alt="Messenger" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [Send API](#send-api)
    * [Content Types](#content-types)
    * [Templates](#templates)
    * [Quick Replies](#quick-replies)
    * [Sender Actions](#sender-actions)
    * [Attachment Upload API](#attachment-upload-api)
    * [Tags](#tags)
    * [Message Batching](#message-batching)
  * [Broadcast API](#broadcast-api)
  * [User Profile API](#user-profile-api)
  * [Messenger Profile API](#messenger-profile-api)
    * [Persistent Menu](#persistent-menu)
    * [Get Started Button](#get-started-button)
    * [Greeting Text](#greeting-text)
    * [Whitelisted Domains](#domain-whitelist)
    * [Account Linking URL](#account-linking-url)
    * [Payment Settings](#payment-settings)
    * [Target Audience](#target-audience)
    * [Chat Extension Home URL](#chat-extension-home-url)
  * [Messenger Code API](#messenger-code-api)
  * [Handover Protocol API](#handover-protocol-api)
  * [Page Messaging Insights API](#page-messaging-insights-api)
  * [Built-in NLP API](#built-in-nlp-api)

## Installation

```sh
npm i --save messaging-api-messenger
```
or
```sh
yarn add messaging-api-messenger
```

<br />

## Usage

### Initialize

```js
const { MessengerClient } = require('messaging-api-messenger');

// get accessToken from facebook developers website
const client = MessengerClient.connect(accessToken);
```

You can specify version of Facebook Graph API using second argument:

```js
const client = MessengerClient.connect(accessToken, '2.9');
```

If it is not specified, version `2.11` will be used as default.

<br />

## API Reference

All methods return a Promise.

<br />

<a id="send-api" />

### Send API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference)  

## `sendRawBody(body)`

Send request raw body using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param | Type     | Description
----- | -------- | -----------
body  | `Object` | Raw body to be sent.

Example:
```js
client.sendRawBody({
  recipient: {
    id: USER_ID,
  },
  message: {
    text: 'Hello!',
  },
});
```

<br />

## `sendMessage(userId, message)`

Send messages to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param   | Type                              | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
message | `Object`                          | [message](https://developers.facebook.com/docs/messenger-platform/reference/send-api#message) object.
options | `Object`                          | Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).


Example:
```js
client.sendMessage(USER_ID, {
  text: 'Hello!',
});
```

You can specifiy [messaging type]([messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types)) using options. If `messaging_type` and `tag` is not provided, `UPDATE` will be used as default messaging type.

Example:
```js
client.sendMessage(USER_ID, {
  text: 'Hello!',
}, {
  messaging_type: 'RESPONSE',
});
```

Available messaging types:
- `UPDATE` as default
- `RESPONSE` using `{ messaging_type: 'RESPONSE' }` options
- `MESSAGE_TAG` using `{ tag: 'ANY_TAG' }` options
- `NON_PROMOTIONAL_SUBSCRIPTION` using `{ messaging_type: 'NON_PROMOTIONAL_SUBSCRIPTION' }` options

<br />

<a id="content-types" />

### Content Types - [Content types](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)

## `sendText(userId, text [, options])`

Send plain text messages to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param   | Type                             | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
text    | `String`                          | Text of the message to be sent.
options | `Object`                          | Other optional parameters. For example,    [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).

Example:
```js
client.sendText(USER_ID, 'Hello!', { tag: 'ISSUE_RESOLUTION' });
```

<br />

## `sendAttachment(userId, attachment)`

Send attachment messages to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param      | Type                              | Description
---------- | --------------------------------- | -----------
userId     | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
attachment | `Object`                          | [attachment](https://developers.facebook.com/docs/messenger-platform/reference/send-api#attachment) object.

Example:
```js
client.sendAttachment(USER_ID, {
  type: 'image',
  payload: {
    url: 'https://example.com/pic.png',
  },
});
```

<br />

## `sendAudio(userId, audio)`

Send sounds to specified user by uploading them or sharing a URL using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13503473_1584526905179825_88080075_n.png?oh=085ef554f12d061090677b89f3275d64&oe=59EB29D3" alt="sendAudio" width="250" />

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
audio  | <code>String &#124; Buffer &#124; ReadStream &#124; AttachmentPayload</code> | audio to be sent.

Example:

 - Send audio using url string:

```js
client.sendAudio(USER_ID, 'https://example.com/audio.mp3');
```

 - Use `AttachmentPayload` to send cached attachment:

```js
client.sendAudio(USER_ID, { attachment_id: '55688' });
```

 - Use `ReadStream` created from local file:

```js
const fs = require('fs');

client.sendAudio(USER_ID, fs.createReadStream('audio.mp3'));
```

<br />

## `sendImage(userId, image)`

Send images to specified user by uploading them or sharing a URL using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request). Supported formats are jpg, png and gif.

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13466577_1753800631570799_2129488873_n.png?oh=5904aadb6aa82cd2287d777359bd3cd2&oe=59F32D6A" alt="sendImage" width="250" />

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
audio  | <code>String &#124; Buffer &#124; ReadStream &#124; AttachmentPayload</code> | image to be sent.

Example:

 - Send image using url string:

```js
client.sendImage(USER_ID, 'https://example.com/vr.jpg');
```

 - Use `AttachmentPayload` to send cached attachment:

```js
client.sendImage(USER_ID, { attachment_id: '55688' });
```

 - Use `ReadStream` created from local file:

```js
const fs = require('fs');

client.sendImage(USER_ID, fs.createReadStream('vr.jpg'));
```

<br />

## `sendVideo(userId, video)`

Send videos to specified user by uploading them or sharing a URL using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13509239_1608341092811398_289173120_n.png?oh=160ea165834203bae79c24c8e07137de&oe=5A350DB4" alt="sendVideo" width="250" />

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
video  | <code>String &#124; Buffer &#124; ReadStream &#124; AttachmentPayload</code> | video to be sent.

Example:

 - Send video using url string:

```js
client.sendVideo(USER_ID, 'https://example.com/video.mp4');
```

 - Use `AttachmentPayload` to send cached attachment:

```js
client.sendVideo(USER_ID, { attachment_id: '55688' });
```

 - Use `ReadStream` created from local file:

```js
const fs = require('fs');

client.sendVideo(USER_ID, fs.createReadStream('video.mp4'));
```

<br />

## `sendFile(userId, file)`

Send files to specified user by uploading them or sharing a URL using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13480153_1115020735225077_1305291896_n.png?oh=a972010ea3edd1ea967885b06317efab&oe=59F63578" alt="sendVideo" width="250" />

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
file   | <code>String &#124; Buffer &#124; ReadStream &#124; AttachmentPayload</code> | file to be sent.

Example:

 - Send file using url string:

```js
client.sendFile(USER_ID, 'https://example.com/receipt.pdf');
```

 - Use `AttachmentPayload` to send cached attachment:

```js
client.sendFile(USER_ID, { attachment_id: '55688' });
```

 - Use `ReadStream` created from local file:

```js
const fs = require('fs');

client.sendFile(USER_ID, fs.createReadStream('receipt.pdf'));
```

<br />

<a id="templates" />

### Templates - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates)

## `sendTemplate(userId, template)`

Send structured message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param    | Type                              | Description
-------- | --------------------------------- | -----------
userId   | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
template | `Object`                          | Object of the template.

Example:
```js
client.sendTemplate(USER_ID, {
  template_type: 'button',
  text: 'title',
  buttons: [
    {
      type: 'postback',
      title: 'Start Chatting',
      payload: 'USER_DEFINED_PAYLOAD',
    },
  ],
});
```

<br />

## `sendButtonTemplate(userId, title, buttons)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

Send button message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13509162_1732711383655205_1306472501_n.png?oh=0e2409226bc50b23207bf37bf6e2edb6&oe=5A377CAC" alt="sendButtonTemplate" width="250" />

Param   | Type                              | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
title   | `String`                          | Text that appears above the buttons.
buttons | `Array<Object>`                   | Array of [button](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button#button). Set of 1-3 buttons that appear as call-to-actions.

Example:
```js
client.sendButtonTemplate(USER_ID, 'What do you want to do next?', [
  {
    type: 'web_url',
    url: 'https://petersapparel.parseapp.com',
    title: 'Show Website',
  },
  {
    type: 'postback',
    title: 'Start Chatting',
    payload: 'USER_DEFINED_PAYLOAD',
  },
]);
```

<br />

## `sendGenericTemplate(userId, elements [, options])` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

Send generic message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13509251_1026555627430343_1803381600_n.png?oh=e9fadd445090a4743bfd20fda487be5f&oe=59EE4571" alt="sendGenericTemplate" width="250" />

Param    | Type                              | Description
-------- | --------------------------------- | -----------
userId   | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
elements | `Array<Object>`                   | Array of [element](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#element). Data for each bubble in message.
options  | `Object`                          | Other optional parameters, such as `image_aspect_ratio` and [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).

Example:
```js
client.sendGenericTemplate(
  USER_ID,
  [
    {
      title: "Welcome to Peter's Hats",
      image_url: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "We've got the right hat for everyone.",
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      ],
    },
  ],
  { image_aspect_ratio: 'square' }
);
```

Adding a [tag](https://developers.facebook.com/docs/messenger-platform/message-tags) to a message allows you to send it outside the 24+1 window, for a limited number of use cases, per [Messenger Platform policy](https://developers.facebook.com/docs/messenger-platform/policy-overview).  

Example:
```js
client.sendGenericTemplate(
  USER_ID,
  [
    {
      // ...
    },
  ],
  { tag: 'ISSUE_RESOLUTION' }
);
```

Available tags:
- `PAIRING_UPDATE`
- `APPLICATION_UPDATE`
- `ACCOUNT_UPDATE`
- `PAYMENT_UPDATE`
- `PERSONAL_FINANCE_UPDATE`
- `SHIPPING_UPDATE`
- `RESERVATION_UPDATE`
- `ISSUE_RESOLUTION`
- `APPOINTMENT_UPDATE`
- `GAME_EVENT`
- `TRANSPORTATION_UPDATE`
- `FEATURE_FUNCTIONALITY_UPDATE`
- `TICKET_UPDATE`

<br />

## `sendListTemplate(userId, items, buttons, options)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template)

Send list message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14858155_1136082199802015_362293724211838976_n.png?oh=46900eb955ff8ea1040fc5353d9be2fa&oe=59F245DD" alt="sendListTemplate" width="500" />

Param   | Type                              | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
items   | `Array<Object>`                   | Array of [element](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#element). List view elements.
buttons | `Array<Object>`                   | Array of [button](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button#button). List of buttons associated on the list template message (maximum of 1 button).
options | `Object`                          | Other optional parameters, such as `top_element_style`.

Example:
```js
client.sendListTemplate(
  USER_ID,
  [
    {
      title: 'Classic T-Shirt Collection',
      image_url: 'https://peterssendreceiveapp.ngrok.io/img/collection.png',
      subtitle: 'See all our colors',
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          title: 'View',
          type: 'web_url',
          url: 'https://peterssendreceiveapp.ngrok.io/collection',
          messenger_extensions: true,
          webview_height_ratio: 'tall',
          fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
        },
      ],
    },
  ],
  [
    {
      type: 'postback',
      title: 'View More',
      payload: 'USER_DEFINED_PAYLOAD',
    },
  ],
  { top_element_style: 'compact' }
);
```

<br />

## `sendOpenGraphTemplate(userId, elements)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/open-graph-template)

Send open graph message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param    | Type                              | Description
-------- | --------------------------------- | -----------
userId   | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
elements | `Array<Object>`                   | Array of [element](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#element). Only one element is allowed.

Example:
```js
client.sendOpenGraphTemplate(USER_ID, [
  {
    url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
    buttons: [
      {
        type: 'web_url',
        url: 'https://en.wikipedia.org/wiki/Rickrolling',
        title: 'View More',
      },
    ],
  },
]);
```

<br />

## `sendMediaTemplate(userId, elements)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/template/media)

Send media message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param    | Type                              | Description
-------- | --------------------------------- | -----------
userId   | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
elements | `Array<Object>`                   | Array of [element](https://developers.facebook.com/docs/messenger-platform/reference/template/media#payload). Only one element is allowed.

Example:
```js
client.sendMediaTemplate(USER_ID, [
  {
    media_type: 'image',
    attachment_id: '1854626884821032',
    buttons: [
      {
        type: 'web_url',
        url: 'https://en.wikipedia.org/wiki/Rickrolling',
        title: 'View Website',
      },
    ],
  },
]);
```

<br />

## `sendReceiptTemplate(userId, receipt)`  - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

Send receipt message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13466939_915325738590743_1056699384_n.png?oh=bd6869385dee4c2cfaef1329fc660a01&oe=5A0331D4" alt="sendReceiptTemplate" width="250" />

Param   | Type                              | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
receipt | `Object`                          | [payload](https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt#payload) of receipt template.

Example:
```js
client.sendReceiptTemplate(USER_ID, {
  recipient_name: 'Stephane Crozatier',
  order_number: '12345678902',
  currency: 'USD',
  payment_method: 'Visa 2345',
  order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
  timestamp: '1428444852',
  elements: [
    {
      title: 'Classic White T-Shirt',
      subtitle: '100% Soft and Luxurious Cotton',
      quantity: 2,
      price: 50,
      currency: 'USD',
      image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
    },
    {
      title: 'Classic Gray T-Shirt',
      subtitle: '100% Soft and Luxurious Cotton',
      quantity: 1,
      price: 25,
      currency: 'USD',
      image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png',
    },
  ],
  address: {
    street_1: '1 Hacker Way',
    street_2: '',
    city: 'Menlo Park',
    postal_code: '94025',
    state: 'CA',
    country: 'US',
  },
  summary: {
    subtotal: 75.0,
    shipping_cost: 4.95,
    total_tax: 6.19,
    total_cost: 56.14,
  },
  adjustments: [
    {
      name: 'New Customer Discount',
      amount: 20,
    },
    {
      name: '$10 Off Coupon',
      amount: 10,
    },
  ],
});
```

<br />

## `sendAirlineBoardingPassTemplate(userId, attributes)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template)

Send airline boarding pass message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13466921_1408414619175015_4955822_n.png?oh=3136f1ef03e482bda03f433b18745033&oe=5A316E63" alt="sendAirlineBoardingPassTemplate" width="600" />

Param      | Type                              | Description
---------- | --------------------------------- | -----------
userId     | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
attributes | `Object`                          | [payload](https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline-boarding-pass#payload) of boarding pass template.

Example:
```js
client.sendAirlineBoardingPassTemplate(RECIPIENT_ID, {
  intro_message: 'You are checked in.',
  locale: 'en_US',
  boarding_pass: [
    {
      passenger_name: 'SMITH/NICOLAS',
      pnr_number: 'CG4X7U',
      travel_class: 'business',
      seat: '74J',
      auxiliary_fields: [
        {
          label: 'Terminal',
          value: 'T1',
        },
        {
          label: 'Departure',
          value: '30OCT 19:05',
        },
      ],
      secondary_fields: [
        {
          label: 'Boarding',
          value: '18:30',
        },
        {
          label: 'Gate',
          value: 'D57',
        },
        {
          label: 'Seat',
          value: '74J',
        },
        {
          label: 'Sec.Nr.',
          value: '003',
        },
      ],
      logo_image_url: 'https://www.example.com/en/logo.png',
      header_image_url: 'https://www.example.com/en/fb/header.png',
      qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
      above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
      flight_info: {
        flight_number: 'KL0642',
        departure_airport: {
          airport_code: 'JFK',
          city: 'New York',
          terminal: 'T1',
          gate: 'D57',
        },
        arrival_airport: {
          airport_code: 'AMS',
          city: 'Amsterdam',
        },
        flight_schedule: {
          departure_time: '2016-01-02T19:05',
          arrival_time: '2016-01-05T17:30',
        },
      },
    },
    {
      passenger_name: 'JONES/FARBOUND',
      pnr_number: 'CG4X7U',
      travel_class: 'business',
      seat: '74K',
      auxiliary_fields: [
        {
          label: 'Terminal',
          value: 'T1',
        },
        {
          label: 'Departure',
          value: '30OCT 19:05',
        },
      ],
      secondary_fields: [
        {
          label: 'Boarding',
          value: '18:30',
        },
        {
          label: 'Gate',
          value: 'D57',
        },
        {
          label: 'Seat',
          value: '74K',
        },
        {
          label: 'Sec.Nr.',
          value: '004',
        },
      ],
      logo_image_url: 'https://www.example.com/en/logo.png',
      header_image_url: 'https://www.example.com/en/fb/header.png',
      qr_code: 'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
      above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
      flight_info: {
        flight_number: 'KL0642',
        departure_airport: {
          airport_code: 'JFK',
          city: 'New York',
          terminal: 'T1',
          gate: 'D57',
        },
        arrival_airport: {
          airport_code: 'AMS',
          city: 'Amsterdam',
        },
        flight_schedule: {
          departure_time: '2016-01-02T19:05',
          arrival_time: '2016-01-05T17:30',
        },
      },
    },
  ],
});
```

<br />

## `sendAirlineCheckinTemplate(userId, attributes)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template)

Send airline checkin message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13466944_1156144061116360_549622536_n.png?oh=1aa077176a59f346abf8d199e133d2d2&oe=59F2476C" alt="sendAirlineCheckinTemplate" width="250" />

Param      | Type                              | Description
---------- | --------------------------------- | -----------
userId     | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
attributes | `Object`                          | [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template#payload) of checkin template.

Example:
```js
client.sendAirlineCheckinTemplate(USER_ID, {
  intro_message: 'Check-in is available now.',
  locale: 'en_US',
  pnr_number: 'ABCDEF',
  flight_info: [
    {
      flight_number: 'f001',
      departure_airport: {
        airport_code: 'SFO',
        city: 'San Francisco',
        terminal: 'T4',
        gate: 'G8',
      },
      arrival_airport: {
        airport_code: 'SEA',
        city: 'Seattle',
        terminal: 'T4',
        gate: 'G8',
      },
      flight_schedule: {
        boarding_time: '2016-01-05T15:05',
        departure_time: '2016-01-05T15:45',
        arrival_time: '2016-01-05T17:30',
      },
    },
  ],
  checkin_url: 'https://www.airline.com/check-in',
});
```

<br />

## `sendAirlineItineraryTemplate(userId, attributes)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template)

Send airline itinerary message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13466573_979516348832909_515976570_n.png?oh=1eb97bf63d3a9f5c333ba28184085950&oe=59FB8738" alt="sendAirlineItineraryTemplate" width="600" />

Param      | Type                              | Description
---------- | --------------------------------- | -----------
userId     | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
attributes | `Object`                          | [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template#payload) of itinerary template.

Example:
```js
client.sendAirlineItineraryTemplate(USER_ID, {
  intro_message: "Here's your flight itinerary.",
  locale: 'en_US',
  pnr_number: 'ABCDEF',
  passenger_info: [
    {
      name: 'Farbound Smith Jr',
      ticket_number: '0741234567890',
      passenger_id: 'p001',
    },
    {
      name: 'Nick Jones',
      ticket_number: '0741234567891',
      passenger_id: 'p002',
    },
  ],
  flight_info: [
    {
      connection_id: 'c001',
      segment_id: 's001',
      flight_number: 'KL9123',
      aircraft_type: 'Boeing 737',
      departure_airport: {
        airport_code: 'SFO',
        city: 'San Francisco',
        terminal: 'T4',
        gate: 'G8',
      },
      arrival_airport: {
        airport_code: 'SLC',
        city: 'Salt Lake City',
        terminal: 'T4',
        gate: 'G8',
      },
      flight_schedule: {
        departure_time: '2016-01-02T19:45',
        arrival_time: '2016-01-02T21:20',
      },
      travel_class: 'business',
    },
    {
      connection_id: 'c002',
      segment_id: 's002',
      flight_number: 'KL321',
      aircraft_type: 'Boeing 747-200',
      travel_class: 'business',
      departure_airport: {
        airport_code: 'SLC',
        city: 'Salt Lake City',
        terminal: 'T1',
        gate: 'G33',
      },
      arrival_airport: {
        airport_code: 'AMS',
        city: 'Amsterdam',
        terminal: 'T1',
        gate: 'G33',
      },
      flight_schedule: {
        departure_time: '2016-01-02T22:45',
        arrival_time: '2016-01-03T17:20',
      },
    },
  ],
  passenger_segment_info: [
    {
      segment_id: 's001',
      passenger_id: 'p001',
      seat: '12A',
      seat_type: 'Business',
    },
    {
      segment_id: 's001',
      passenger_id: 'p002',
      seat: '12B',
      seat_type: 'Business',
    },
    {
      segment_id: 's002',
      passenger_id: 'p001',
      seat: '73A',
      seat_type: 'World Business',
      product_info: [
        {
          title: 'Lounge',
          value: 'Complimentary lounge access',
        },
        {
          title: 'Baggage',
          value: '1 extra bag 50lbs',
        },
      ],
    },
    {
      segment_id: 's002',
      passenger_id: 'p002',
      seat: '73B',
      seat_type: 'World Business',
      product_info: [
        {
          title: 'Lounge',
          value: 'Complimentary lounge access',
        },
        {
          title: 'Baggage',
          value: '1 extra bag 50lbs',
        },
      ],
    },
  ],
  price_info: [
    {
      title: 'Fuel surcharge',
      amount: '1597',
      currency: 'USD',
    },
  ],
  base_price: '12206',
  tax: '200',
  total_price: '14003',
  currency: 'USD',
});
```

<br />

## `sendAirlineFlightUpdateTemplate(userId, attributes)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template)

Send airline flight update message templates to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13503467_502166346641834_1768260104_n.png?oh=141fe3238aa6f04d413705860eb52ede&oe=59F5C6BC" alt="sendAirlineFlightUpdateTemplate" width="250" />

Param      | Type                              | Description
---------- | --------------------------------- | -----------
userId     | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
attributes | `Object`                          | [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template#payload) of update template.

Example:
```js
client.sendAirlineFlightUpdateTemplate(USER_ID, {
  intro_message: 'Your flight is delayed',
  update_type: 'delay',
  locale: 'en_US',
  pnr_number: 'CF23G2',
  update_flight_info: {
    flight_number: 'KL123',
    departure_airport: {
      airport_code: 'SFO',
      city: 'San Francisco',
      terminal: 'T4',
      gate: 'G8',
    },
    arrival_airport: {
      airport_code: 'AMS',
      city: 'Amsterdam',
      terminal: 'T4',
      gate: 'G8',
    },
    flight_schedule: {
      boarding_time: '2015-12-26T10:30',
      departure_time: '2015-12-26T11:30',
      arrival_time: '2015-12-27T07:30',
    },
  },
});
```

<br />

<a id="quick-replies" />

### Quick Replies - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14175277_1582251242076612_248078259_n.png?oh=f87f9d3ea0f9902686f21a105e6fe9eb&oe=59F265D6" alt="Sender Actions" width="750" />

## `sendQuickReplies(userId, message, items)`

Send messages with quick replies to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request).

Param   | Type                              | Description
------- | --------------------------------- | -----------
userId  | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
message | `Object`                          | `text` or [`attachment`](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#attachment) must be set.
items   | `Array<Object>`                   | Array of [quick_reply](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#quick_reply) to be sent with messages.

Example:
```js
client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
  {
    content_type: 'text',
    title: 'Red',
    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
  },
]);
```

<br />

<a id="sender-actions" />

### Sender Actions - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/13480169_570751053131489_689799179_n.png?oh=e0a04cc8a7bdc05b39f9fd4262a6be04&oe=59F7E61C" alt="Sender Actions" width="250" />

## `sendSenderAction(userId, action)`

Send sender actions to specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request), to let users know you are processing their request.

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.
action | `String`                          | Name of the action.

Example:
```js
client.sendSenderAction(USER_ID, 'typing_on');
```

<br />

## `markSeen(userId)`

Mark last message as read for specified user.

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.

Example:
```js
client.markSeen(USER_ID);
```

<br />

## `typingOn(userId)`

Turn typing indicators on for specified user.

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.

Example:
```js
client.typingOn(USER_ID);
```

<br />

## `typingOff(userId)`

Turn typing indicators off for specified user.

Param  | Type                              | Description
------ | --------------------------------- | -----------
userId | <code>String &#124; Object</code> | Page-scoped user ID of the recipient or [recipient][send-api-reference#recipient] object.

Example:
```js
client.typingOff(USER_ID);
```

<br />

<a id="attachment-upload-api" />

### Attachment Upload API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload)

## `uploadAttachment(type, url)`

Upload specified type attachment using URL address.

Param | Type     | Description
----- | -------- | -----------
type  | `String` | Must be one of `image | video | audio | file`.
url   | `String` | URL address of the attachment.

Example:
```js
client.uploadAttachment('image', 'http://www.example.com/image.jpg');
```

<br />

## `uploadAudio(url)`

Upload audio attachment using URL address.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | URL address of the audio.

Example:
```js
client.uploadAudio('http://www.example.com/audio.mp3');
```

<br />

## `uploadImage(url)`

Upload image attachment using URL address.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | URL address of the image.

Example:
```js
client.uploadImage('http://www.example.com/image.jpg');
```

<br />

## `uploadVideo(url)`

Upload video attachment using URL address.

Upload image attachment using URL address.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | URL address of the video.

Example:
```js
client.uploadVideo('http://www.example.com/video.mp4');
```

<br />

## `uploadFile(url)`

Upload file attachment using URL address.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | URL address of the file.

Example:
```js
client.uploadFile('http://www.example.com/file.pdf');
```

<br />

<a id="tags" />

### Tags - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/)

## `getMessageTags`

Getting tags list via an API.

Example:
```js
client.getMessageTags().then(tags => {
  console.log(tags);
  // [
  //   {
  //     tag: 'SHIPPING_UPDATE',
  //     description:
  //       'The shipping_update tag may only be used to provide a shipping status notification for a product that has already been purchased. For example, when the product is shipped, in-transit, delivered, or delayed. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'RESERVATION_UPDATE',
  //     description:
  //       'The reservation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in itinerary, location, or a cancellation (such as when a hotel booking is canceled, a car rental pick-up time changes, or a room upgrade is confirmed). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'ISSUE_RESOLUTION',
  //     description:
  //       'The issue_resolution tag may only be used to respond to a customer service issue surfaced in a Messenger conversation after a transaction has taken place. This tag is intended for use cases where the business requires more than 24 hours to resolve an issue and needs to give someone a status update and/or gather additional information. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements, nor can businesses use the tag to proactively message people to solicit feedback).',
  //   },
  //   {
  //     tag: 'APPOINTMENT_UPDATE',
  //     description:
  //       'The appointment_update tag may only be used to provide updates about an existing appointment. For example, when there is a change in time, a location update or a cancellation (such as when a spa treatment is canceled, a real estate agent needs to meet you at a new location or a dental office proposes a new appointment time). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'GAME_EVENT',
  //     description:
  //       'The game_event tag may only be used to provide an update on user progression, a global event in a game or a live sporting event. For example, when a person’s crops are ready to be collected, their building is finished, their daily tournament is about to start or their favorite soccer team is about to play. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'TRANSPORTATION_UPDATE',
  //     description:
  //       'The transportation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in status of any flight, train or ferry reservation (such as “ride canceled”, “trip started” or “ferry arrived”). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'FEATURE_FUNCTIONALITY_UPDATE',
  //     description:
  //       'The feature_functionality_update tag may only be used to provide an update on new features or functionality that become available in a bot. For example, announcing the ability to talk to a live agent in a bot, or that the bot has a new skill. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  //   {
  //     tag: 'TICKET_UPDATE',
  //     description:
  //       'The ticket_update tag may only be used to provide updates pertaining to an event for which a person already has a ticket. For example, when there is a change in time, a location update or a cancellation (such as when a concert is canceled, the venue has changed or a refund opportunity is available). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
  //   },
  // ]
});
```

<br />

<a id="message-batching" />

### Message Batching - [Official Docs](https://developers.facebook.com/docs/graph-api/making-multiple-requests)

## `sendBatch(requests)`

Sends multiple requests in one batch.

Param    | Type            | Description
-------- | --------------- | -----------
requests | `Array<Object>` | Subrequests in the batch.

Example
```js
const { Messenger } = require('messaging-api-messenger');

client.sendBatch([
  Messenger.createText(USER_ID, '1'),
  Messenger.createText(USER_ID, '2'),
  Messenger.createText(USER_ID, '3'),
  Messenger.createText(USER_ID, '4'),
  Messenger.createText(USER_ID, '5'),
]);
```

<br />

<a id="broadcast-api" />

### Broadcast API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages)

To use the broadcast API, your Messenger bot must have the following permissions:

- `pages_messaging`
- `pages_messaging_subscriptions`

## `createMessageCreative(messages)`

Param    | Type            | Description
-------- | --------------- | -----------
messages | `Array<Object>` | The messages to send.

Example
```js
client.createMessageCreative([
  {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome to Our Marketplace!",
            "image_url":"https://www.facebook.com/jaspers.png",
            "subtitle":"Fresh fruits and vegetables. Yum.",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.jaspersmarket.com",
                "title":"View Website"
              }              
            ]      
          }
        ]
      }       
    }
  }
]).then(result => {
  console.log(result);
  // {
  //   message_creative_id: 938461089,
  // }
})
```

The following message templates are not supported:

- Airline boarding pass template
- Airline check-in template
- Airline itinerary template
- Airline flight update template
- Receipt template
- Open graph template

<br />

## `sendBroadcastMessage(messageCreativeId, options)`

Param                     | Type     | Description
------------------------- | -------- | -----------
messageCreativeId         | `Number` | The `message_creative_id` of the message creative to send in the broadcast.
options                   | `Object` | Other optional parameters.
options.custom_label_id   | `Number` | The id of custom label.

Example
```js
client.sendBroadcastMessage(938461089).then(result => {
  console.log(result);
  // {
  //   broadcast_id: 827,  
  // }
});
```

To send a broadcast message to the set of PSIDs associated with a label, pass label id as `custom_label_id` option:

```js
client.sendBroadcastMessage(938461089, { custom_label_id: LABEL_ID });
```

<br />

## `sendSponsoredMessage(adAcountId, args)`

Param                    | Type          | Description
------------------------ | ------------- | -----------
args                     | `Object`      | The Object to pass into request body.
args.message_creative_id | `Number`      | The ID of the Message Creative you want to send.
args.daily_budget        | `Number`      | The maximum daily budget of the ad campaign for sending the sponsored message.
args.bid_amount          | `Number`      | Maximum amount to bid for each message.
args.targeting           | `JSON String` | Option field for ads targeting

Example
```js
client.sendSponsoredMessage('18910417349234', {
  message_creative_id: 938461089,
  daily_budget: 100,
  bid_amount: 400,
  targeting: "{'geo_locations': {'countries':['US']}}",
}).then(result => {
  console.log(result);
  // {
  //   "ad_group_id": <AD_GROUP_ID>
  //   "broadcast_id": <BROADCAST_ID>
  //   "success": <RESPONSE_STATUS>
  // }
})
```

<br />

<a id="user-profile-api" />

### User Profile API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/user-profile)

## `getUserProfile(userId)`

Retrieving a Person's Profile.

Param  | Type     | Description
------ | -------- | -----------
userId | `String` | Page-scoped user ID of the recipient.

Example:
```js
client.getUserProfile(USER_ID).then(user => {
  console.log(user);
  // {
  //   first_name: 'Johnathan',
  //   last_name: 'Jackson',
  //   profile_pic: 'https://example.com/pic.png',
  //   locale: 'en_US',
  //   timezone: 8,
  //   gender: 'male',
  // }
});
```

<br />

<a id="messenger-profile-api" />

### Messenger Profile API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

## `getMessengerProfile(fields)`

Retrieves the current value of one or more Messenger Profile properties by name.

Param  | Type            | Description
------ | --------------- | -----------
fields | `Array<String>` | Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `whitelisted_domains`, `payment_settings`, `target_audience`, `home_url`.

Example:
```js
client.getMessengerProfile(['get_started', 'persistent_menu']).then(profile => {
  console.log(profile);
  // [
  //   {
  //     get_started: {
  //       payload: 'GET_STARTED',
  //     },
  //   },
  //   {
  //     persistent_menu: [
  //       {
  //         locale: 'default',
  //         composer_input_disabled: true,
  //         call_to_actions: [
  //           {
  //             type: 'postback',
  //             title: 'Restart Conversation',
  //             payload: 'RESTART',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ]
});
```

<br />

## `setMessengerProfile(profile)`

Sets the values of one or more Messenger Profile properties. Only properties set in the request body will be overwritten.

Param   | Type     | Description
------- | -------- | -----------
profile | `Object` | Object of [Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#profile_properties).

Example:
```js
client.setMessengerProfile({
  get_started: {
    payload: 'GET_STARTED',
  },
  persistent_menu: [
    {
      locale: 'default',
      composer_input_disabled: true,
      call_to_actions: [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
      ],
    },
  ],
});
```

<br />

## `deleteMessengerProfile(fields)`

Deletes one or more Messenger Profile properties. Only properties specified in the fields array will be deleted.

Param  | Type            | Description
------ | --------------- | -----------
fields | `Array<String>` | Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `whitelisted_domains`, `payment_settings`, `target_audience`, `home_url`.

Example:
```js
client.deleteMessengerProfile(['get_started', 'persistent_menu']);
```

<br />

<a id="persistent-menu" />

### Persistent Menu - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu)

![](https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/16686128_804279846389859_443648268883197952_n.png?oh=adde03b0bc7dd524a58cf46016e0267d&oe=59FC90D6)

## `getPersistentMenu`

Retrieves the current value of persistent menu.

Example:
```js
client.getPersistentMenu().then(menu => {
  console.log(menu);
  // [
  //   {
  //     locale: 'default',
  //     composer_input_disabled: true,
  //     call_to_actions: [
  //       {
  //         type: 'postback',
  //         title: 'Restart Conversation',
  //         payload: 'RESTART',
  //       },
  //       {
  //         type: 'web_url',
  //         title: 'Powered by ALOHA.AI, Yoctol',
  //         url: 'https://www.yoctol.com/',
  //       },
  //     ],
  //   },
  // ]
});
```

<br />

## `setPersistentMenu(menu)`

Sets the values of persistent menu.

Param | Type            | Description
----- | --------------- | -----------
menu  | `Array<Object>` | Array of [menu](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu#properties).

Example:
```js
client.setPersistentMenu([
  {
    locale: 'default',
    call_to_actions: [
      {
        title: 'Play Again',
        type: 'postback',
        payload: 'RESTART',
      },
      {
        title: 'Language Setting',
        type: 'nested',
        call_to_actions: [
          {
            title: '中文',
            type: 'postback',
            payload: 'CHINESE',
          },
          {
            title: 'English',
            type: 'postback',
            payload: 'ENGLISH',
          },
        ],
      },
      {
        title: 'Explore D',
        type: 'nested',
        call_to_actions: [
          {
            title: 'Explore',
            type: 'web_url',
            url: 'https://www.youtube.com/watch?v=v',
            webview_height_ratio: 'tall',
          },
          {
            title: 'W',
            type: 'web_url',
            url: 'https://www.facebook.com/w',
            webview_height_ratio: 'tall',
          },
          {
            title: 'Powered by YOCTOL',
            type: 'web_url',
            url: 'https://www.yoctol.com/',
            webview_height_ratio: 'tall',
          },
        ],
      },
    ],
  },
]);
```

> Note: You must set a get started button to use the persistent menu.

<br />

## `deletePersistentMenu`

Deletes persistent menu.

Example:
```js
client.deletePersistentMenu();
```

<a id="get-started-button" />

### Get Started Button - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14302685_243106819419381_1314180151_n.png?oh=9487042d8c0067eb2fda1efa45d0e17b&oe=59F7185C" alt="Get Started Button" width="500" />

## `getGetStarted`

Retrieves the current value of get started button.

Example:
```js
client.getGetStarted().then(getStarted => {
  console.log(getStarted);
  // {
  //   payload: 'GET_STARTED',
  // }
});
```

<br />

## `setGetStarted(payload)`

Sets the values of get started button.

Param   | Type     | Description
------- | -------- | -----------
payload | `String` | Payload sent back to your webhook in a `messaging_postbacks` event when the 'Get Started' button is tapped.

Example:
```js
client.setGetStarted('GET_STARTED');
```

<br />

## `deleteGetStarted`

Deletes get started button.

Example:
```js
client.deleteGetStarted();
```

<a id="greeting-text" />

### Greeting Text - [Officail docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14287888_188235318253964_1078929636_n.png?oh=a1171ab50f04d3a244ed703eafd2dbef&oe=59F01AF5" alt="Greeting Text" width="250" />

## `getGreeting`

Retrieves the current value of greeting text.

Example:
```js
client.getGreeting().then(greeting => {
  console.log(greeting);
  // [
  //   {
  //     locale: 'default',
  //     text: 'Hello!',
  //   },
  // ]
});
```

<br />

## `setGreeting(greeting)`

Sets the values of greeting text.

Param    | Type            | Description
-------- | --------------- | -----------
greeting | `Array<Object>` | Array of [greeting](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting#properties).

Example:
```js
client.setGreeting([
  {
    locale: 'default',
    text: 'Hello!',
  },
]);
```

<br />

## `deleteGreeting`

Deletes greeting text.

Example:
```js
client.deleteGreeting();
```

<a id="domain-whitelist" />

### Whitelisted Domains - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting)

## `getWhitelistedDomains`

Retrieves the current value of whitelisted domains.

Example:
```js
client.getWhitelistedDomains().then(domains => {
  console.log(domains);
  // ['http://www.example.com/']
});
```

<br />

## `setWhitelistedDomains(domains)`

Sets the values of whitelisted domains.

Param   | Type            | Description
------- | --------------- | -----------
domains | `Array<String>` | Array of [whitelisted_domain](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting#properties).

Example:
```js
client.setWhitelistedDomains(['www.example.com']);
```

<br />

## `deleteWhitelistedDomains`

Deletes whitelisted domains.

Example:
```js
client.deleteWhitelistedDomains();
```

<a id="account-linking-url" />

### Account Linking URL - [Official Docs](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url)

## `getAccountLinkingURL`

Retrieves the current value of account linking URL.

Example:
```js
client.getAccountLinkingURL().then(accountLinking => {
  console.log(accountLinking);
  // {
  //   account_linking_url:
  //     'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
  // }
});
```

<br />

## `setAccountLinkingURL(url)`

Sets the values of account linking URL.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | Account linking URL.

Example:
```js
client.setAccountLinkingURL(
  'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
);
```

<br />

## `deleteAccountLinkingURL`

Deletes account linking URL.

Example:
```js
client.deleteAccountLinkingURL();
```

<a id="payment-settings" />

### Payment Settings - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/payment-settings)

## `getPaymentSettings`

Retrieves the current value of payment settings.

Example:
```js
client.getPaymentSettings().then(settings => {
  console.log(settings);
  // {
  //   privacy_url: 'www.facebook.com',
  //   public_key: 'YOUR_PUBLIC_KEY',
  //   test_users: ['12345678'],
  // }
});
```

<br />

## `setPaymentPrivacyPolicyURL(url)`

Sets the values of payment privacy policy URL.

Param | Type     | Description
----- | -------- | -----------
url   | `String` | Payment privacy policy URL.

Example:
```js
client.setPaymentPrivacyPolicyURL('https://www.example.com');
```

<br />

## `setPaymentPublicKey(key)`

Sets the values of payment public key.

Param | Type     | Description
----- | -------- | -----------
key   | `String` | payment public key.

Example:
```js
client.setPaymentPublicKey('YOUR_PUBLIC_KEY');
```

<br />

## `setPaymentTestUsers(users)`

Sets the values of payment test users.

Param | Type            | Description
----- | --------------- | -----------
users | `Array<String>` | Array of IDs for people that will test payments in your app.

Example:
```js
client.setPaymentTestUsers(['12345678']);
```

<br />

## `deletePaymentSettings`

Deletes payment settings.

Example:
```js
client.deletePaymentSettings();
```

<br />

<a id="target-audience" />

### Target Audience - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/target-audience)

## `getTargetAudience`

Retrieves the current value of target audience.

Example:
```js
client.getTargetAudience().then(targetAudience => {
  console.log(targetAudience);
  // {
  //   audience_type: 'custom',
  //   countries: {
  //     whitelist: ['US', 'CA'],
  //   },
  // }
});
```

<br />

## `setTargetAudience(type, whitelist, blacklist)`

Sets the values of target audience.

Param     | Type            | Description
--------- | --------------- | -----------
type      | `String`        | Audience type. Valid values include `all | custom | none`.
whitelist | `Array<String>` | List of ISO 3166 Alpha-2 codes. Users in any of the blacklist countries won't see your bot on discovery surfaces on Messenger Platform.
blacklist | `Array<String>` | List of ISO 3166 Alpha-2 codes. Users in any of the whitelist countries will see your bot on discovery surfaces on Messenger Platform.

Exmaple:
```js
client.setTargetAudience('custom', ['US', 'CA'], ['UK']);
```

<br />

## `deleteTargetAudience`

Deletes target audience.

Example:
```js
client.deleteTargetAudience();
```

<br />

<a id="chat-extension-home-url" />

### Chat Extension Home URL - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/home-url)

## `getHomeURL`

Retrieves the current value of chat extension home URL.

Example:
```js
client.getHomeURL().then(chatExtension => {
  console.log(chatExtension);
  // {
  //   url: 'http://petershats.com/send-a-hat',
  //   webview_height_ratio: 'tall',
  //   in_test: true,
  // }
});
```

<br />

## `setHomeURL(url, attributes)`

Sets the values of chat extension home URL.

Param      | Type     | Description
---------- | ---------| -----------
url        | `String` | The URL to be invoked from drawer.
attributes | `Object` | Other [properties](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/home-url#properties) of home URL.

Exmaple:
```js
client.setHomeURL('http://petershats.com/send-a-hat', {
  webview_height_ratio: 'tall',
  in_test: true,
});
```

<br />

## `deleteHomeURL`

Deletes chat extension home URL.

Example:
```js
client.deleteHomeURL();
```

<br />

<a id="messenger-code-api" />

### Messenger Code API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-code)

![](https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/16685647_261975084241469_2329165888516784128_n.png?oh=61941dc020355f5c8fe88035d33f1503&oe=59F612D6)

## `generateMessengerCode(options)`

Generating a Messenger code.

Param              | Type     | Description
------------------ | ---------| -----------
options            | `Object` | Optional parameters of generating a Messenger code.
options.image_size | `Number` | The size, in pixels, for the image you are requesting.
options.data       | `Object` | If creating a parametric code, pass `{ "data": { "ref": "YOUR_REF_HERE" } }`.

Example:
```js
client
  .generateMessengerCode({
    data: {
      ref: 'billboard-ad',
    },
    image_size: 1000,
  })
  .then(code => {
    console.log(code);
    // {
    //   "uri": "YOUR_CODE_URL_HERE"
    // }
  });
```

<br />

### Handover Protocol API

## `passThreadControl(userId, targetAppId, metadata)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/pass-thread-control)

Passes thread control from your app to another app.

Param       | Type     | Description
----------- | ---------| -----------
userId      | `String` | The PSID of the message recipient.
targetAppId | `Number` | The app ID of the Secondary Receiver to pass thread control to.
metadata    | `String` | Metadata passed to the receiving app in the `pass_thread_control` webhook event.

Example:
```js
client.passThreadControl(USER_ID, APP_ID, 'free formed text for another app');
```

<br />

## `passThreadControlToPageInbox(userId, metadata)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control#page_inbox)

Passes thread control from your app to "Page Inbox" app.

Param       | Type     | Description
----------- | ---------| -----------
userId      | `String` | The PSID of the message recipient.
metadata    | `String` | Metadata passed to the receiving app in the `pass_thread_control` webhook event.

Example:
```js
client.passThreadControlToPageInbox(USER_ID, 'free formed text for another app');
```

<br />

## `takeThreadControl(userId, metadata)` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/take-thread-control)

Takes control of a specific thread from a Secondary Receiver app.

Param       | Type     | Description
----------- | ---------| -----------
userId      | `String` | The PSID of the message recipient.
metadata    | `String` | Metadata passed back to the secondary app in the `take_thread_control` webhook event.

Example:
```js
client.passThreadControl(USER_ID, 'free formed text for another app');
```

<br />

## `getSecondaryReceivers` - [Official Docs](https://developers.facebook.com/docs/messenger-platform/secondary-receivers)

Retrieves the list of apps that are Secondary Receivers for a page.

Example:
```js
client.getSecondaryReceivers().then(receivers => {
  console.log(receivers);
  // [
  //   {
  //     "id": "12345678910",
  //     "name": "David's Composer"
  //   },
  //   {
  //     "id": "23456789101",
  //     "name": "Messenger Rocks"
  //   }
  // ]
});
```

<br />

<a id="page-messaging-insights-api" />

### Page Messaging Insights API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/insights/page-messaging)

## `getDailyUniqueActiveThreadCounts`

Retrieves a count of the unique active threads your app participated in per day.

Example:
```js
client.getDailyUniqueActiveThreadCounts().then(counts => {
  console.log(counts);
  // [
  //   {
  //     "name": "page_messages_active_threads_unique",
  //     "period": "day",
  //     "values": [
  //       {
  //         "value": 83111,
  //         "end_time": "2017-02-02T08:00:00+0000"
  //       },
  //       {
  //         "value": 85215,
  //         "end_time": "2017-02-03T08:00:00+0000"
  //       },
  //       {
  //         "value": 87175,
  //         "end_time": "2017-02-04T08:00:00+0000"
  //       }
  //    ],
  //    "title": "Daily unique active threads count by thread fbid",
  //    "description": "Daily: total unique active threads created between users and page.",
  //    "id": "1234567/insights/page_messages_active_threads_unique/day"
  //   }
  // ]
});
```

<br />

## `getDailyUniqueConversationCounts`

Retrieves a count of actions that were initiated by people your app was in an active thread with per day.

Example:
```js
client.getDailyUniqueConversationCounts().then(counts => {
  console.log(counts);
  // [
  //   {
  //     "name": "page_messages_feedback_by_action_unique",
  //     "period": "day",
  //     "values": [
  //       {
  //         "value": {
  //           "TURN_ON": 40,
  //           "TURN_OFF": 167,
  //           "DELETE": 720,
  //           "OTHER": 0,
  //           "REPORT_SPAM": 0
  //         },
  //         "end_time": "2017-02-02T08:00:00+0000"
  //       },
  //       {
  //         "value": {
  //           "TURN_ON": 38,
  //           "DELETE": 654,
  //           "TURN_OFF": 155,
  //           "REPORT_SPAM": 1,
  //           "OTHER": 0
  //         },
  //         "end_time": "2017-02-03T08:00:00+0000"
  //       }
  //     ],
  //     "title": "Daily unique conversation count broken down by user feedback actions",
  //     "description": "Daily: total unique active threads created between users and page.",
  //     "id": "1234567/insights/page_messages_active_threads_unique/day"
  //   }
  // ],
});
```

<br />

<a id="built-in-nlp-api" />

### Built-in NLP API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/built-in-nlp)

## `setNLPConfigs(config)`

Set values of NLP configs.

Param               | Type      | Description
------------------- | --------- | -----------
config              | `Object`  | Configuration of NLP.
config.nlp_enabled  | `Boolean` | Either enable NLP or disable NLP for that Page.
config.custom_token | `String`  | Access token from Wit.

Example:
```js
client.setNLPConfigs({
  nlp_enabled: true,
});
```

<br />

## `enableNLP`

Enabling Built-in NLP.

Example:
```js
client.enableNLP();
```

<br />

## `disableNLP`

Disabling Built-in NLP.

Example:
```js
client.disableNLP();
```

[send-api-reference#recipient]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#recipient
