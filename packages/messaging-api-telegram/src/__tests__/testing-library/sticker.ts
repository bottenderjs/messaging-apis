import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/sendSticker`,
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
              sticker: {
                width: 362,
                height: 512,
                emoji: '✊',
                thumb: {
                  fileId: 'AAQFABOt1bEyAASi4MvOBXP2MYs8AQABAg',
                  fileSize: 2142,
                  width: 63,
                  height: 90,
                },
                fileId: 'CAADBQADQAADyIsGAAE7MpzFPFQX5QI',
                fileSize: 36326,
              },
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getStickerSet`,
    (_req, res, ctx) => {
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              name: 'sticker set name',
              title: 'sticker set title',
              isAnimated: false,
              containsMasks: false,
              stickers: [
                {
                  width: 512,
                  height: 512,
                  emoji: '💛',
                  setName: 'sticker set name',
                  isAnimated: false,
                  thumb: {
                    fileId:
                      'AAQEAANDAQACEDVoAAFVA7aGNPt1If3eYTAABAEAB20AAzkOAAIWB',
                    fileSize: 5706,
                    width: 128,
                    height: 128,
                  },
                  fileId: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
                  fileSize: 36424,
                },
              ],
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/createNewStickerSet`,
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
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/addStickerToSet`,
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
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setStickerPositionInSet`,
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
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/deleteStickerFromSet`,
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
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setStickerSetThumb`,
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
