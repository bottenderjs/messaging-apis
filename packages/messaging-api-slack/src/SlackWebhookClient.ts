import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as Types from './SlackTypes';

interface ClientConfig {
  url: string;
  onRequest?: OnRequestFunction;
}

export default class SlackWebhookClient {
  /**
   * @deprecated Use `new SlackWebhookClient(...)` instead.
   */
  static connect(config: ClientConfig): SlackWebhookClient {
    warning(
      false,
      '`SlackWebhookClient.connect(...)` is deprecated. Use `new SlackWebhookClient(...)` instead.'
    );
    return new SlackWebhookClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: ClientConfig) {
    invariant(
      typeof config !== 'string',
      `SlackWebhookClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.onRequest = config.onRequest;

    // incoming webhooks
    // https://api.slack.com/incoming-webhooks
    this.axios = axios.create({
      baseURL: config.url,
      headers: { 'Content-Type': 'application/json' },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );
  }

  sendRawBody(
    body: Record<string, any>
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.axios.post('', snakecaseKeysDeep(body)).then((res) => res.data);
  }

  sendText(text: string): Promise<Types.SendMessageSuccessResponse> {
    return this.sendRawBody({ text });
  }

  /**
   * Attachments
   *
   * https://api.slack.com/docs/message-attachments
   */

  sendAttachments(
    attachments: Types.Attachment[]
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendRawBody({ attachments });
  }

  sendAttachment(
    attachment: Types.Attachment
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendAttachments([attachment]);
  }
}
