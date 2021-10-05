import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import {
  OnRequestFunction,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as SlackTypes from './SlackTypes';

interface ClientConfig {
  url: string;
  onRequest?: OnRequestFunction;
}

export default class SlackWebhookClient {
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

  /**
   * Send message by using raw body.
   *
   * @param body - Raw data to be sent.
   *
   * @see https://api.slack.com/docs/messages
   *
   * @example
   *
   * ```js
   * await client.sendRawBody({ text: 'Hello!' });
   * ```
   */
  sendRawBody(
    body: Record<string, any>
  ): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.axios.post('', snakecaseKeysDeep(body)).then((res) => res.data);
  }

  /**
   * Send text message.
   *
   * @param text - Text of the message to be sent.
   *
   * @see https://api.slack.com/docs/messages
   *
   * @example
   *
   * ```js
   * await client.sendText('Hello!');
   * ```
   */
  sendText(text: string): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.sendRawBody({ text });
  }

  /**
   * Send multiple attachments which let you add more context to a message.
   *
   * @param attachments -  Messages are attachments, defined as an array. Each object contains the parameters to customize the appearance of a message attachment.
   *
   * @see https://api.slack.com/docs/message-attachments
   *
   * ```js
   * await client.sendAttachments([
   *   {
   *     fallback: 'some text',
   *     pretext: 'some pretext',
   *     color: 'good',
   *     fields: [
   *       {
   *         title: 'aaa',
   *         value: 'bbb',
   *         short: false,
   *       },
   *     ],
   *   },
   *   {
   *     fallback: 'some other text',
   *     pretext: 'some pther pretext',
   *     color: '#FF0000',
   *     fields: [
   *       {
   *         title: 'ccc',
   *         value: 'ddd',
   *         short: false,
   *       },
   *     ],
   *   },
   * ]);
   * ```
   */

  sendAttachments(
    attachments: SlackTypes.Attachment[]
  ): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.sendRawBody({ attachments });
  }

  /**
   * Send only one attachment.
   *
   * @param attachment - Message is an attachment. The object contains the parameters to customize the appearance of a message attachment.
   *
   * @see https://api.slack.com/docs/message-attachments
   *
   * ```js
   * await client.sendAttachment({
   *   fallback: 'some text',
   *   pretext: 'some pretext',
   *   color: 'good',
   *   fields: [
   *     {
   *       title: 'aaa',
   *       value: 'bbb',
   *       short: false,
   *     },
   *   ],
   * });
   * ```
   */
  sendAttachment(
    attachment: SlackTypes.Attachment
  ): Promise<SlackTypes.SendMessageSuccessResponse> {
    return this.sendAttachments([attachment]);
  }
}
