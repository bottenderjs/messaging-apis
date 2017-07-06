0.2.1 / 2017-07-06
==================
- [new] Add `engines` in `package.json` [#38](https://github.com/Yoctol/messaging-apis/pull/38).
- [new] Setup test coverage report using `codecov` .

#### messaging-api-messenger
- [fix] Fix wrong checking rules in `sendQuickReplies` methods.

#### messaging-api-line
- [fix] `retrieveMessageContent` should return `Promise<Buffer>`.

#### messaging-api-slack
- [new] First release.


0.2.0 / 2017-06-29
==================
- [docs] rewrite new docs for Messenger & LINE
- [breaking] APIs now return detail data and not just an `axios` response.
- [breaking] rename `factory` to `connect`

#### messaging-api-messenger
- [new] support use specified graph api version
- [new] support menu locale
- [new] support greeting locale
- [breaking] rename `inputDisabled` to `composerInputDisabled`

#### messaging-api-line
- [new] support more `reply` methods and `multicast` methods
