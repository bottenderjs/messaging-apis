import { DefaultRequestBody, RestRequest } from 'msw';

type Context<T = DefaultRequestBody> = { request: RestRequest<T> | undefined };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentContext: { request: RestRequest<any> | undefined } = {
  request: undefined,
};

/**
 * Gets current HTTP request context.
 *
 * @returns current HTTP request context.
 */
export function getCurrentContext<T = DefaultRequestBody>(): Context<T> {
  return currentContext;
}

export const constants = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  CHANNEL_SECRET: 'CHANNEL_SECRET',
  REPLY_TOKEN: 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA',
  MESSAGE_ID: '1234567890',
  USER_ID: 'U00000000000000000000000000000000',
  GROUP_ID: 'G00000000000000000000000000000000',
  ROOM_ID: 'R00000000000000000000000000000000',
  AUDIENCE_GROUP_ID: 1234567890123,
  CONTINUATION_TOKEN: 'jxEWCEEP...',
};
