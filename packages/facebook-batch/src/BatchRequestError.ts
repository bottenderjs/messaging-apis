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
${JSON.stringify(this.request.body, null, 2) || ''}

Response -
${this.response.code}
${JSON.stringify(this.response.body, null, 2) || ''}
    `;
  }
}
