import { BatchRequest, BatchRequestErrorInfo, BatchResponse } from './types';
import { getErrorMessage } from './utils';

export default class BatchRequestError extends Error {
  request: BatchRequest;

  response: BatchResponse;

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
${this.request.body || ''}

Response -
${this.response.code}
${this.response.body || ''}
    `;
  }
}
