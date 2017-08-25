0.2.8 / 2017-08-25
==================
### messaging-api-messenger
- [new] Support `mark_seen` sender action:

```js
client.markSeen(USER_ID);
```

0.2.7 / 2017-08-17
==================
### messaging-api-telegram
- [new] Implement supergroup or channel methods
  + `kickChatMember`
  + `unbanChatMember`
  + `restrictChatMember`
  + `promoteChatMember`
  + `exportChatInviteLink`
  + `setChatPhoto`
  + `deleteChatPhoto`
  + `setChatTitle`
  + `setChatDescription`
  + `pinChatMessage`
  + `unpinChatMessage`
  + `leaveChat`


0.2.6 / 2017-08-14
==================
### messaging-api-messenger
- [new] Support calling send API with recipient object:

```js
client.sendText(
  {
    phone_number: '+1(212)555-2368',
    name: { first_name: 'John', last_name: 'Doe' },
  },
  'Hello World'
);
```

- [new] Support send media (sendAudio、sendImage、sendVideo、sendFile) using `Buffer` or `ReadStream`:

```js
client.sendImage(USER_ID, buffer);
client.sendFile(USER_ID, fs.createReadStream('LookGreatToMe.pdf'));
```

### messaging-api-slack
- [docs] Added Slack OAuth API document

0.2.5 / 2017-08-09
==================
### messaging-api-messenger
- [new] Implement Page Messaging Insights API
- [new] Implement Bulit-in NLP API

### messaging-api-slack
- [new] Slack OAuth Client

0.2.4 / 2017-08-02
==================
- [docs] A big improvement.
- [docs] prettify code examples with prettier

### messaging-api-messenger
- [new] Chat Extension Home URL API
- [new] Messenger Code API
- [new] Handover Protocol APIs
- [new] add 5 new tagged templates
- [deps] upgrade default graph api version to `v2.10`

### messaging-api-line
- [new] LINE Group/Room Member API

0.2.3 / 2017-07-13
==================
### messaging-api-telegram
- [new] Add optional parameters to telegram api [#47](https://github.com/Yoctol/messaging-apis/pull/47).
- [new] Implement get methods
  + `getUserProfilePhotos`
  + `getFile`
  + `getChat`
  + `getChatAdministrators`
  + `getChatMembersCount`
  + `getChatMember`
- [new] Implement updating methods
  + `editMessageText`
  + `editMessageCaption`
  + `editMessageReplyMarkup`
  + `deleteMessage`
- [new] `forwardMessage` method


0.2.2 / 2017-07-11
==================
- [deps] Update `lerna` to `v2.0.0`.

### messaging-api-messenger
- [new] Support send open graph template with `MessengerClient.sendOpenGraphTemplate`.

### messaging-api-telegram
- [new] First release.


0.2.1 / 2017-07-06
==================
- [new] Add `engines` in `package.json` [#38](https://github.com/Yoctol/messaging-apis/pull/38).
- [new] Setup test coverage report using `codecov` .

### messaging-api-messenger
- [fix] Fix wrong checking rules in `sendQuickReplies` methods.

### messaging-api-line
- [fix] `retrieveMessageContent` should return `Promise<Buffer>`.

### messaging-api-slack
- [new] First release.


0.2.0 / 2017-06-29
==================
- [docs] rewrite new docs for Messenger & LINE
- [breaking] APIs now return detail data and not just an `axios` response.
- [breaking] rename `factory` to `connect`

### messaging-api-messenger
- [new] support use specified graph api version
- [new] support menu locale
- [new] support greeting locale
- [breaking] rename `inputDisabled` to `composerInputDisabled`

### messaging-api-line
- [new] support more `reply` methods and `multicast` methods
