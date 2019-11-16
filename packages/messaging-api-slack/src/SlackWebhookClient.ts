import axios, { AxiosInstance } from 'axios';
import {
  OnRequestFunction,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import { Attachment, SendMessageSuccessResponse } from './SlackTypes';

type URL = string;

interface ClientConfig {
  url: URL;
  onRequest?: OnRequestFunction;
}

export default class SlackWebhookClient {
  _axios: AxiosInstance;

  _onRequest: OnRequestFunction | undefined;

  static connect(urlOrConfig: URL | ClientConfig): SlackWebhookClient {
    return new SlackWebhookClient(urlOrConfig);
  }

  constructor(urlOrConfig: URL | ClientConfig) {
    let url;

    if (urlOrConfig && typeof urlOrConfig === 'object') {
      const config = urlOrConfig;

      url = config.url;
      this._onRequest = config.onRequest;
    } else {
      url = urlOrConfig;
    }

    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this._axios = axios.create({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  sendRawBody(body: Record<string, any>): Promise<SendMessageSuccessResponse> {
    return this._axios.post('', snakecaseKeysDeep(body)).then(res => res.data);
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
