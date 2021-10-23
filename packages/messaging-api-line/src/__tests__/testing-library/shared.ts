import { RestRequest } from 'msw';

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
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHANNEL_SECRET: 'CHANNEL_SECRET',
  REPLY_TOKEN: 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA',
  MESSAGE_ID: '1234567890',
  AUDIENCE_GROUP_ID: 1234567890123,
};
