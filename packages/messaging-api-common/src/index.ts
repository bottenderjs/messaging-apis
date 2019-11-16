import debug from 'debug';
import omit from 'lodash/omit';
import urlJoin from 'url-join';
import { AxiosRequestConfig, Method } from 'axios';

const debugRequest = debug('messaging-api:request');

function defaultOnRequest(request: {
  method?: Method;
  url: string;
  headers: Record<string, any>;
  body: Record<string, any>;
}): void {
  if (request.body) {
    debugRequest('Outgoing request body:');
    if (Buffer.isBuffer(request.body)) {
      debugRequest(request.body);
    } else {
      debugRequest(JSON.stringify(request.body, null, 2));
    }
  }
}

type RequestPayload = {
  method?: Method;
  url: string;
  headers: Record<string, any>;
  body: any;
};

export type OnRequestFunction = (request: RequestPayload) => void;

function createRequestInterceptor({
  onRequest = defaultOnRequest,
}: { onRequest?: OnRequestFunction } = {}) {
  return (config: AxiosRequestConfig) => {
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
