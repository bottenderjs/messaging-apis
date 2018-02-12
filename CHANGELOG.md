# 0.6.13 / 2018-02-12

* [new] Support `origin` for test:

```js
const { MessengerClient } = require('messaging-api-messenger');

const client = MessengerClient.connect({
  accessToken: ACCESS_TOKEN,
  origin: 'https://mydummytestserver.com',
});
```

# 0.6.12 / 2018-02-05

### messaging-api-line

* [fix] Add default value for LINE `_sendCarouselTemplate` options

# 0.6.11 / 2018-01-22

### messaging-api-viber

* [new] Support broadcast methods:

* `broadcastMessage(broadcastList, message)`
* `broadcastText(broadcastList, text [, options])`
* `broadcastPicture(broadcastList, picture [, options])`
* `broadcastVideo(broadcastList, video [, options])`
* `broadcastFile(broadcastList, file [, options])`
* `broadcastContact(broadcastList, contact [, options])`
* `broadcastLocation(broadcastList, location [, options])`
* `broadcastURL(broadcastList, url [, options])`
* `broadcastSticker(broadcastList, stickerId [, options])`
* `broadcastCarouselContent(broadcastList, richMedia [, options])`

# 0.6.10 / 2018-01-12

### messaging-api-slack

* [new] add Slack `postEphemeral` method:

```js
client.postEphemeral('C8763', 'U56781234', { attachments: [someAttachments] });
```

* [new] add SlackOAuthClient custom token support:

```js
client.callMethod('chat.postMessage', {
  token: 'custom token',
  channel: CHANNEL,
  text: 'hello',
});
```

# 0.6.9 / 2017-12-28

### messaging-api-messenger

* [fix] Not to use page token as default token when create subscription. [#267](https://github.com/Yoctol/messaging-apis/pull/267)

  # 0.6.8 / 2017-12-25

  ### messaging-api-telegram

* [new] Add `getUpdates`:

```js
client
  .getUpdates({
    limit: 10,
  })
  .then(data => {
    console.log(data.result);
    /*
      [
        {
          update_id: 513400512,
          message: {
            message_id: 3,
            from: {
              id: 313534466,
              first_name: 'first',
              last_name: 'last',
              username: 'username',
            },
            chat: {
              id: 313534466,
              first_name: 'first',
              last_name: 'last',
              username: 'username',
              type: 'private',
            },
            date: 1499402829,
            text: 'hi',
          },
        },
        ...
      ]
    */
  });
```

# 0.6.7 / 2017-12-22

### messaging-api-line

* [changed] Support original `baseSize` key in LINE imagemap APIs.

  # 0.6.6 / 2017-12-20

  ### messaging-api-messenger

* [fix] Not to attach empty array as `quick_replies` to message. [#261](https://github.com/Yoctol/messaging-apis/pull/261)

  # 0.6.5 / 2017-12-20

  ### messaging-api-telegram

* [new] Add `sendVideoNote`:

```js
client.sendVideoNote(CHAT_ID, 'https://example.com/video_note.mp4', {
  duration: 40,
  disable_notification: true,
});
```

# 0.6.4 / 2017-12-14

### messaging-api-messenger

* [changed] Rename arguments in `logCustomEvent` for consistency:

```
appId -> app_id
pageId -> page_id
userId -> page_scoped_user_id
```

```js
client.logCustomEvents({
  app_id: APP_ID,
  page_id: PAGE_ID,
  page_scoped_user_id: USER_ID,
  events: [
    {
      _eventName: 'fb_mobile_purchase',
      _valueToSum: 55.22,
      _fb_currency: 'USD',
    },
  ],
});
```

Original keys (`appId`, `pageId`, `userId`) will be removed when `v0.7` or `v0.8` release.

* [changed] Rename `Messenger` to `MessengerBatch`:

```js
const { MessengerBatch } = require('messaging-api-messenger');

client.sendBatch([
  MessengerBatch.createText(USER_ID, '1'),
  MessengerBatch.createText(USER_ID, '2'),
  MessengerBatch.createText(USER_ID, '3'),
  MessengerBatch.createText(USER_ID, '4'),
  MessengerBatch.createText(USER_ID, '5'),
]);
```

Original APIs on `Messenger` will be changed when `v0.7` release.

* [new] Add `createSubscription` method:

```js
client.createSubscription({
  app_id: APP_ID,
  callback_url: 'https://mycallback.com',
  fields: ['messages', 'messaging_postbacks', 'messaging_referrals'],
  verify_token: VERIFY_TOKEN,
});
```

* [new] ID Matching API:

Given a user ID for an app, retrieve the IDs for other apps owned by the same business.

```js
client
  .getIdsForApps({
    user_id: USER_ID,
    app_secret: APP_SECRET,
  })
  .then(result => {
    console.log(result);
  });
```

Given a user ID for a Page (associated with a bot), retrieve the IDs for other Pages owned by the same business.

```js
client
  .getIdsForPages({
    user_id: USER_ID,
    app_secret: APP_SECRET,
  })
  .then(result => {
    console.log(result);
  });
```

# 0.6.3 / 2017-12-12

### messaging-api-messenger

* [fix] pass options into `setGetStarted`

  # 0.6.2 / 2017-12-11

  ### messaging-api-telegram

Support Game APIs!

* `sendGame`:

```js
client.sendGame(CHAT_ID, 'Mario Bros.', {
  disable_notification: true,
});
```

* `setGameScore`:

```js
client.setGameScore(USER_ID, 999);
```

* `getGameHighScores`:

```js
client.getGameHighScores(USER_ID);
```

# 0.6.1 / 2017-12-08

### messaging-api-line

* [new] Support new options (`imageAspectRatio`, `imageSize`, `imageBackgroundColor`) for template message images [#247](https://github.com/Yoctol/messaging-apis/pull/247)

```js
client.replyButtonTemplate(REPLY_TOKEN, altText, {
  thumbnailImageUrl,
  title,
  imageAspectRatio: 'rectangle',
  imageSize: 'cover',
  imageBackgroundColor: '#FFFFFF',
  actions,
});
```

```js
client.replyCarouselTemplate(REPLY_TOKEN, altText, columns, {
  imageAspectRatio: 'rectangle',
  imageSize: 'cover',
});
```

### messaging-api-telegram

* [new] Add [`sendMediaGroup`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#sendmediagroupchatid-media--options---official-docs):

```js
client.sendMediaGroup(CHAT_ID, [
  { type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' },
]);
```

[Telegram Bot API 3.5](https://core.telegram.org/bots/api#november-17-2017)

# 0.6.0 / 2017-12-07

* [new] Support WeChat! 🎉🎉🎉

<img src="https://user-images.githubusercontent.com/3382565/33652361-1dc854c6-daa4-11e7-997e-e1dedd818881.jpg" alt="WeChat" width="100" />

* [breaking] Remove `client.getHTTPClient()` use `client.axios` instead [#236](https://github.com/Yoctol/messaging-apis/pull/236)

### messaging-api-messenger

* [breaking] Set default `is_reusable` to false when upload attachment [#221](https://github.com/Yoctol/messaging-apis/issues/221)
* [breaking] Remove messenger profile deprecated methods [#239](https://github.com/Yoctol/messaging-apis/pull/239)

```
getGetStartedButton -> getGetStarted
setGetStartedButton -> setGetStarted
deleteGetStartedButton -> deleteGetStarted
getGreetingText -> getGreeting
setGreetingText -> setGreeting
deleteGreetingText -> deleteGreeting
getDomainWhitelist -> getWhitelistedDomains
setDomainWhitelist -> setWhitelistedDomains
deleteDomainWhitelist -> deleteWhitelistedDomains
getChatExtensionHomeURL -> getHomeURL
setChatExtensionHomeURL -> setHomeURL
deleteChatExtensionHomeURL -> deleteHomeURL
```

### messaging-api-telegram

* [new] Add Inline mode API - `answerInlineQuery`:

```js
client.answerInlineQuery(
  'INLINE_QUERY_ID',
  [
    {
      type: 'photo',
      id: 'UNIQUE_ID',
      photo_file_id: 'FILE_ID',
      title: 'PHOTO_TITLE',
    },
    {
      type: 'audio',
      id: 'UNIQUE_ID',
      audio_file_id: 'FILE_ID',
      caption: 'AUDIO_TITLE',
    },
  ],
  {
    cache_time: 1000,
  }
);
```

# 0.5.16 / 2017-12-05

* [new] Add `client.accessToken` getter

  # 0.5.15 / 2017-12-04

  ### messaging-api-slack

* [new] Support pass message object to `postMessage`:

```js
client.postMessage('C8763', { text: 'Hello!' });
client.postMessage('C8763', { attachments: [someAttachments] });
client.postMessage('C8763', { text: 'Hello!' }, { as_user: true });
```

# 0.5.14 / 2017-11-29

### messaging-api-messenger

* [new] Support call api methods with custom `access_token` (Experimental)

  # 0.5.13 / 2017-11-28

  ### messaging-api-messenger

* [fix] Fixed `uploadAttachment` with buffer data using a `filename` option pass in:

```js
client.uploadAttachment('image', buffer, { filename: 'image.jpg' });
```

# 0.5.12 / 2017-11-23

### messaging-api-messenger

* [new] Support pass `options.quick_replies` to send message with quick replies: [#216](https://github.com/Yoctol/messaging-apis/issues/216)

```js
client.sendText(USER_ID, 'Pick a color:', {
  quick_replies: [
    {
      content_type: 'text',
      title: 'Red',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
    },
  ],
});
```

* [new] Support upload attachment from buffer or stream [#219](https://github.com/Yoctol/messaging-apis/issues/219)

For example:

```js
client.uploadImage(buffer);
client.uploadImage(fs.creatReadStream('xxx.jpg'));
```

* [docs] update docs and type for nlp config model [#222](https://github.com/Yoctol/messaging-apis/pull/222)

# 0.5.11 / 2017-11-22

### messaging-api-messenger

* [new] support `getPageInfo` to get page name and page id using Graph API. For example:

```js
client.getPageInfo().then(page => {
  console.log(page);
  // {
  //   name: 'Bot Demo',
  //   id: '1895382890692546',
  // }
});
```

# 0.5.10 / 2017-11-21

### messaging-api-slack

* [new] auto stringify `options.attachments` in Slack `postMessage` [#208](https://github.com/Yoctol/messaging-apis/pull/208)

  # 0.5.9 / 2017-11-15

  ### messaging-api-messenger

* [fix] make NLP config model value match Facebook API [#207](https://github.com/Yoctol/messaging-apis/pull/207)

  # 0.5.8 / 2017-11-13

  ### messaging-api-messenger

* [fix] make sure `options.messaging_type` works for all send apis [#205](https://github.com/Yoctol/messaging-apis/pull/205)

  # 0.5.7 / 2017-11-09

  A large update to support [Messenger Platform 2.2](https://messenger.fb.com/blog/2-2-release/). 🎉

## Messaging Types

Messenger Team has created a `messaging_type` property which is required in all requests to the send API. You can send it with `messaging_type` option:

```js
client.sendText(USER_ID, 'Awesome!', { messaging_type: 'RESPONSE' });
```

Available messaging types:

* `UPDATE` as default
* `RESPONSE` using `{ messaging_type: 'RESPONSE' }` options
* `MESSAGE_TAG` using `{ tag: 'ANY_TAG' }` options
* `NON_PROMOTIONAL_SUBSCRIPTION` using `{ messaging_type: 'NON_PROMOTIONAL_SUBSCRIPTION' }` options

<br />

## New Message Tags

Two additional tags, `PAIRING_UPDATE` and `APPLICATION_UPDATE`, has been supported by passing as option:

```js
client.sendGenericTemplate(
  USER_ID,
  [
    {
      //...
    },
  ],
  { tag: 'PAIRING_UPDATE' }
);
client.sendGenericTemplate(
  USER_ID,
  [
    {
      //...
    },
  ],
  { tag: 'APPLICATION_UPDATE' }
);
```

<br />

## New Media Template - [docs](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-messenger/README.md#sendmediatemplateuserid-elements---official-docs)

In order to make image and video sharing more interactive, you can attach a CTA button to your media:

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

## Broadcast - [docs](https://github.com/Yoctol/messaging-apis/blob/master/packages/messaging-api-messenger/README.md#broadcast-api)

### Create Message by createMessageCreative

To use the broadcast API, you must create messages using `createMessageCreative`:

```js
client
  .createMessageCreative([
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Welcome to Our Marketplace!',
              image_url: 'https://www.facebook.com/jaspers.png',
              subtitle: 'Fresh fruits and vegetables. Yum.',
              buttons: [
                {
                  type: 'web_url',
                  url: 'https://www.jaspersmarket.com',
                  title: 'View Website',
                },
              ],
            },
          ],
        },
      },
    },
  ])
  .then(({ message_creative_id }) => {
    // ...
  });
```

### Sending Broadcast or Sponsored Messages

After you got a `message_creative_id`, you can send it as broadcast messages:

```js
client.sendBroadcastMessage(message_creative_id);
```

Or sponsored messages:

```js
client.sendSponsoredMessage(message_creative_id, {
  message_creative_id: 938461089,
  daily_budget: 100,
  bid_amount: 400,
  targeting: "{'geo_locations': {'countries':['US']}}",
});
```

### Targeting Broadcast Messages - [docs](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#targeting-broadcast-messages---official-docs)

You can manage your users with associated labels using following methods:

* [`createLabel(name)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#createlabelname)
* [`associateLabel(userId, labelId)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#associatelabeluserid-labelid)
* [`dissociateLabel(userId, labelId)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#dissociatelabeluserid-labelid)
* [`getAssociatedLabels(userId)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getassociatedlabelsuserid)
* [`getLabelDetails(labelId, options)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getlabeldetailslabelid-options)
* [`getLabelList()`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getlabellist)
* [`deleteLabel(labelId)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#deletelabellabelid)

And send broadcast messages to only associated users:

```js
client.sendBroadcastMessage(message_creative_id, { custom_label_id: LABEL_ID });
```

### Estimating Broadcast Size - [docs](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#estimating-broadcast-size)

To get the approximate number of people a broadcast message will be sent, you can use Estimating API:

* startReachEstimation(customLabelId)
* getReachEstimate(reachEstimationId)

> Note: Due to the fact that reach estimation is a resource intensive process, it is executed in two steps.

<br />

## More Configuration for Built-in NLP - [docs](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#built-in-nlp-api)

We have more parameters are supported now:

```js
client.setNLPConfigs({
  nlp_enabled: true,
  model: 'custom',
  custom_token: 'your_token',
  verbose: true,
  n_best: 8,
});
```

<br />

## New Insights APIs

There are a bunch of insights APIs introduced in this version:

* [`getInsights(metrics, options)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getinsightsmetrics-options)
* [`getBlockedConversations`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getblockedconversations)
* [`getReportedConversations`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getreportedconversations)
* [`getReportedConversationsByReportType`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getreportedconversationsbyreporttype)
* [`getBroadcastMessagesSent`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#getbroadcastmessagessentbroadcastid)

> Note: `getDailyUniqueConversationCounts` is deprecated.

<br />

## Custom Event Logging - [docs](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#event-logging-api)

Log custom events by using the [Application Activities Graph API](https://developers.facebook.com/docs/graph-api/reference/application/activities/) endpoint.

```js
client.logCustomEvents({
  appId: APP_ID,
  pageId: PAGE_ID,
  userId: USER_ID,
  events: [
    {
      _eventName: 'fb_mobile_purchase',
      _valueToSum: 55.22,
      _fb_currency: 'USD',
    },
  ],
});
```

<br />

## Related Issue & PR

Support messenger platform 2.2 - [#186](https://github.com/Yoctol/messaging-apis/issues/186)

See more details in [Messenger official release post](https://messenger.fb.com/blog/2-2-release/) and [changelog](https://developers.facebook.com/docs/messenger-platform/changelog#november-7--2017).

# 0.5.6 / 2017-11-07

### messaging-api-slack

* [new] Support Slack conversations APIs [#185](https://github.com/Yoctol/messaging-apis/pull/185/files)

  * getConversationInfo
  * getConversationMembers
  * getAllConversationMembers
  * getConversationList
  * getAllConversationList

  # 0.5.5 / 2017-11-01

  ### messaging-api-messenger

* [new] Added [`passThreadControlToPageInbox`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-messenger#handover-protocol-api) method:

```js
client.passThreadControlToPageInbox(USER_ID);
```

is equivalent to

```js
client.passThreadControl(USER_ID, 263902037430900);
```

See more details in [Messenger docs](https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control#page_inbox).

# 0.5.4 / 2017-10-30

### messaging-api-line

* [new] Introducing new Rich Menu APIs!
  * [getRichMenuList](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#getrichmenulist)
  * [getRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#getrichmenurichmenuid)
  * [createRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#createrichmenurichmenu)
  * [deleteRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#deleterichmenurichmenuid)
  * [getLinkedRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#getlinkedrichmenuuserid)
  * [linkRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#linkrichmenuuserid-richmenuid)
  * [unlinkRichMenu](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#unlinkrichmenuuserid)
  * [downloadRichMenuImage](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#downloadrichmenuimagerichmenuid)
  * [uploadRichMenuImage](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-line#uploadrichmenuimagerichmenuid-buffer)

See more details in [LINE Official docs](https://developers.line.me/en/docs/messaging-api/reference/#rich-menu).

# 0.5.3 / 2017-10-26

### messaging-api-messenger

* [fix] return null when no any messenger profile setting exists [#176](https://github.com/Yoctol/messaging-apis/issues/176)

  # 0.5.2 / 2017-10-26

* [deps] Upgrade `axios` to `v0.17.0`.

  # 0.5.1 / 2017-10-25

  ### messaging-api-messenger

* [renamed] Following profile methods has been renamed to match api key:
  * `getGetStartedButton` -> `getGetStarted`
  * `setGetStartedButton` -> `setGetStarted`
  * `deleteGetStartedButton` -> `deleteGetStarted`
  * `getGreetingText` -> `getGreeting`
  * `setGreetingText` -> `setGreeting`
  * `deleteGreetingText` -> `deleteGreeting`
  * `getChatExtensionHomeURL` -> `getHomeURL`
  * `setChatExtensionHomeURL` -> `setHomeURL`
  * `deleteChatExtensionHomeURL` -> `deleteHomeURL`

The deprecated methods will be removed after `v0.6.0`.

# 0.5.0 / 2017-10-20

* [new] A big improvement on error message.

For example, when you catch the error and log it out:

```js
client.sendText().catch(console.error);
```

You can get some useful information to help you resolve the issue.

```
Error: Messenger API - 2500 OAuthException An active access token must be used to query information about the current user.
    at handleError (/Users/chentsulin/Projects/yoctol/ttt/node_modules/messaging-api-messenger/lib/MessengerClient.js:64:9)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)

Error Message -
  Messenger API - 2500 OAuthException An active access token must be used to query information about the current user.

Request -
  POST https://graph.facebook.com/v2.10/me/messages?access_token=

Request Data -
  {
    "recipient": {
      "id": ""
    },
    "message": {
      "text": ""
    }
  }

Response -
  400 Bad Request

Response Data -
  {
    "error": {
      "message": "An active access token must be used to query information about the current user.",
      "type": "OAuthException",
      "code": 2500,
      "fbtrace_id": "GOnNuiN/ewZ"
    }
  }
```

The error messages are powered by [axios-error](https://github.com/Yoctol/messaging-apis/tree/master/packages/axios-error) package.

* [deprecated] `client.getHTTPClient()` method is deprecated. use `client.axios` getter instead.

### messaging-api-messenger

* [breaking] `client.version` now return version number string (`2.10`) instead of the v-prefix version (`v2.10`).

  # 0.4.7 / 2017-10-16

  ### messaging-api-viber

* [fix] Always throw error when status != 0 in api response body.

  # 0.4.6 / 2017-10-15

  ### messaging-api-telegram

* [new] Support methods introduced in Telegram 3.4
  * [editMessageLiveLocation](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#editmessagelivelocationlocation--options---official-docs)
  * [stopMessageLiveLocation](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#stopmessagelivelocationoptions---official-docs)
  * [setChatStickerSet](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#setchatstickersetchatid-stickersetname---official-docs)
  * [deleteChatStickerSet](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#deletechatstickersetchatid---official-docs)

See more details in [Telegram October 11, 2017 changelog](https://core.telegram.org/bots/api#october-11-2017).

# 0.4.5 / 2017-10-12

### messaging-api-viber

* [new] implement getAccountInfo, getUserDetails, getOnlineStatus:

  * [`getAccountInfo`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-viber#getaccountinfo)
  * [`getUserDetails(id)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-viber#getuserdetailsid)
  * [`getOnlineStatus(ids)`](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-viber#getonlinestatusids)

  # 0.4.4 / 2017-10-11

  ### messaging-api-messenger

* [renamed] `getDomainWhitelist` -> `getWhitelistedDomains`
* [renamed] `setDomainWhitelist` -> `setWhitelistedDomains`
* [renamed] `deleteDomainWhitelist` -> `deleteWhitelistedDomains`

### messaging-api-viber

* [new] First release of [Viber](https://www.viber.com/) API Support!

  # 0.4.3 / 2017-09-28

  ### messaging-api-line

* [new] Added a [LINE Bot example](https://github.com/Yoctol/messaging-apis/tree/master/examples/line). Thanks @madeinfree!

### messaging-api-telegram

* [new] Gets [Payments API](https://github.com/Yoctol/messaging-apis/tree/master/packages/messaging-api-telegram#payments-api) support! 🎉

  * `sendInvoice`
  * `answerShippingQuery`
  * `answerPreCheckoutQuery`

  # 0.4.2 / 2017-09-22

  ### messaging-api-messenger

* [new] Export version of Graph API:

```js
const { MessengerClient } = require('messaging-api-messenger');

const client = MessengerClient.connect(accessToken);

client.version; // "v2.10"
```

# 0.4.1 / 2017-09-19

### messaging-api-line

* [fix] Wrong case in filename.

  # 0.4.0 / 2017-09-19

  ### messaging-api-messenger

* [breaking] Renamed `send` to `sendMessage`

### messaging-api-line

* [breaking] Renamed all of `LINE` to PascalCase `Line` (follow convention from other modules), e.g. `LineClient.connect`, `Line.createText`.

Example:

```js
const { Line, LineClient } = require('messaging-api-line');
```

# 0.3.5 / 2017-09-15

### messaging-api-messenger

* [docs] Fix a typo.

### messaging-api-line

* [new] Support message factories:
  * LINE.createText
  * LINE.createImage
  * LINE.createVideo
  * createAudio
  * createLocation
  * createSticker
  * createImagemap
  * createTemplate
  * createButtonTemplate
  * createConfirmTemplate
  * createCarouselTemplate
  * createImageCarouselTemplate

For example:

```js
const { LINE } = require('messaging-api-line');

client.reply(REPLY_TOKEN, [
  LINE.createText('Hello'),
  LINE.createImage(
    'https://example.com/original.jpg',
    'https://example.com/preview.jpg'
  ),
  LINE.createText('End'),
]);
```

# 0.3.4 / 2017-09-13

* [docs] Show method arguments in tables.

### messaging-api-messenger

* [new] Support message batching via `sendBatch`:

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

# 0.3.3 / 2017-09-07

* publish docs changes to npm.

  # 0.3.2 / 2017-09-05

  ### messaging-api-line

* [new] Support ImageCarouselTemplate methods

  * replyImageCarouselTemplate
  * pushImageCarouselTemplate
  * multicaseImageCarouselTemplate

  # 0.3.1 / 2017-08-31

  ### messaging-api-messenger

* [new] using `AttachmentPayload` to send cached attachment:

```js
client.sendImage(USER_ID, { attachment_id: '55688' });
client.sendAudio(USER_ID, { attachment_id: '55688' });
client.sendVideo(USER_ID, { attachment_id: '55688' });
client.sendFile(USER_ID, { attachment_id: '55688' });
```

# 0.3.0 / 2017-08-29

* [docs] A big improvement.

### messaging-api-messenger

* [breaking] Renamed messenger typing methods:

```
turnTypingIndicatorsOn => typingOn
turnTypingIndicatorsOff => typingOff
```

* [breaking] Removed tagged template methods:
  * sendTaggedTemplate
  * sendShippingUpdateTemplate
  * sendReservationUpdateTemplate
  * sendIssueResolutionTemplate
  * sendAppointmentUpdateTemplate
  * sendGameEventTemplate
  * sendTransportationUpdateTemplate
  * sendFeatureFunctionalityUpdateTemplate
  * sendTicketUpdateTemplate

Use `tag` option instead:

```js
client.sendText(USER_ID, 'Hello!', { tag: 'ISSUE_RESOLUTION' });

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

* [breaking] Renamed `topElementStyle` to `options.top_element_style` in `sendListTemplate` [@6840ec7](https://github.com/Yoctol/messaging-apis/commit/6840ec7094be6c0f6c0a9d995b3756b86f4f5f17)
* [breaking] Renamed `ratio` to `options.image_aspect_ratio` in `sendGenericTemplate` [@701e717](https://github.com/Yoctol/messaging-apis/commit/701e717abe8b8f1de63d5c3f9c49e601fc9cacc0)

### messaging-api-slack

* [breaking] Removed `SlackClient` export, using `SlackOAuthClient` or `SlackWebhookClient` instead.
* [breaking] `getUserList` now returns object includes cursor.

### messaging-api-telegram

* [breaking] Changed `contact.firstName` to `contact.first_name`, and `contact.phoneNumber` to `contact.phone_number` in `sendContact` method.

  # 0.2.8 / 2017-08-25

  ### messaging-api-messenger

* [new] Support `mark_seen` sender action:

```js
client.markSeen(USER_ID);
```

# 0.2.7 / 2017-08-17

### messaging-api-telegram

* [new] Implement supergroup or channel methods
  * `kickChatMember`
  * `unbanChatMember`
  * `restrictChatMember`
  * `promoteChatMember`
  * `exportChatInviteLink`
  * `setChatPhoto`
  * `deleteChatPhoto`
  * `setChatTitle`
  * `setChatDescription`
  * `pinChatMessage`
  * `unpinChatMessage`
  * `leaveChat`

# 0.2.6 / 2017-08-14

### messaging-api-messenger

* [new] Support calling send API with recipient object:

```js
client.sendText(
  {
    phone_number: '+1(212)555-2368',
    name: { first_name: 'John', last_name: 'Doe' },
  },
  'Hello World'
);
```

* [new] Support send media (sendAudio、sendImage、sendVideo、sendFile) using `Buffer` or `ReadStream`:

```js
client.sendImage(USER_ID, buffer);
client.sendFile(USER_ID, fs.createReadStream('LookGreatToMe.pdf'));
```

### messaging-api-slack

* [docs] Added Slack OAuth API document

  # 0.2.5 / 2017-08-09

  ### messaging-api-messenger

* [new] Implement Page Messaging Insights API
* [new] Implement Built-in NLP API

### messaging-api-slack

* [new] Slack OAuth Client

  # 0.2.4 / 2017-08-02

* [docs] A big improvement.
* [docs] prettify code examples with prettier

### messaging-api-messenger

* [new] Chat Extension Home URL API
* [new] Messenger Code API
* [new] Handover Protocol APIs
* [new] add 5 new tagged templates
* [deps] upgrade default graph api version to `v2.10`

### messaging-api-line

* [new] LINE Group/Room Member API

  # 0.2.3 / 2017-07-13

  ### messaging-api-telegram

* [new] Add optional parameters to telegram api [#47](https://github.com/Yoctol/messaging-apis/pull/47).
* [new] Implement get methods
  * `getUserProfilePhotos`
  * `getFile`
  * `getChat`
  * `getChatAdministrators`
  * `getChatMembersCount`
  * `getChatMember`
* [new] Implement updating methods
  * `editMessageText`
  * `editMessageCaption`
  * `editMessageReplyMarkup`
  * `deleteMessage`
* [new] `forwardMessage` method

# 0.2.2 / 2017-07-11

* [deps] Update `lerna` to `v2.0.0`.

### messaging-api-messenger

* [new] Support send open graph template with `MessengerClient.sendOpenGraphTemplate`.

### messaging-api-telegram

* [new] First release.

# 0.2.1 / 2017-07-06

* [new] Add `engines` in `package.json` [#38](https://github.com/Yoctol/messaging-apis/pull/38).
* [new] Setup test coverage report using `codecov` .

### messaging-api-messenger

* [fix] Fix wrong checking rules in `sendQuickReplies` methods.

### messaging-api-line

* [fix] `retrieveMessageContent` should return `Promise<Buffer>`.

### messaging-api-slack

* [new] First release.

# 0.2.0 / 2017-06-29

* [docs] rewrite new docs for Messenger & LINE
* [breaking] APIs now return detail data and not just an `axios` response.
* [breaking] rename `factory` to `connect`

### messaging-api-messenger

* [new] support use specified graph api version
* [new] support menu locale
* [new] support greeting locale
* [breaking] rename `inputDisabled` to `composerInputDisabled`

### messaging-api-line

* [new] support more `reply` methods and `multicast` methods
