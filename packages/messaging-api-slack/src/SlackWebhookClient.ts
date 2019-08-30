import axios, { AxiosInstance } from 'axios';
import debug from 'debug';
import omit from 'lodash.omit';
import urlJoin from 'url-join';

import { SendMessageSuccessResponse, SlackAttachment } from './SlackTypes';

type URL = string;

interface ClientConfig {
  url: URL;
  onRequest?: Function;
}

const debugRequest = debug('messaging-api-slack');

function onRequest({
  method,
  url,
  body,
}: {
  method: string;
  url: string;
  body: Record<string, any>;
}): void {
  debugRequest(`${method} ${url}`);
  debugRequest('Outgoing request body:');
  debugRequest(JSON.stringify(body, null, 2));
}

export default class SlackWebhookClient {
  _axios: AxiosInstance;

  _onRequest: Function;

  static connect(urlOrConfig: URL | ClientConfig): SlackWebhookClient {
    return new SlackWebhookClient(urlOrConfig);
  }

  constructor(urlOrConfig: URL | ClientConfig) {
    let url;

    if (urlOrConfig && typeof urlOrConfig === 'object') {
      const config = urlOrConfig;

      url = config.url;
      this._onRequest = config.onRequest || onRequest;
    } else {
      url = urlOrConfig;
      this._onRequest = onRequest;
    }

    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this._axios = axios.create({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });

    this._axios.interceptors.request.use(config => {
      this._onRequest({
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
    });
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  sendRawBody(body: Record<string, any>): Promise<SendMessageSuccessResponse> {
    return this._axios.post('', body).then(res => res.data);
  }

  sendText(text: string): Promise<SendMessageSuccessResponse> {
    return this.sendRawBody({ text });
  }

  /**
   * Attachments
   *
   * https://api.slack.com/docs/message-attachments
   */

  sendAttachments(
    attachments: SlackAttachment[]
  ): Promise<SendMessageSuccessResponse> {
    return this.sendRawBody({ attachments });
  }

  sendAttachment(
    attachment: SlackAttachment
  ): Promise<SendMessageSuccessResponse> {
    return this.sendAttachments([attachment]);
  }
}
