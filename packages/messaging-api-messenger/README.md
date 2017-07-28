# messaging-api-messenger

> Messaging API client for Messenger

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  * [User](#user)
  * [Send API](#send-api)
  * [Upload API](#upload-api)
  * [Messenger Profile](#messenger-profile)
  * [Get Started Button](#get-started-button)
  * [Persistent Menu](#persistent-menu)
  * [Greeting Text](#greeting-text)
  * [Domain Whitelist](#domain-whitelist)
  * [Account Linking URL](#account-linking-url)
  * [Payment Settings](#payment-settings)
  * [Target Audience](#target-audience)

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

### Call API

```js
async function fn() {
  await client.sendText(USER_ID, text, options);
}
```

or

```js
client.sendText(USER_ID, text, options).then(() => {
  // do something
});
```

## API Reference

All methods return a Promise.

### User

#### getUserProfile(userId)

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

### Send API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference)  
[Content types](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)

#### sendRawBody(body)

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

```js
client.send(USER_ID, {
  text: 'Hello!',
});
```

#### sendText(userId, text [, options])

```js
client.sendText(USER_ID, 'Hello!');
```

#### sendIssueResolutionText(userId, text)

```js
client.sendIssueResolutionText(USER_ID, 'Hello!');
```

#### sendAttachment(userId, attachment)

```js
client.sendAttachment(USER_ID, {
  type: 'image',
  payload: {
    url: 'https://example.com/pic.png',
  },
});
```

#### sendAudio(userId, url)

```js
client.sendAudio(USER_ID, 'https://example.com/audio.mp3');
```

#### sendImage(userId, url)

```js
client.sendImage(USER_ID, 'https://example.com/pic.png');
```

#### sendVideo(userId, url)

```js
client.sendVideo(USER_ID, 'https://example.com/video.mp4');
```

#### sendFile(userId, url)

```js
client.sendFile(USER_ID, 'https://example.com/word.docx');
```

#### sendTemplate(userId, template)

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

#### sendListTemplate(userId, items, topElementStyle)

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

#### sendReceiptTemplate

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

#### sendAirlineBoardingPassTemplate

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template)

#### sendAirlineCheckinTemplate

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template)

#### sendAirlineItineraryTemplate

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template)

#### sendAirlineFlightUpdateTemplate

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template)

#### sendQuickReplies(userId, message, items)

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

#### sendSenderAction

```js
client.sendSenderAction(USER_ID, 'typing_on');
```

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions)

#### turnTypingIndicatorsOn(userId)

```js
client.turnTypingIndicatorsOn(USER_ID);
```

#### turnTypingIndicatorsOff(userId)

```js
client.turnTypingIndicatorsOff(USER_ID);
```

### Upload API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload/v2.8)

#### uploadAttachment
#### uploadAudio
#### uploadImage
#### uploadVideo
#### uploadFile

### Messenger Profile

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

#### getMessengerProfile
#### setMessengerProfile
#### deleteMessengerProfile

### Get Started Button

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

#### getGetStartedButton
#### setGetStartedButton
#### deleteGetStartedButton

### Persistent Menu

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu)

#### getPersistentMenu
#### setPersistentMenu
#### deletePersistentMenu

### Greeting Text

[Officail docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text)

#### getGreetingText
#### setGreetingText
#### deleteGreetingText

### Domain Whitelist

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting)

#### getDomainWhitelist
#### setDomainWhitelist
#### deleteDomainWhitelist

### Account Linking URL

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/account-linking-url)

#### getAccountLinkingURL
#### setAccountLinkingURL
#### deleteAccountLinkingURL

### Payment Settings

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/payment-settings)

#### getPaymentSettings
#### setPaymentPrivacyPolicyURL
#### setPaymentPublicKey
#### setPaymentTestUsers
#### deletePaymentSettings

### Target Audience

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/target-audience)

#### getTargetAudience
#### setTargetAudience
#### deleteTargetAudience

### Chat Extension Home URL

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/home-url)

#### getChatExtensionHomeURL
#### setChatExtensionHomeURL
#### deleteChatExtensionHomeURL

### Message Tags

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/)

#### getMessageTags
