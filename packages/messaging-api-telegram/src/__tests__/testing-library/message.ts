import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants, getCurrentContext } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendMessage`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 1,
              from: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              chat: {
                id: 427770117,
                firstName: 'first',
                lastName: 'last',
                type: 'private',
              },
              date: 1499402829,
              text: 'hi',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/forwardMessage`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 1,
              from: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              chat: {
                id: 427770117,
                firstName: 'first',
                lastName: 'last',
                type: 'private',
              },
              date: 1499402829,
              forwardFrom: {
                id: 357830311,
                firstName: 'first_2',
                lastName: 'last_2',
                languageCode: 'zh-TW',
              },
              forwardDate: 1499849644,
              text: 'hi',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/copyMessage`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 5566,
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendPhoto`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 1,
              from: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              chat: {
                id: 427770117,
                firstName: 'first',
                lastName: 'last',
                type: 'private',
              },
              date: 1499403191,
              photo: [
                {
                  fileId:
                    'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAAEC',
                  fileSize: 1611,
                  width: 90,
                  height: 80,
                },
                {
                  fileId:
                    'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koDAAEC',
                  fileSize: 17218,
                  width: 320,
                  height: 285,
                },
                {
                  fileId:
                    'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDAAEC',
                  fileSize: 16209,
                  width: 374,
                  height: 333,
                },
              ],
              caption: 'gooooooodPhoto',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendAudio`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendDocument`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVideo`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendAnimation`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVoice`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVideoNote`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendMediaGroup`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendLocation`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/editMessageLiveLocation`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/stopMessageLiveLocation`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVenue`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendContact`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendPoll`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendDice`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendChatAction`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            //
          })
        )
      );
    }
  ),
];
