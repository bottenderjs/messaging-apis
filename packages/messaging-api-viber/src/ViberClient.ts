/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import mapObj from 'map-obj';
import omit from 'lodash.omit';
import pascalCase from 'pascal-case';
import snakecaseKeys from 'snakecase-keys';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import {
  AccountInfo,
  BroadcastResponseData,
  Contact,
  EventType,
  File,
  Location,
  Message,
  MessageOptions,
  Picture,
  ResponseData,
  RichMedia,
  Sender,
  SucceededResponseData,
  UserDetails,
  UserOnlineStatus,
  Video,
} from './ViberTypes';

type ClientConfig = {
  accessToken: string;
  sender: Sender;
  origin?: string;
  onRequest?: Function;
};

function pascalcaseKeysDeep(input: any): any {
  if (Array.isArray(input)) {
    return input.map(item => pascalcaseKeysDeep(item));
  }

  if (input && typeof input === 'object') {
    return mapObj(input, (key, val) => {
      return [pascalCase(key as string), pascalcaseKeysDeep(val)];
    });
  }

  return input;
}

function transformMessageCase(message: Message): any {
  const { keyboard, richMedia, ...others } = message as any;

  return {
    ...snakecaseKeys(others, { deep: true }),
    ...(keyboard ? { keyboard: pascalcaseKeysDeep(keyboard) } : undefined),
    ...(richMedia
      ? {
          richMedia: pascalcaseKeysDeep(richMedia),
        }
      : undefined),
  } as any;
}

/**
 * https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  static connect(
    accessTokenOrConfig: string | ClientConfig,
    sender?: Sender
  ): ViberClient {
    return new ViberClient(accessTokenOrConfig, sender);
  }

  _token: string;

  _sender: Sender;

  _onRequest: Function;

  _axios: AxiosInstance;

  constructor(accessTokenOrConfig: string | ClientConfig, sender?: Sender) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._sender = config.sender;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._token = accessTokenOrConfig;
      this._sender = sender as Sender;
      this._onRequest = onRequest;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://chatapi.viber.com'}/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': this._token,
      },
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

  get accessToken(): string {
    return this._token;
  }

  async _callAPI<R extends object>(
    path: string,
    body: Record<string, any> = {}
  ): Promise<SucceededResponseData<R> | never> {
    try {
      console.log(snakecaseKeys(body, { deep: false }));
      const response = await this._axios.post(
        path,

        // we can't apply a deep snake_case transform here
        // because it accept only PascalCase for keyboard and rich media
        snakecaseKeys(body, { deep: false })
      );

      const { config, request } = response;

      const data = (camelcaseKeys(response.data, {
        deep: true,
      }) as any) as ResponseData<R>;

      if (data.status !== 0) {
        throw new AxiosError(`Viber API - ${data.statusMessage}`, {
          config,
          request,
          response,
        });
      }

      return data;
    } catch (err) {
      throw new AxiosError(err.message, err);
    }
  }

  /**
   * Webhooks
   *
   * https://viber.github.io/docs/api/rest-bot-api/#webhooks
   */

  /**
   * Setting a Webhook
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#setting-a-webhook
   */
  setWebhook(
    url: string,
    optionsOrEventTypes:
      | EventType[]
      | {
          eventTypes?: EventType[];
          sendName?: boolean;
          sendPhoto?: boolean;
        } = {}
  ): Promise<
    | SucceededResponseData<{
        eventTypes: EventType[];
      }>
    | never
  > {
    const options = Array.isArray(optionsOrEventTypes)
      ? { eventTypes: optionsOrEventTypes }
      : optionsOrEventTypes;

    return this._callAPI<{
      eventTypes: EventType[];
    }>('/set_webhook', {
      url,
      ...options,
    });
  }

  /**
   * Removing your webhook
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   */
  removeWebhook(): Promise<
    | SucceededResponseData<{
        eventTypes: EventType[];
      }>
    | never
  > {
    return this.setWebhook('');
  }

  /**
   * Send Message
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#send-message
   */
  sendMessage(
    receiver: string,
    message: Message
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this._callAPI('/send_message', {
      receiver,
      sender: this._sender,
      ...transformMessageCase(message),
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  sendText(
    receiver: string,
    text: string,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'text',
      text,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   */
  sendPicture(
    receiver: string,
    { text, media, thumbnail }: Picture,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'picture',
      text,
      media,
      thumbnail,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#video-message
   */
  sendVideo(
    receiver: string,
    { media, size, thumbnail, duration }: Video,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'video',
      media,
      size,
      thumbnail,
      duration,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#file-message
   */
  sendFile(
    receiver: string,
    file: File,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'file',
      ...file,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  sendContact(
    receiver: string,
    contact: Contact,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'contact',
      contact,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  sendLocation(
    receiver: string,
    { lat, lon }: Location,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'location',
      location: { lat, lon },
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#url-message
   */
  sendURL(
    receiver: string,
    url: string,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'url',
      media: url,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   */
  sendSticker(
    receiver: string,
    stickerId: number,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'sticker',
      stickerId,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  sendCarouselContent(
    receiver: string,
    richMedia: RichMedia,
    options?: MessageOptions
  ): Promise<SucceededResponseData<{ messageToken: number }> | never> {
    return this.sendMessage(receiver, {
      type: 'rich_media',
      minApiVersion: 2,
      richMedia,
      ...options,
    });
  }

  /**
   * Broadcast Message
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#broadcast-message
   */
  broadcastMessage(
    broadcastList: string[],
    message: Message
  ): Promise<BroadcastResponseData | never> {
    return this._callAPI('/broadcast_message', {
      broadcastList,
      sender: this._sender,
      ...transformMessageCase(message),
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  broadcastText(
    broadcastList: string[],
    text: string,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'text',
      text,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   */
  broadcastPicture(
    broadcastList: string[],
    { text, media, thumbnail }: Picture,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'picture',
      text,
      media,
      thumbnail,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#video-message
   */
  broadcastVideo(
    broadcastList: string[],
    { media, size, thumbnail, duration }: Video,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'video',
      media,
      size,
      thumbnail,
      duration,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#file-message
   */
  broadcastFile(
    broadcastList: string[],
    file: File,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'file',
      ...file,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  broadcastContact(
    broadcastList: string[],
    contact: Contact,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'contact',
      contact,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  broadcastLocation(
    broadcastList: string[],
    { lat, lon }: Location,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'location',
      location: { lat, lon },
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#url-message
   */
  broadcastURL(
    broadcastList: string[],
    url: string,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'url',
      media: url,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   */
  broadcastSticker(
    broadcastList: string[],
    stickerId: number,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'sticker',
      stickerId,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  broadcastCarouselContent(
    broadcastList: string[],
    richMedia: RichMedia,
    options?: MessageOptions
  ): Promise<BroadcastResponseData | never> {
    return this.broadcastMessage(broadcastList, {
      type: 'rich_media',
      minApiVersion: 2,
      richMedia,
      ...options,
    });
  }

  /**
   * Get Account Info
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-account-info
   */
  getAccountInfo(): Promise<SucceededResponseData<AccountInfo> | never> {
    return this._callAPI<AccountInfo>('/get_account_info');
  }

  /**
   * Get User Details
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   */
  async getUserDetails(id: string): Promise<UserDetails | never> {
    const { user } = await this._callAPI<{
      user: UserDetails;
    }>('/get_user_details', { id });

    return user;
  }

  /**
   * Get Online
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-online
   */
  async getOnlineStatus(ids: string[]): Promise<UserOnlineStatus[] | never> {
    const data = await this._callAPI<{
      users: UserOnlineStatus[];
    }>('/get_online', { ids });

    return data.users;
  }
}
