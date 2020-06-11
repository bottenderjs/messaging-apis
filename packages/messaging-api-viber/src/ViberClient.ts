/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  onRequest,
  pascalcaseKeysDeep,
  snakecaseKeys,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as Types from './ViberTypes';

function transformMessageCase(message: Types.Message): any {
  const { keyboard, richMedia, ...others } = message as any;

  return {
    ...snakecaseKeysDeep(others),
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
  /**
   * @deprecated Use `new ViberClient(...)` instead.
   */
  static connect(
    accessTokenOrConfig: string | Types.ClientConfig,
    sender?: Types.Sender
  ): ViberClient {
    warning(
      false,
      '`ViberClient.connect(...)` is deprecated. Use `new ViberClient(...)` instead.'
    );
    return new ViberClient(accessTokenOrConfig, sender);
  }

  _token: string;

  _sender: Types.Sender;

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  constructor(
    accessTokenOrConfig: string | Types.ClientConfig,
    sender?: Types.Sender
  ) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._sender = config.sender;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._token = accessTokenOrConfig;
      this._sender = sender as Types.Sender;
      this._onRequest = onRequest;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://chatapi.viber.com'}/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': this._token,
      },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );
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
  ): Promise<Types.SucceededResponseData<R> | never> {
    try {
      const response = await this._axios.post(
        path,

        // we can't apply a deep snake_case transform here
        // because it accept only PascalCase for keyboard and rich media
        snakecaseKeys(body, { deep: false })
      );

      const { config, request } = response;

      const data = (camelcaseKeysDeep(
        response.data
      ) as any) as Types.ResponseData<R>;

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
      | Types.EventType[]
      | {
          eventTypes?: Types.EventType[];
          sendName?: boolean;
          sendPhoto?: boolean;
        } = {}
  ): Promise<
    | Types.SucceededResponseData<{
        eventTypes: Types.EventType[];
      }>
    | never
  > {
    const options = Array.isArray(optionsOrEventTypes)
      ? { eventTypes: optionsOrEventTypes }
      : optionsOrEventTypes;

    return this._callAPI<{
      eventTypes: Types.EventType[];
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
    | Types.SucceededResponseData<{
        eventTypes: Types.EventType[];
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
    message: Types.Message
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    { text, media, thumbnail }: Types.Picture,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    { media, size, thumbnail, duration }: Types.Video,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    file: Types.File,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    contact: Types.Contact,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    { lat, lon }: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    richMedia: Types.RichMedia,
    options?: Types.MessageOptions
  ): Promise<Types.SucceededResponseData<{ messageToken: number }> | never> {
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
    message: Types.Message
  ): Promise<Types.BroadcastResponseData | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    { text, media, thumbnail }: Types.Picture,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    { media, size, thumbnail, duration }: Types.Video,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    file: Types.File,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    contact: Types.Contact,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    { lat, lon }: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
    richMedia: Types.RichMedia,
    options?: Types.MessageOptions
  ): Promise<Types.BroadcastResponseData | never> {
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
  getAccountInfo(): Promise<
    Types.SucceededResponseData<Types.AccountInfo> | never
  > {
    return this._callAPI<Types.AccountInfo>('/get_account_info');
  }

  /**
   * Get User Details
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   */
  async getUserDetails(id: string): Promise<Types.UserDetails | never> {
    const { user } = await this._callAPI<{
      user: Types.UserDetails;
    }>('/get_user_details', { id });

    return user;
  }

  /**
   * Get Online
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-online
   */
  async getOnlineStatus(
    ids: string[]
  ): Promise<Types.UserOnlineStatus[] | never> {
    const data = await this._callAPI<{
      users: Types.UserOnlineStatus[];
    }>('/get_online', { ids });

    return data.users;
  }
}
