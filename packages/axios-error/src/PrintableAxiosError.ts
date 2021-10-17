import util from 'util';

import { AxiosError } from 'axios';
import { JsonValue } from 'type-fest';

function indent(str: string): string {
  return str
    .split('\n')
    .map((s) => (s ? `  ${s}` : ''))
    .join('\n');
}

function json(data: JsonValue): string {
  return JSON.stringify(data, null, 2);
}

export default class PrintableAxiosError extends Error {
  /**
   * The config object of the error request.
   */
  public readonly config: AxiosError['config'];

  /**
   * The request object of the error request.
   */
  public readonly request?: AxiosError['request'];

  /**
   * The response object of the error request.
   */
  public readonly response?: AxiosError['response'];

  /**
   * The response status of the error request.
   */
  public readonly status?: number;

  /**
   * @example
   * ```js
   * new AxiosError(errorThrownByAxios)
   * ```
   */
  constructor(error: AxiosError);

  /**
   * @example
   * ```js
   * new AxiosError('error message', errorThrownByAxios)
   * ```
   */
  constructor(message: string, error: AxiosError);

  /**
   * @example
   * ```js
   * new AxiosError('error message', { config, request, response })
   * ```
   */
  constructor(
    message: string,
    error: Pick<AxiosError, 'config' | 'request' | 'response'>
  );

  constructor(
    messageOrError: string | AxiosError,
    error?: AxiosError | Pick<AxiosError, 'config' | 'request' | 'response'>
  ) {
    let err: Pick<AxiosError, 'config' | 'request' | 'response'>;
    let message: string;
    if (typeof messageOrError === 'string') {
      message = messageOrError;
      err = error as Pick<AxiosError, 'config' | 'request' | 'response'>;
    } else {
      message = messageOrError.message;
      err = messageOrError;
    }

    super(message);

    const { config, request, response } = err;

    this.config = config;
    this.request = request;
    this.response = response;
    if (response && response.status) {
      this.status = response.status;
    }

    this.name = 'PrintableAxiosError';
  }

  [util.inspect.custom](): string {
    let requestMessage = '';

    if (this.config) {
      let { data } = this.config;

      try {
        data = JSON.parse(data);
      } catch (_) {} // eslint-disable-line

      let requestData = '';

      if (this.config.data) {
        requestData = `
Request Data -
${indent(json(data))}`;
      }

      requestMessage = `
Request -
  ${this.config.method ? this.config.method.toUpperCase() : ''} ${
        this.config.url
      }
${requestData}`;
    }

    let responseMessage = '';

    if (this.response) {
      let responseData;

      if (this.response.data) {
        responseData = `
Response Data -
${indent(json(this.response.data))}`;
      }

      responseMessage = `
Response -
  ${this.response.status} ${this.response.statusText}
${responseData}`;
    }

    return `
${this.stack}

Error Message -
  ${this.message}
${requestMessage}
${responseMessage}
`;
  }
}
