import debug from 'debug';
import omit from 'lodash/omit';
import urlJoin from 'url-join';
import { AxiosRequestConfig, Method } from 'axios';

const debugRequest = debug('messaging-api:request');

export type RequestPayload = {
  method?: Method;
  url: string;
  headers: Record<string, string>;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type OnRequestFunction = (request: RequestPayload) => void;

function defaultOnRequest(request: RequestPayload): void {
  debugRequest(`${request.method} - ${request.url}`);
  if (request.body) {
    debugRequest('Outgoing request body:');
    if (Buffer.isBuffer(request.body)) {
      debugRequest(request.body);
    } else {
      debugRequest(JSON.stringify(request.body, null, 2));
    }
  }
}

function createRequestInterceptor({
  onRequest = defaultOnRequest,
}: { onRequest?: OnRequestFunction } = {}) {
  return (config: AxiosRequestConfig): AxiosRequestConfig => {
    onRequest({
      method: config.method,
      url: urlJoin(config.baseURL || '', config.url || '/'),
      headers: {
        ...config.headers.common,
        ...(config.method ? config.headers[config.method] : {}),
        ...omit(config.headers, [
          'common',
          'get',
          'post',
          'put',
          'patch',
          'delete',
          'head',
        ]),
      },

      body: config.data,
    });

    return config;
  };
}

export * from './case';

export { defaultOnRequest as onRequest, createRequestInterceptor };
