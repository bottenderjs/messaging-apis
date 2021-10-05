# messaging-api-messenger

> Messaging API client for Messenger

<img src="https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/p6_sqYxQ9ch.png" alt="Messenger" width="150" />

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Send API](#send-api)
    - [Content Types](#content-types)
    - [Templates](#templates)
    - [Quick Replies](#quick-replies)
    - [Sender Actions](#sender-actions)
    - [Attachment Upload API](#attachment-upload-api)
    - [Message Batching](#message-batching)
  - [Custom Labels](#custom-labels)
  - [User Profile API](#user-profile-api)
  - [Messenger Profile API](#messenger-profile-api)
    - [Persistent Menu](#persistent-menu)
    - [Get Started Button](#get-started-button)
    - [Greeting Text](#greeting-text)
    - [Whitelisted Domains](#domain-whitelist)
    - [Account Linking URL](#account-linking-url)
  - [Handover Protocol API](#handover-protocol-api)
  - [Page Messaging Insights API](#page-messaging-insights-api)
  - [Built-in NLP API](#built-in-nlp-api)
  - [Event Logging API](#event-logging-api)
  - [ID Matching API](#id-matching-api)
  - [Persona API](#persona-api)
  - [Others](#others)
- [Debug Tips](#debug-tips)
- [Testing](#testing)

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

const client = new MessengerClient({
  accessToken: ACCESS_TOKEN,
  appId: APP_ID,
  appSecret: APP_SECRET,
  version: '6.0',
});
```

If the `version` option is not specified, `6.0` will be used by default.

### Verifying Graph API Calls with `appsecret_proof`

If `appSecret` is provided, `MessengerClient` will enable this feature automatically and include `appsecret_proof` in every Graph API requests. To skip it, set the `skipAppSecretProof` option to `true`:

```js
const client = new MessengerClient({
  accessToken: ACCESS_TOKEN,
  appId: APP_ID,
  appSecret: APP_SECRET,
  skipAppSecretProof: true,
});
```

### Error Handling

`messaging-api-messenger` uses [axios](https://github.com/axios/axios) as HTTP client. We use [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package to wrap API error instances for better formatting error messages. Directly calling `console.log` with the error instance will return formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via those keys on the error instance.

```js
client.sendRawBody(body).catch((error) => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});
```

<br />

## API Reference

All methods return a Promise.

<br />

<a id="send-api" />

### Send API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference)

- [sendRawBody](/messaging_api_messenger.MessengerClient.html#sendrawbody)
- [sendMessage](/messaging_api_messenger.MessengerClient.html#sendmessage)

<a id="content-types" />

### Content Types - [Content types](https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes)

- [sendText](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendtext)
- [sendAttachment](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendattachment)
- [sendAudio](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendaudio)
- [sendImage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendimage)
- [sendVideo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendvideo)
- [sendFile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendfile)

<a id="templates" />

### Templates - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates)

- [sendTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendtemplate)
- [sendButtonTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendbuttontemplate)
- [sendGenericTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendgenerictemplate)
- [sendMediaTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendmediatemplate)
- [sendReceiptTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendreceipttemplate)
- [sendAirlineBoardingPassTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendairlineboardingpasstemplate)
- [sendAirlineCheckinTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendairlinecheckintemplate)
- [sendAirlineItineraryTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendairlineitinerarytemplate)
- [sendAirlineUpdateTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendairlineupdatetemplate)
- [sendOneTimeNotifReqTemplate](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendonetimenotifreqtemplate)

<br />

<a id="quick-replies" />

### Quick Replies - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies)

<img src="https://user-images.githubusercontent.com/3382565/37411344-91c8ad54-27dd-11e8-82fc-fd9adf896301.png" alt="Quick Replies" width="750" />

To send messages with quick replies to the specified user using the [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api#request), pass `quickReplies` option to send message methods, for example, with `sendText`:

```js
await client.sendText(USER_ID, 'Pick a color:', {
  quickReplies: [
    {
      contentType: 'text',
      title: 'Red',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
    },
  ],
});
```

with the `sendImage` option:

```js
await client.sendImage(USER_ID, 'https://example.com/vr.jpg', {
  quickReplies: [
    {
      contentType: 'text',
      title: 'Red',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
    },
  ],
});
```

It works with all of message sending methods.

<br />

<a id="sender-actions" />

### Sender Actions - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions)

<img src="https://user-images.githubusercontent.com/3382565/37411363-9b65ecaa-27dd-11e8-8f51-7aac7fd0bd2f.png" alt="Sender Actions" width="250" />

- [sendSenderAction](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendsenderaction)
- [markSeen](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#markseen)
- [typingOn](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#typingon)
- [typingOff](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#typingoff)

<a id="attachment-upload-api" />

### Attachment Upload API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload)

> Note: Only attachments that were uploaded with the `isReusable` property set to `true` can be sent to other message recipients.

- [uploadAttachment](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#uploadattachment)
- [uploadAudio](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#uploadaudio)
- [uploadImage](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#uploadimage)
- [uploadVideo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#uploadvideo)
- [uploadFile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#uploadfile)

<br />

<a id="message-batching" />

### Message Batching - [Official Docs](https://developers.facebook.com/docs/graph-api/making-multiple-requests)

- [sendBatch](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#sendbatch)

There are a bunch of factory methods can be used to create batch requests:

- `MessengerBatch.sendRequest`
- `MessengerBatch.sendMessage`
- `MessengerBatch.sendText`
- `MessengerBatch.sendAttachment`
- `MessengerBatch.sendAudio`
- `MessengerBatch.sendImage`
- `MessengerBatch.sendVideo`
- `MessengerBatch.sendFile`
- `MessengerBatch.sendTemplate`
- `MessengerBatch.sendButtonTemplate`
- `MessengerBatch.sendGenericTemplate`
- `MessengerBatch.sendReceiptTemplate`
- `MessengerBatch.sendMediaTemplate`
- `MessengerBatch.sendAirlineBoardingPassTemplate`
- `MessengerBatch.sendAirlineCheckinTemplate`
- `MessengerBatch.sendAirlineItineraryTemplate`
- `MessengerBatch.sendAirlineUpdateTemplate`
- `MessengerBatch.sendSenderAction`
- `MessengerBatch.typingOn`
- `MessengerBatch.typingOff`
- `MessengerBatch.markSeen`
- `MessengerBatch.getUserProfile`
- `MessengerBatch.passThreadControl`
- `MessengerBatch.passThreadControlToPageInbox`
- `MessengerBatch.takeThreadControl`
- `MessengerBatch.requestThreadControl`
- `MessengerBatch.associateLabel`
- `MessengerBatch.dissociateLabel`
- `MessengerBatch.getAssociatedLabels`

Those methods have exactly same argument signature with the methods on client.

<br />

<a id="custom-labels" />

### Custom Labels - [Official Docs](https://developers.facebook.com/docs/messenger-platform/identity/custom-labels)

- [createLabel](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#createlabel)
- [associateLabel](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#associatelabel)
- [dissociateLabel](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#dissociatelabel)
- [getAssociatedLabels](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getassociatedlabels)
- [getLabelDetails](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getlabeldetails)
- [getLabelList](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getlabellist)
- [deleteLabel](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletelabel)

<br />

<a id="user-profile-api" />

### User Profile API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/user-profile)

- [getUserProfile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getuserprofile)

<br />

<a id="messenger-profile-api" />

### Messenger Profile API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

- [getMessengerProfile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getmessengerprofile)
- [setMessengerProfile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setmessengerprofile)
- [deleteMessengerProfile](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletemessengerprofile)

<a id="persistent-menu" />

### Persistent Menu - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu)

![](https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/16686128_804279846389859_443648268883197952_n.png?oh=adde03b0bc7dd524a58cf46016e0267d&oe=59FC90D6)

- [getPersistentMenu](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getpersistentmenu)
- [setPersistentMenu](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setpersistentmenu)
- [deletePersistentMenu](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletepersistentmenu)

<a id="get-started-button" />

### Get Started Button - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14302685_243106819419381_1314180151_n.png?oh=9487042d8c0067eb2fda1efa45d0e17b&oe=59F7185C" alt="Get Started Button" width="500" />

- [getGetStarted](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getgetstarted)
- [setGetStarted](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setgetstarted)
- [deleteGetStarted](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletegetstarted)

<a id="greeting-text" />

### Greeting Text - [Officail docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text)

<img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/14287888_188235318253964_1078929636_n.png?oh=a1171ab50f04d3a244ed703eafd2dbef&oe=59F01AF5" alt="Greeting Text" width="250" />

- [getGreeting](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getgreeting)
- [setGreeting](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setgreeting)
- [deleteGreeting](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletegreeting)

<a id="domain-whitelist" />

### Whitelisted Domains - [Official Docs](https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting)

- [getWhitelistedDomains](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getwhitelisteddomains)
- [setWhitelistedDomains](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setwhitelisteddomains)
- [deleteWhitelistedDomains](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletewhitelisteddomains)

<a id="account-linking-url" />

### Account Linking URL - [Official Docs](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url)

- [getAccountLinkingURL](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getaccountlinkingurl)
- [setAccountLinkingURL](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setaccountlinkingurl)
- [deleteAccountLinkingURL](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deleteaccountlinkingurl)

### Handover Protocol API

- [passThreadControl](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#passthreadcontrol)
- [passThreadControlToPageInbox](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#passthreadcontroltopageinbox)
- [takeThreadControl](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#takethreadcontrol)
- [requestThreadControl](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#requestthreadcontrol)
- [getThreadOwner](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getthreadowner)
- [getSecondaryReceivers](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getsecondaryreceivers)

<br />

<a id="page-messaging-insights-api" />

### Page Messaging Insights API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/insights/page-messaging)

Requirements for insights API:

- The page token must have `read_insights` permission.
- Insights are only generated for a Facebook Page that has more than `30` people that like it.

- [getInsights](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getinsights)
- [getBlockedConversations](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getblockedconversations)
- [getReportedConversations](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getreportedconversations)
- [getTotalMessagingConnections](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#gettotalmessagingconnections)
- [getNewConversations](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getnewconversations)

<br />

<a id="built-in-nlp-api" />

### Built-in NLP API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/built-in-nlp)

- [setNLPConfigs](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#setnlpconfigs)
- [enableNLP](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#enablenlp)
- [disableNLP](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#disablenlp)

<br />

<a id="event-logging-api" />

### Event Logging API - [Official Docs](https://developers.facebook.com/docs/app-events/bots-for-messenger#logging-custom-events)

- [logCustomEvents](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#logcustomevents)

<a id="id-matching-api" />

### ID Matching API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/identity/id-matching)

- [getIdsForApps](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getidsforapps)
- [getIdsForPages](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getidsforpages)

<br />

<a id="persona-api" />

### Persona API - [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/personas)

- [createPersona](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#createpersona)
- [getPersona](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getpersona)
- [getPersonas](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getpersonas)
- [getAllPersonas](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getallpersonas)
- [deletePersona](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#deletepersona)

<br />

### Others

- [debugToken](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#debugtoken)
- [createSubscription](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#createsubscription)
- [getSubscriptions](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getsubscriptions)
- [getPageSubscription](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getpagesubscription)
- [getPageInfo](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getpageinfo)
- [getMessagingFeatureReview](https://yoctol.github.io/messaging-apis/latest/classes/messaging_api_messenger.MessengerClient.html#getmessagingfeaturereview)

<br />

## Debug Tips

### Log Requests Details

To enable default request debugger, use following `DEBUG` env variable:

```sh
DEBUG=messaging-api:request
```

If you want to use a custom request logging function, just provide your own `onRequest`:

```js
const client = new MessengerClient({
  accessToken: ACCESS_TOKEN,
  onRequest: ({ method, url, headers, body }) => {
    /* */
  },
});
```

## Testing

### Point Requests to Your Dummy Server

To avoid sending requests to real Messenger server, specify the `origin` option when constructing your client:

```js
const { MessengerClient } = require('messaging-api-messenger');

const client = new MessengerClient({
  accessToken: ACCESS_TOKEN,
  origin: 'https://mydummytestserver.com',
});
```

> Warning: Don't do this on your production server.

[send-api-reference#recipient]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#recipient
