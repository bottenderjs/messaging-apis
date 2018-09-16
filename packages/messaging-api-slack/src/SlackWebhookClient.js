/* @flow */

import axios from 'axios';

import type { SendMessageSucessResponse, SlackAttachment } from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type URL = string;

export default class SlackWebhookClient {
  static connect(url: URL): SlackWebhookClient {
    return new SlackWebhookClient(url);
  }

  _axios: Axios;

  constructor(url: URL) {
    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this._axios = axios.create({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  get axios(): Axios {
    return this._axios;
  }

  sendRawBody(body: Object): Promise<SendMessageSucessResponse> {
    return this._axios.post('', body).then(res => res.data);
  }

  sendText(text: string): Promise<SendMessageSucessResponse> {
    return this.sendRawBody({ text });
  }

  /**
   * Attachments
   *
   * https://api.slack.com/docs/message-attachments
   */

  sendAttachments(
    attachments: Array<SlackAttachment>
  ): Promise<SendMessageSucessResponse> {
    return this.sendRawBody({ attachments });
  }

  sendAttachment(
    attachment: SlackAttachment
  ): Promise<SendMessageSucessResponse> {
    return this.sendAttachments([attachment]);
  }
}
