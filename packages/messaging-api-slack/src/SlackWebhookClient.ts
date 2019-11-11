import axios, { AxiosInstance } from 'axios';
import omit from 'lodash.omit';
import snakecaseKeys from 'snakecase-keys';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import { Attachment, SendMessageSuccessResponse } from './SlackTypes';

type URL = string;

interface ClientConfig {
  url: URL;
  onRequest?: Function;
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
    return this._axios
      .post('', snakecaseKeys(body, { deep: true }))
      .then(res => res.data);
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
    attachments: Attachment[]
  ): Promise<SendMessageSuccessResponse> {
    return this.sendRawBody({ attachments });
  }

  sendAttachment(attachment: Attachment): Promise<SendMessageSuccessResponse> {
    return this.sendAttachments([attachment]);
  }
}
