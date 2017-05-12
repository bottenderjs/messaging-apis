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

## Allowed Methods

### User

- `getUserProfile`

### Send API

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
- `sendButtonTemplate`
- `sendGenericTemplate`
- `sendShippingUpdateTemplate`
- `sendReservationUpdateTemplate`
- `sendIssueResolutionTemplate`
- `sendListTemplate`
- `sendReceiptTemplate`
- `sendAirlineBoardingPassTemplate`
- `sendAirlineCheckinTemplate`
- `sendAirlineItineraryTemplate`
- `sendAirlineFlightUpdateTemplate`
- `sendQuickReplies`
- `sendSenderAction`
- `turnTypingIndicatorsOn`
- `turnTypingIndicatorsOff`

### Upload API

- `uploadAttachment`
- `uploadAudio`
- `uploadImage`
- `uploadVideo`
- `uploadFile`

### Messenger Platform

#### Messenger Profile

- `getMessengerProfile`
- `setMessengerProfile`
- `deleteMessengerProfile`

#### Get Started Button

- `getGetStartedButton`
- `setGetStartedButton`
- `deleteGetStartedButton`

#### Persistent Menu

- `getPersistentMenu`
- `setPersistentMenu`
- `deletePersistentMenu`

#### Greeting Text

- `getGreetingText`
- `setGreetingText`
- `deleteGreetingText`

#### Domain Whitelist

- `getDomainWhitelist`
- `setDomainWhitelist`
- `deleteDomainWhitelist`

#### Account Linking URL

- `getAccountLinkingURL`
- `setAccountLinkingURL`
- `deleteAccountLinkingURL`

#### Payment Settings

- `getPaymentSettings`
- `setPaymentPrivacyPolicyURL`
- `setPaymentPublicKey`
- `setPaymentTestUsers`
- `deletePaymentSettings`

#### Target Audience

- `getTargetAudience`
- `setTargetAudience`
- `deleteTargetAudience`
