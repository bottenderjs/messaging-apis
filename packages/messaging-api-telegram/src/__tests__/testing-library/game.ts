import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants, getCurrentContext } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendGame`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 66,
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
              game: {
                title: 'Mario Bros.',
                description: 'Mario Bros. is fun!',
                photo: [
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
                    fileSize: 14650,
                    width: 160,
                    height: 160,
                  },
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
                    fileSize: 39019,
                    width: 320,
                    height: 320,
                  },
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
                    fileSize: 132470,
                    width: 640,
                    height: 640,
                  },
                ],
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setGameScore`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 66,
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
              game: {
                title: 'Mario Bros.',
                description: 'Mario Bros. is fun!',
                photo: [
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
                    fileSize: 14650,
                    width: 160,
                    height: 160,
                  },
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
                    fileSize: 39019,
                    width: 320,
                    height: 320,
                  },
                  {
                    fileId:
                      'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
                    fileSize: 132470,
                    width: 640,
                    height: 640,
                  },
                ],
                text: 'User 427770117 score is 999.',
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getGameHighScores`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: [
              {
                position: 1,
                user: {
                  id: 427770117,
                  isBot: false,
                  firstName: 'first',
                },
                score: 999,
              },
            ],
          })
        )
      );
    }
  ),
];
