/* @flow */

import axios from 'axios';
import debug from 'debug';
import omit from 'lodash.omit';
import urlJoin from 'url-join'; /*:: type ClientConfig = {
                                                                                                                                                        url: URL,
                                                                                                                                                        onRequest?: Function,
                                                                                                                                                      };*/ /*:: import type { SendMessageSucessResponse, SlackAttachment } from './SlackTypes';*/ /*:: type Axios = {
                                                                                                                         get: Function,
                                                                                                                         post: Function,
                                                                                                                         put: Function,
                                                                                                                         path: Function,
                                                                                                                         delete: Function,
                                                                                                                       };*/ /*:: type URL = string;*/

const debugRequest = debug('messaging-api-slack');

function onRequest({ method, url, body }) {
  debugRequest(`${method} ${url}`);
  debugRequest('Outgoing request body:');
  debugRequest(JSON.stringify(body, null, 2));
}

export default class SlackWebhookClient {
  static connect(
    urlOrConfig /*: URL | ClientConfig*/
  ) /*: SlackWebhookClient*/ {
    return new SlackWebhookClient(urlOrConfig);
  } /*:: _axios: Axios;*/ /*:: _onRequest: Function;*/

  constructor(urlOrConfig /*: URL | ClientConfig */) {
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
        url: urlJoin(config.baseURL, config.url),
        headers: {
          ...config.headers.common,
          ...config.headers[config.method],
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

  get axios() /*: Axios */ {
    return this._axios;
  }

  sendRawBody(body /*: Object */) /*: Promise<SendMessageSucessResponse> */ {
    return this._axios.post('', body).then(res => res.data);
  }

  sendText(text /*: string */) /*: Promise<SendMessageSucessResponse> */ {
    return this.sendRawBody({ text });
  }

  /**
   * Attachments
   *
   * https://api.slack.com/docs/message-attachments
   */

  sendAttachments(
    attachments /*: Promise<SendMessageSucessResponse>*/ /*: Array<SlackAttachment>*/
  ) {
    return this.sendRawBody({ attachments });
  }

  sendAttachment(
    attachment /*: Promise<SendMessageSucessResponse>*/ /*: SlackAttachment*/
  ) {
    return this.sendAttachments([attachment]);
  }
}
