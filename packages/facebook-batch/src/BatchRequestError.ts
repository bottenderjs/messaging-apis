import { BatchRequest, BatchRequestErrorInfo, BatchResponse } from './types';
import { getErrorMessage } from './utils';

export default class BatchRequestError extends Error {
  /**
   * The request of the batch error.
   */
  readonly request: BatchRequest;

  /**
   * The response of the batch error.
   */
  readonly response: BatchResponse;

  /**
   * @example
   * ```js
   * new BatchRequestError({
   *   request: {
   *     method: 'POST',
   *     relativeUrl: 'me/messages',
   *     body: {
   *       messagingType: 'UPDATE',
   *       recipient: 'PSID',
   *       message: { text: 'Hello World' },
   *     },
   *   },
   *   response: {
   *     code: 403,
   *     body: {
   *       error: {
   *         type: 'OAuthException',
   *         message: 'Invalid parameter',
   *         code: 100,
   *       },
   *     }
   *   },
   * })
   * ```
   */
  constructor({ request, response }: BatchRequestErrorInfo) {
    const message = getErrorMessage({ request, response });

    super(`Batch Request Error - ${message}`);

    this.request = request;
    this.response = response;
  }

  inspect(): string {
    return `
Error Message - Batch Request Error

Request -

${this.request.method.toUpperCase()} ${this.request.relativeUrl}
${JSON.stringify(this.request.body, null, 2) || ''}

Response -
${this.response.code}
${JSON.stringify(this.response.body, null, 2) || ''}
    `;
  }
}
