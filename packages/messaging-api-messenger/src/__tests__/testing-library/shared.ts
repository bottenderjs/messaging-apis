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
  APP_SECRET: 'APP_SECRET',
  USER_ID: 'USER_ID',
};
