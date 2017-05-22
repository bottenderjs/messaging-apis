# messaging-api-messenger

> Messaging API client for Messenger

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
import { MessengerClient } from 'messaging-api-line';

// get accessToken from facebook developers website
const client = MessengerClient.factory(accessToken);
```

### API

```js
await client.sendText(recipientId, text, options);
```

or

```js
client.sendText(recipientId, text, options).then(() => {
  // do something
});
```

## Supported Methods

All methods return a Promise resolves an API response.

### User

- `getUserProfile`

### Send API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference)  
[Content types](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)

- `sendRawBody`
- `send`
- `sendAttachment`
- `sendText`
- `sendIssueResolutionText`
- `sendAudio`
- `sendImage`
- `sendVideo`
- `sendFile`
- `sendTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates)
- `sendButtonTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)
- `sendGenericTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)
- `sendShippingUpdateTemplate`
- `sendReservationUpdateTemplate`
- `sendIssueResolutionTemplate`
- `sendListTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template)
- `sendReceiptTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)
- `sendAirlineBoardingPassTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template)
- `sendAirlineCheckinTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template)
- `sendAirlineItineraryTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template)
- `sendAirlineFlightUpdateTemplate`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template)
- `sendQuickReplies`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies)
- `sendSenderAction`
  - [Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions)
- `turnTypingIndicatorsOn`
- `turnTypingIndicatorsOff`

### Upload API

[Official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload/v2.8)

- `uploadAttachment`
- `uploadAudio`
- `uploadImage`
- `uploadVideo`
- `uploadFile`

### Messenger Platform

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

#### Messenger Profile

- `getMessengerProfile`
- `setMessengerProfile`
- `deleteMessengerProfile`

#### Get Started Button

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

- `getGetStartedButton`
- `setGetStartedButton`
- `deleteGetStartedButton`

#### Persistent Menu

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu)

- `getPersistentMenu`
- `setPersistentMenu`
- `deletePersistentMenu`

#### Greeting Text

[Officail docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text)

- `getGreetingText`
- `setGreetingText`
- `deleteGreetingText`

#### Domain Whitelist

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting)

- `getDomainWhitelist`
- `setDomainWhitelist`
- `deleteDomainWhitelist`

#### Account Linking URL

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/account-linking-url)

- `getAccountLinkingURL`
- `setAccountLinkingURL`
- `deleteAccountLinkingURL`

#### Payment Settings

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/payment-settings)

- `getPaymentSettings`
- `setPaymentPrivacyPolicyURL`
- `setPaymentPublicKey`
- `setPaymentTestUsers`
- `deletePaymentSettings`

#### Target Audience

[Official docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/target-audience)

- `getTargetAudience`
- `setTargetAudience`
- `deleteTargetAudience`
