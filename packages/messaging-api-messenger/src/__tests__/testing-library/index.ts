import { RestRequest, rest } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';

import { getCurrentContext } from './shared';
import { requestHandlers as handoverRequestHandlers } from './handover';
import { requestHandlers as identityRequestHandlers } from './identity';
import { requestHandlers as insightsRequestHandlers } from './insights';
import { requestHandlers as messageRequestHandlers } from './message';
import { requestHandlers as nlpRequestHandlers } from './nlp';
import { requestHandlers as personaRequestHandlers } from './persona';
import { requestHandlers as profileRequestHandlers } from './profile';
import { requestHandlers as subscriptionRequestHandlers } from './subscription';

/**
 * Sets up a mock Messenger server.
 *
 * @returns MSW setup server API.
 */
export function setupMessengerServer(): SetupServerApi {
  const server = setupServer(
    rest.get('https://graph.facebook.com/:version/me', (_req, res, ctx) => {
      return res(
        ctx.json({
          name: 'Bot Demo',
          id: '1895382890692546',
        })
      );
    }),
    rest.get(
      'https://graph.facebook.com/:version/debug_token',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: {
              app_id: '000000000000000',
              application: 'Social Cafe',
              expires_at: 1352419328,
              is_valid: true,
              issued_at: 1347235328,
              scopes: ['email', 'user_location'],
              user_id: 1207059,
            },
          })
        );
      }
    ),
    rest.get(
      'https://graph.facebook.com/:version/me/messaging_feature_review',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [
              {
                feature: 'subscription_messaging',
                status: 'approved',
              },
            ],
          })
        );
      }
    ),
    ...messageRequestHandlers,
    ...handoverRequestHandlers,
    ...profileRequestHandlers,
    ...personaRequestHandlers,
    ...insightsRequestHandlers,
    ...nlpRequestHandlers,
    ...identityRequestHandlers,
    ...subscriptionRequestHandlers
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

    getCurrentContext().request = undefined;
  });

  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  server.events.on('request:start', (req) => {
    getCurrentContext().request = req as RestRequest;
  });

  return server;
}

export { constants, getCurrentContext } from './shared';
