import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { snakecaseKeysDeep } from 'messaging-api-common';

import * as ViberTypes from '../../ViberTypes';

type Context = { request: RestRequest | undefined };

const currentContext: { request: RestRequest | undefined } = {
  request: undefined,
};

/**
 * Gets current HTTP request context.
 *
 * @returns current HTTP request context.
 */
export function getCurrentContext(): Context {
  return currentContext;
}

export const constants = {
  AUTH_TOKEN: '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9',
  SENDER: {
    name: 'John McClane',
    avatar: 'http://avatar.example.com',
  },
};

/**
 * Sets up a mock Viber server.
 *
 * @returns MSW setup server API.
 */
export function setupViberServer(): SetupServerApi {
  const server = setupServer(
    rest.post(
      'https://chatapi.viber.com/pa/get_account_info',
      (req, res, ctx) => {
        getCurrentContext().request = req;

        return res(
          ctx.json(
            snakecaseKeysDeep({
              status: 0,
              statusMessage: 'ok',
              id: 'pa:75346594275468546724',
              name: 'account name',
              uri: 'accountUri',
              icon: 'http://example.com',
              background: 'http://example.com',
              category: 'category',
              subcategory: 'sub category',
              location: {
                lon: 0.1,
                lat: 0.2,
              },
              country: 'UK',
              webhook: 'https://my.site.com',
              eventTypes: ['delivered', 'seen'],
              subscribersCount: 35,
              members: [
                {
                  id: '01234567890A=',
                  name: 'my name',
                  avatar: 'http://example.com',
                  role: 'admin',
                },
              ],
            })
          )
        );
      }
    ),
    rest.post<{ id: string }>(
      'https://chatapi.viber.com/pa/get_user_details',
      (req, res, ctx) => {
        getCurrentContext().request = req;

        return res(
          ctx.json(
            snakecaseKeysDeep({
              status: 0,
              statusMessage: 'ok',
              messageToken: 4912661846655238145,
              user: {
                id: req.body.id,
                name: 'John McClane',
                avatar: 'http://avatar.example.com',
                country: 'UK',
                language: 'en',
                primaryDeviceOs: 'android 7.1',
                apiVersion: 1,
                viberVersion: '6.5.0',
                mcc: 1,
                mnc: 1,
                deviceType: 'iPhone9,4',
              },
            })
          )
        );
      }
    ),
    rest.post<{ ids: string[] }>(
      'https://chatapi.viber.com/pa/get_online',
      (req, res, ctx) => {
        getCurrentContext().request = req;

        const users = req.body.ids.map((id, i) => {
          switch (i % 3) {
            case 2:
              return { id, onlineStatus: 3, onlineStatusMessage: 'tryLater' };
            case 1:
              return {
                id,
                onlineStatus: 1,
                onlineStatusMessage: 'offline',
                lastOnline: 1457764197627,
              };
            case 0:
            default:
              return { id, onlineStatus: 0, onlineStatusMessage: 'online' };
          }
        });

        return res(
          ctx.json(
            snakecaseKeysDeep({
              status: 0,
              statusMessage: 'ok',
              users,
            })
          )
        );
      }
    ),
    rest.post<{ url: string; event_types: ViberTypes.EventType[] }>(
      'https://chatapi.viber.com/pa/set_webhook',
      (req, res, ctx) => {
        getCurrentContext().request = req;

        if (req.body.url === '') {
          return res(
            ctx.json(
              snakecaseKeysDeep({
                status: 0,
                statusMessage: 'ok',
              })
            )
          );
        }

        return res(
          ctx.json(
            snakecaseKeysDeep({
              status: 0,
              statusMessage: 'ok',
              eventTypes: req.body.event_types ?? [
                'delivered',
                'seen',
                'failed',
                'subscribed',
                'unsubscribed',
                'conversation_started',
              ],
            })
          )
        );
      }
    ),
    rest.post('https://chatapi.viber.com/pa/send_message', (req, res, ctx) => {
      getCurrentContext().request = req;

      return res(
        ctx.json(
          snakecaseKeysDeep({
            status: 0,
            statusMessage: 'ok',
            messageToken: 5098034272017990000,
          })
        )
      );
    }),
    rest.post(
      'https://chatapi.viber.com/pa/broadcast_message',
      (req, res, ctx) => {
        getCurrentContext().request = req;

        return res(
          ctx.json(
            snakecaseKeysDeep({
              status: 0,
              statusMessage: 'ok',
              messageToken: 5098034272017990000,
            })
          )
        );
      }
    )
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

    currentContext.request = undefined;
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  return server;
}
