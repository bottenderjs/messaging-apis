import { RestRequest } from 'msw';

export const constants = {
  ACCESS_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
};

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
