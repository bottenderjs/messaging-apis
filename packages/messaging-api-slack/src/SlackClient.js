import axios from 'axios';
import slack from '@slack/client';

import type { SendMessageSucessResponse } from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type WebClient = {
  chat: {
    postMessage: Function,
  },
};

type Config =
  | string
  | {
      channel: string,
      accessToken: string,
    };

export default class SlackClient {
  static connect = (config: Config): SlackClient => new SlackClient(config);

  _http: Axios | WebClient;
  _type: 'IncomingWebhook' | 'WebAPI';
  _accessToken: string;
  _channel: string;

  constructor(config: Config) {
    if (typeof config === 'string') {
      // incoming webhooks
      // https://api.slack.com/incoming-webhooks
      this._type = 'IncomingWebhook';
      this._http = axios.create({
        baseURL: config,
        headers: { 'Content-Type': 'application/json' },
      });
      return;
    }
    // slack apps
    // https://api.slack.com/apps/
    this._type = 'WebAPI';
    this._channel = config.channel;
    this._http = new slack.WebClient(config.accessToken);
  }

  getHTTPClient: () => Axios | WebClient = () => this._http;

  sendRawBody = (body: Object): Promise<SendMessageSucessResponse> => {
    switch (this._type) {
      case 'IncomingWebhook':
        return this._http.post('', body).then(res => res.data);
      case 'WebAPI':
        return this._http.chat.postMessage(this._channel, body.text, body);
      default:
        throw TypeError('wrong API type of client');
    }
  };

  sendText = (text: string): Promise<SendMessageSucessResponse> =>
    this.sendRawBody({ text });
}
