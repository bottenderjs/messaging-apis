import util from 'util';

import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError as BaseAxiosError,
} from 'axios';

function indent(str: string): string {
  return str
    .split('\n')
    .map(s => (s ? `  ${s}` : ''))
    .join('\n');
}

function json(data: Record<string, any>): string {
  return JSON.stringify(data, null, 2);
}

class AxiosError extends Error {
  config: AxiosRequestConfig;

  request?: any;

  response?: AxiosResponse;

  status?: number;

  constructor(messageOrErr: any, _err: any = {}) {
    let err;
    if (messageOrErr instanceof Error) {
      super(messageOrErr.message);
      err = messageOrErr;
    } else {
      super(messageOrErr);
      err = _err;
    }
    const { config, request, response } = err as BaseAxiosError;

    this.config = config;
    this.request = request;
    this.response = response;
    if (response && response.status) {
      this.status = response.status;
    }

    this.name = 'AxiosError';
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

export = AxiosError;
