import { SetupServerApi, setupServer } from 'msw/node';
import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { requestHandlers as chatRequestHandlers } from './chat';
import { requestHandlers as commandRequestHandlers } from './command';
import { constants, getCurrentContext } from './shared';
import { requestHandlers as gameRequestHandlers } from './game';
import { requestHandlers as gettingUpdateRequestHandlers } from './gettingUpdate';
import { requestHandlers as messageRequestHandlers } from './message';
import { requestHandlers as paymentRequestHandlers } from './payment';
import { requestHandlers as stickerRequestHandlers } from './sticker';
import { requestHandlers as updatingMessageRequestHandlers } from './updatingMessage';

/**
 * Sets up a mock Telegram server.
 *
 * @returns MSW setup server API.
 */
export function setupTelegramServer(): SetupServerApi {
  const server = setupServer(
    ...gettingUpdateRequestHandlers,
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getMe`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json(
            snakecaseKeysDeep({
              ok: true,
              result: {
                id: 313534466,
                isBot: true,
                firstName: 'Bot',
                username: 'a_bot',
                canJoinGroups: true,
                canReadAllGroupMessages: true,
                supportsInlineQueries: true,
              },
            })
          )
        );
      }
    ),
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/logOut`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json({
            ok: true,
            result: true,
          })
        );
      }
    ),
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/close`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json({
            ok: true,
            result: true,
          })
        );
      }
    ),
    ...messageRequestHandlers,
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getUserProfilePhotos`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json(
            snakecaseKeysDeep({
              ok: true,
              result: {
                totalCount: 3,
                photos: [
                  [
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
                  [
                    {
                      fileId:
                        'AgABXQSPEUo4Gz8cZAeR-ouu7XBx93EeqRkABHahi76pN-aO0UoDO203',
                      fileSize: 14220,
                      width: 160,
                      height: 160,
                    },
                    {
                      fileId:
                        'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoDAT90',
                      fileSize: 35122,
                      width: 320,
                      height: 320,
                    },
                    {
                      fileId:
                        'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
                      fileSize: 106356,
                      width: 640,
                      height: 640,
                    },
                  ],
                ],
              },
            })
          )
        );
      }
    ),
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getFile`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.json(
            snakecaseKeysDeep({
              ok: true,
              result: {
                fileId:
                  'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
                fileSize: 106356,
                filePath: 'photos/1068230105874016297.jpg',
              },
            })
          )
        );
      }
    ),
    ...chatRequestHandlers,
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/answerCallbackQuery`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
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
    ...commandRequestHandlers,
    ...updatingMessageRequestHandlers,
    ...stickerRequestHandlers,
    rest.post(
      `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/answerInlineQuery`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
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
    ...paymentRequestHandlers,
    ...gameRequestHandlers
  );
  if (typeof beforeAll === 'function') {
    beforeAll(() => {
      // Establish requests interception layer before all tests.
      server.listen();
    });
  }

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  return server;
}

export { constants, getCurrentContext } from './shared';
