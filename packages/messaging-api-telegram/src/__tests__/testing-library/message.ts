import random from 'lodash/random';
import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import * as TelegramTypes from '../../TelegramTypes';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendMessage`,
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
              date: 1499403678,
              audio: {
                duration: 108,
                mimeType: 'audio/mpeg',
                title: 'Song_Title',
                performer: 'Song_Performer',
                fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
                fileSize: 1739320,
              },
              caption: 'gooooooodAudio',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendDocument`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              document: {
                fileName: 'ylDRTR05sy6M.gif.mp4',
                mimeType: 'video/mp4',
                thumb: {
                  fileId: 'AAQEABN0Rb0ZAARFFMCIr_zrhq9bAAIC',
                  fileSize: 1627,
                  width: 90,
                  height: 90,
                },
                fileId: 'CgADBAADO3wAAhUbZAer4xD-iB4NdgI',
                fileSize: 21301,
              },
              caption: 'gooooooodDocument',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVideo`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              document: {
                fileName: 'madora.mp4',
                mimeType: 'video/mp4',
                thumb: {
                  fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
                  fileSize: 2874,
                  width: 90,
                  height: 90,
                },
                fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
                fileSize: 40582,
              },
              caption: 'gooooooodVideo',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendAnimation`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              messageId: 3,
              from: {
                id: 902132548,
                isBot: true,
                firstName: 'first',
                username: 'a bot',
              },
              chat: {
                id: 164230890,
                firstName: 'first',
                username: 'a user',
                type: 'private',
              },
              date: 1569500899,
              animation: {
                fileName: 'giphy.gif.mp4',
                mimeType: 'video/mp4',
                duration: 10,
                width: 300,
                height: 226,
                thumb: {
                  fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
                  fileSize: 2249,
                  width: 90,
                  height: 67,
                },
                fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
                fileSize: 199519,
              },
              document: {
                fileName: 'giphy.gif.mp4',
                mimeType: 'video/mp4',
                thumb: {
                  fileId: 'AAQEAAMEAAMMhYVSt87EuoJutAZRhpoaAAQBAAdzAAO0EAACFgQ',
                  fileSize: 2249,
                  width: 90,
                  height: 67,
                },
                fileId: 'CgADBAADBAADDIWFUrfOxLqCbrQGFgQ',
                fileSize: 199519,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVoice`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              document: {
                fileName: '1.ogg',
                mimeType: 'audio/ogg',
                fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
                fileSize: 10870,
              },
              caption: 'gooooooodVoice',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVideoNote`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              document: {
                fileName: 'madora.mp4',
                mimeType: 'video/mp4',
                thumb: {
                  fileId: 'AAQEABM6g94ZAAQOG1S88OjS3BsBAAIC',
                  fileSize: 2874,
                  width: 90,
                  height: 90,
                },
                fileId: 'CgADBAADwJQAAogcZAdPTKP2PGMdhwI',
                fileSize: 40582,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendMediaGroup`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          // TODO: the real result related to _uest.
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
              date: 1499403678,
              photo: [
                {
                  fileId: 'BQADBAADApYAAgcZZAfj2-xeidueWwI',
                  width: 1000,
                  height: 1000,
                },
              ],
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendLocation`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              location: {
                latitude: 30.000005,
                longitude: 45,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/editMessageLiveLocation`,
    (_req, res, ctx) => {
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
              location: {
                latitude: 11,
                longitude: 22,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/stopMessageLiveLocation`,
    (_req, res, ctx) => {
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
              location: {
                latitude: 30.000005,
                longitude: 45,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendVenue`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              location: {
                latitude: 30.000005,
                longitude: 45,
              },
              venue: {
                location: {
                  latitude: 30.000005,
                  longitude: 45,
                },
                title: 'a_title',
                address: 'an_address',
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendContact`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              contact: {
                phoneNumber: '886123456789',
                firstName: 'first',
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendPoll`,
    (_req, res, ctx) => {
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
              date: 1499403678,
              poll: {
                id: '6095870087057637377',
                question: 'q',
                options: [
                  {
                    text: 'a',
                    voterCount: 0,
                  },
                  {
                    text: 'b',
                    voterCount: 0,
                  },
                  {
                    text: 'c',
                    voterCount: 0,
                  },
                ],
                isClosed: false,
              },
            },
          })
        )
      );
    }
  ),
  rest.post<{ emoji?: TelegramTypes.SendDiceOption['emoji'] }>(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendDice`,
    (req, res, ctx) => {
      const emoji = req.body.emoji ?? '🎲';

      const valueRange: { [key: string]: [from: number, to: number] } = {
        '🎲': [1, 6],
        '🎯': [1, 6],
        '🎳': [1, 6],
        '🏀': [1, 5],
        '⚽': [1, 5],
        '🎰': [1, 64],
      };

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
              date: 1499403678,
              dice: {
                emoji,
                value: random(...valueRange[emoji]),
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendChatAction`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
];
