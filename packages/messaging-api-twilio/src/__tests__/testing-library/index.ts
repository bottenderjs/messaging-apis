import qs from 'qs';
import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { SnakeCasedPropertiesDeep } from 'type-fest';
import { addSeconds } from 'date-fns';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

import * as TwilioTypes from '../../TwilioTypes';

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
  ACCOUNT_SID: 'ACCOUNT_SID',
  AUTH_TOKEN: 'AUTH_TOKEN',
};

/**
 * Sets up a mock Twilio server.
 *
 * @returns MSW setup server API.
 */
export function setupTwilioServer(): SetupServerApi {
  const server = setupServer(
    rest.post<string>(
      `https://api.twilio.com/2010-04-01/Accounts/${constants.ACCOUNT_SID}/Messages.json`,
      (req, res, ctx) => {
        currentContext.request = req;

        if (
          req.url.username !== constants.ACCOUNT_SID ||
          req.url.password !== constants.AUTH_TOKEN
        ) {
          return res(ctx.status(403));
        }

        const data = camelcaseKeysDeep(
          qs.parse(
            req.body
          ) as unknown as SnakeCasedPropertiesDeep<TwilioTypes.MessageListInstanceCreateOptions>
        );
        const sid = 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
        const messagingServiceSid =
          data.messagingServiceSid ?? 'MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

        const dateCreated = new Date();
        const dateUpdated = addSeconds(dateCreated, 2);

        return res(
          ctx.json(
            snakecaseKeysDeep({
              accountSid: constants.ACCOUNT_SID,
              apiVersion: '2010-04-01',
              body: data.body,
              dateCreated: dateCreated.toUTCString().replace('GMT', '+0000'),
              dateSent: dateUpdated.toUTCString().replace('GMT', '+0000'),
              dateUpdated: dateUpdated.toUTCString().replace('GMT', '+0000'),
              direction: 'outbound-api',
              errorCode: null,
              errorMessage: null,
              from: data.from,
              messagingServiceSid,
              numMedia: '0',
              numSegments: '1',
              price: null,
              priceUnit: null,
              sid,
              status: 'sent',
              subresourceUris: {
                media: `/2010-04-01/Accounts/${constants.ACCOUNT_SID}/Messages/${sid}/Media.json`,
              },
              to: data.to,
              uri: `/2010-04-01/Accounts/${constants.ACCOUNT_SID}/Messages/${sid}.json`,
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
