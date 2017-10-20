/* @flow */

import axios from 'axios';
import warning from 'warning';

import type { SlackAttachment, SendMessageSucessResponse } from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type URL = string;

export default class SlackWebhookClient {
  static connect = (url: URL): SlackWebhookClient =>
    new SlackWebhookClient(url);

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

  getHTTPClient: () => Axios = () => {
    warning(
      false,
      '`.getHTTPClient` method is deprecated. use `.axios` getter instead.'
    );
    return this._axios;
  };

  sendRawBody = (body: Object): Promise<SendMessageSucessResponse> =>
    this._axios.post('', body).then(res => res.data);

  sendText = (text: string): Promise<SendMessageSucessResponse> =>
    this.sendRawBody({ text });

  /**
   * Attachments
   *
   * https://api.slack.com/docs/message-attachments
   */

  sendAttachments = (
    attachments: Array<SlackAttachment>
  ): Promise<SendMessageSucessResponse> => this.sendRawBody({ attachments });

  sendAttachment = (
    attachment: SlackAttachment
  ): Promise<SendMessageSucessResponse> => this.sendAttachments([attachment]);
}
