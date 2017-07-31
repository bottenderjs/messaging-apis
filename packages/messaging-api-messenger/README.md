# messaging-api-messenger

> Messaging API client for Messenger

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
  * [User Profile API](#user-profile-api)
  * [Messenger Profile API](#messenger-profile-api)
    * [Persistent Menu](#persistent-menu)
    * [Get Started Button](#get-started-button)
    * [Greeting Text](#greeting-text)
    * [Domain Whitelist](#domain-whitelist)
    * [Account Linking URL](#account-linking-url)
    * [Payment Settings](#payment-settings)
    * [Target Audience](#target-audience)
    * [Chat Extension Home URL](#chat-extension-home-url)

## Installation

```sh
npm i --save messaging-api-messenger
```
or
```sh
yarn add messaging-api-messenger
```

## Usage

### Initialize

```js
const { MessengerClient } = require('messaging-api-messenger');

// get accessToken from facebook developers website
const client = MessengerClient.connect(accessToken);
```

You can specify version of Facebook Graph API using second argument:

```js
const client = MessengerClient.connect(accessToken, 'v2.9');
```

If it is not specified, version `v2.10` will be used as default.

## API Reference

All methods return a Promise.

### Send API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference)  
[Content types](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)

#### sendRawBody(body)

###### body

Type: `Object`

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

#### send(userId, message)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### message

Type: `Object`

```js
client.send(USER_ID, {
  text: 'Hello!',
});
```

### Content Types

#### sendText(userId, text [, options])

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### text

Type: `String`

###### options

Type: `Object`

```js
client.sendText(USER_ID, 'Hello!');
```

#### sendIssueResolutionText(userId, text)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### text

Type: `String`

```js
client.sendIssueResolutionText(USER_ID, 'Hello!');
```

#### sendAttachment(userId, attachment)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### attachment

Type: `Object`

```js
client.sendAttachment(USER_ID, {
  type: 'image',
  payload: {
    url: 'https://example.com/pic.png',
  },
});
```

#### sendAudio(userId, url)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### url

Type: `String`

```js
client.sendAudio(USER_ID, 'https://example.com/audio.mp3');
```

#### sendImage(userId, url)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### url

Type: `String`

```js
client.sendImage(USER_ID, 'https://example.com/pic.png');
```

#### sendVideo(userId, url)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### url

Type: `String`

```js
client.sendVideo(USER_ID, 'https://example.com/video.mp4');
```

#### sendFile(userId, url)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### url

Type: `String`

```js
client.sendFile(USER_ID, 'https://example.com/word.docx');
```

### Templates

#### sendTemplate(userId, template)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### template

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates)

#### sendButtonTemplate(userId, title, buttons)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### title

Type: `String`

###### buttons

Type: `Array<Object>`


```js
client.sendButtonTemplate(USER_ID, 'my_title', [
  {
    type: 'postback',
    title: 'Start Chatting',
    payload: 'USER_DEFINED_PAYLOAD',
  },
]);
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

#### sendGenericTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendGenericTemplate(USER_ID, [
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
]);
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

#### sendTaggedTemplate(userId, elements, tag)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

###### tag

Type: `String`

```js
client.sendTaggedTemplate(
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
  'GAME_EVENT'
);
```

[Official docs for message tags](https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/)

#### sendShippingUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendShippingUpdateTemplate(USER_ID, [
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
]);
```

#### sendReservationUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendReservationUpdateTemplate(USER_ID, [
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
]);
```

#### sendIssueResolutionTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendIssueResolutionTemplate(USER_ID, [
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
]);
```

#### sendAppointmentUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendAppointmentUpdateTemplate(USER_ID, [
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
]);
```

#### sendGameEventTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendGameEventTemplate(USER_ID, [
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
]);
```

#### sendTransportationUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendTransportationUpdateTemplate(USER_ID, [
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
]);
```

#### sendFeatureFunctionalityUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendFeatureFunctionalityUpdateTemplate(USER_ID, [
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
]);
```

#### sendTicketUpdateTemplate(userId, elements)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### elements

Type: `Array<Object>`

```js
client.sendTicketUpdateTemplate(USER_ID, [
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
]);
```

#### sendListTemplate(userId, items, buttons, topElementStyle)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### items

Type: `Array<Object>`

###### buttons

Type: `Array<Object>`

###### topElementStyle

Type: `String`

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
      title: 'Start Chatting',
      payload: 'USER_DEFINED_PAYLOAD',
    },
  ],
  'compact'
);
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template)

#### sendOpenGraphTemplate(userId, elements)

###### elements

Type: `Array<Object>`

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

#### sendReceiptTemplate(userId, receipt)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### receipt

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

#### sendAirlineBoardingPassTemplate(userId, attributes)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### attributes

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template)

#### sendAirlineCheckinTemplate

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### attributes

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template)

#### sendAirlineItineraryTemplate

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### attributes

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template)

#### sendAirlineFlightUpdateTemplate

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### attributes

Type: `Object`

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

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template)

### Quick Replies

#### sendQuickReplies(userId, message, items)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### message

Type: `Object`

###### items

Type: `Array<Object>`

```js
client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
  {
    content_type: 'text',
    title: 'Red',
    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
  },
]);
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies)

### Sender Actions

#### sendSenderAction(userId, action)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

###### action

Type: `String`

Name of the action.

```js
client.sendSenderAction(USER_ID, 'typing_on');
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions)

#### turnTypingIndicatorsOn(userId)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

```js
client.turnTypingIndicatorsOn(USER_ID);
```

#### turnTypingIndicatorsOff(userId)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

```js
client.turnTypingIndicatorsOff(USER_ID);
```

### Attachment Upload API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload/v2.8)

#### uploadAttachment(type, url)

###### type

Type: `String`

###### url

Type: `String`

URL address of the attachment.

```js
client.uploadAttachment('image', 'http://www.example.com/image.jpg');
```

#### uploadAudio(url)

###### url

Type: `String`

URL address of the audio.

```js
client.uploadAudio('http://www.example.com/audio.mp3');
```

#### uploadImage(url)

###### url

Type: `String`

URL address of the image.

```js
client.uploadImage('http://www.example.com/image.jpg');
```

#### uploadVideo(url)

###### url

Type: `String`

URL address of the video.

```js
client.uploadVideo('http://www.example.com/video.mp4');
```

#### uploadFile(url)

###### url

Type: `String`

URL address of the file.

```js
client.uploadFile('http://www.example.com/file.pdf');
```

### Tags

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/)

#### getMessageTags

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

### User Profile API

#### getUserProfile(userId)

###### userId

Type: `String`

Page-scoped user ID of the recipient.

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

### Messenger Profile API

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

#### getMessengerProfile(fields)

###### fields

Type: `Array<String>`

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

#### setMessengerProfile(profile)

###### profile

Type: `Object`

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

#### deleteMessengerProfile(fields)

###### fields

Type: `Array<String>`

```js
client.deleteMessengerProfile(['get_started', 'persistent_menu']);
```

### Persistent Menu

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu)

#### getPersistentMenu

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

#### setPersistentMenu(menu)

###### menu

Type: `Array<Object>`

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

#### deletePersistentMenu

```js
client.deletePersistentMenu();
```

### Get Started Button

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

#### getGetStartedButton

```js
client.getGetStartedButton().then(getStarted => {
  console.log(getStarted);
  // {
  //   payload: 'GET_STARTED',
  // }
});
```

#### setGetStartedButton(payload)

###### payload

Type: `String`

```js
client.setGetStartedButton('GET_STARTED');
```

#### deleteGetStartedButton

```js
client.deleteGetStartedButton();
```

### Greeting Text

[Officail docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text)

#### getGreetingText

```js
client.getGreetingText().then(greeting => {
  console.log(greeting);
  // [
  //   {
  //     locale: 'default',
  //     text: 'Hello!',
  //   },
  // ]
});
```

#### setGreetingText(greeting)

###### greeting

Type: `Array<Object>`

```js
client.setGreetingText([
  {
    locale: 'default',
    text: 'Hello!',
  },
]);
```

#### deleteGreetingText

```js
client.deleteGreetingText();
```

### Domain Whitelist

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting)

#### getDomainWhitelist

```js
client.getDomainWhitelist().then(domains => {
  console.log(domains);
  // ['http://www.example.com/']
});
```

#### setDomainWhitelist(domains)

###### domains

Type: `Array<String>`

```js
client.setDomainWhitelist(['www.example.com']);
```

#### deleteDomainWhitelist

```js
client.deleteDomainWhitelist();
```

### Account Linking URL

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/account-linking-url)

#### getAccountLinkingURL

```js
client.getAccountLinkingURL().then(accountLinking => {
  console.log(accountLinking);
  // {
  //   account_linking_url:
  //     'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
  // }
});
```

#### setAccountLinkingURL(url)

###### url

Type: `String`

```js
client.setAccountLinkingURL(
  'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
);
```

#### deleteAccountLinkingURL

```js
client.deleteAccountLinkingURL();
```

### Payment Settings

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/payment-settings)

#### getPaymentSettings

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

#### setPaymentPrivacyPolicyURL(url)

###### url

Type: `String`

```js
client.setPaymentPrivacyPolicyURL('https://www.example.com');
```

#### setPaymentPublicKey(key)

###### key

Type: `String`

```js
client.setPaymentPublicKey('YOUR_PUBLIC_KEY');
```

#### setPaymentTestUsers(users)

###### users

Type: `Array<String>`

```js
client.setPaymentTestUsers(['12345678']);
```

#### deletePaymentSettings

```js
client.deletePaymentSettings();
```

### Target Audience

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/target-audience)

#### getTargetAudience

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

#### setTargetAudience(type, whitelist, blacklist)

###### type

Type: `String`

##### whitelist

Type: `Array<String>`

##### blacklist

Type: `Array<String>`

```js
client.setTargetAudience('custom', ['US', 'CA'], ['UK']);
```

#### deleteTargetAudience

```js
client.deleteTargetAudience();
```

### Chat Extension Home URL

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/home-url)

#### getChatExtensionHomeURL

```js
client.getChatExtensionHomeURL().then(chatExtension => {
  console.log(chatExtension);
  // {
  //   url: 'http://petershats.com/send-a-hat',
  //   webview_height_ratio: 'tall',
  //   in_test: true,
  // }
});
```

#### setChatExtensionHomeURL(url, attributes)

###### url

Type: `String`

##### attributes

Type: `Object`

```js
client.setChatExtensionHomeURL('http://petershats.com/send-a-hat', {
  webview_height_ratio: 'tall',
  in_test: true,
});
```

#### deleteChatExtensionHomeURL

```js
client.deleteChatExtensionHomeURL();
```
