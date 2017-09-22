/* @flow */

import axios from 'axios';

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

  _http: Axios;

  constructor(url: URL) {
    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this._http = axios.create({
      baseURL: url,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getHTTPClient: () => Axios = () => this._http;

  sendRawBody = (body: Object): Promise<SendMessageSucessResponse> =>
    this._http.post('', body).then(res => res.data);

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
