/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import debug from 'debug';
import omit from 'lodash.omit';
import urlJoin from 'url-join';

import {
  ViberContact,
  ViberEventType,
  ViberFile,
  ViberLocation,
  ViberPicture,
  ViberRichMedia,
  ViberSender,
  ViberVideo,
} from './ViberTypes';

type ClientConfig = {
  accessToken: string;
  sender: ViberSender;
  origin?: string;
  onRequest?: Function;
};

const debugRequest = debug('messaging-api-viber');

function onRequest({
  method,
  url,
  body,
}: {
  method: string;
  url: string;
  body: Record<string, any>;
}): void {
  debugRequest(`${method} ${url}`);
  if (body) {
    debugRequest('Outgoing request body:');
    debugRequest(JSON.stringify(body, null, 2));
  }
}

/**
 * https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  static connect(
    accessTokenOrConfig: string | ClientConfig,
    sender: ViberSender
  ): ViberClient {
    return new ViberClient(accessTokenOrConfig, sender);
  }

  _token: string;

  _sender: ViberSender;

  _onRequest: Function;

  _axios: AxiosInstance;

  constructor(accessTokenOrConfig: string | ClientConfig, sender: ViberSender) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._sender = config.sender;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._token = accessTokenOrConfig;
      this._sender = sender;
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

  async _callAPI(...args) {
    try {
      const response = await this._axios.post(...args);

      const { data, config, request } = response;

      if (data.status !== 0) {
        throw new AxiosError(`Viber API - ${data.status_message}`, {
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
  setWebhook(url: string, eventTypes?: ViberEventType[]) {
    const body: { url: string; event_types?: ViberEventType[] } = {
      url,
    };

    if (eventTypes) {
      body.event_types = eventTypes;
    }
    return this._callAPI('/set_webhook', body);
  }

  /**
   * Removing your webhook
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   */
  removeWebhook() {
    return this.setWebhook('');
  }

  /**
   * Send Message
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#send-message
   */
  sendMessage(receiver: string, { type, ...options }: Record<string, any>) {
    return this._callAPI('/send_message', {
      receiver,
      type,
      sender: this._sender,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  sendText(receiver: string, text: string, options: Record<string, any> = {}) {
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
    { text, media, thumbnail }: ViberPicture,
    options: Record<string, any> = {}
  ) {
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
    { media, size, thumbnail, duration }: ViberVideo,
    options: Record<string, any> = {}
  ) {
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
    { media, size, file_name }: ViberFile,
    options: Record<string, any> = {}
  ) {
    return this.sendMessage(receiver, {
      type: 'file',
      media,
      size,
      file_name,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  sendContact(
    receiver: string,
    { name, phone_number }: ViberContact,
    options: Record<string, any> = {}
  ) {
    return this.sendMessage(receiver, {
      type: 'contact',
      contact: { name, phone_number },
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  sendLocation(
    receiver: string,
    { lat, lon }: ViberLocation,
    options: Record<string, any> = {}
  ) {
    return this.sendMessage(receiver, {
      type: 'location',
      location: { lat, lon },
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#url-message
   */
  sendURL(receiver: string, url: string, options: Record<string, any> = {}) {
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
    stickerId: string,
    options: Record<string, any> = {}
  ) {
    return this.sendMessage(receiver, {
      type: 'sticker',
      sticker_id: stickerId,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  sendCarouselContent(
    receiver: string,
    richMedia: ViberRichMedia,
    options: Record<string, any> = {}
  ) {
    return this.sendMessage(receiver, {
      type: 'rich_media',
      min_api_version: 2,
      rich_media: richMedia,
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
    { type, ...options }: Record<string, any>
  ) {
    return this._callAPI('/broadcast_message', {
      broadcast_list: broadcastList,
      type,
      sender: this._sender,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  broadcastText(
    broadcastList: string[],
    text: string,
    options?: Record<string, any> = {}
  ) {
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
    { text, media, thumbnail }: ViberPicture,
    options: Record<string, any> = {}
  ) {
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
    { media, size, thumbnail, duration }: ViberVideo,
    options: Record<string, any> = {}
  ) {
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
    { media, size, file_name }: ViberFile,
    options: Record<string, any> = {}
  ) {
    return this.broadcastMessage(broadcastList, {
      type: 'file',
      media,
      size,
      file_name,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  broadcastContact(
    broadcastList: string[],
    { name, phone_number }: ViberContact,
    options: Record<string, any> = {}
  ) {
    return this.broadcastMessage(broadcastList, {
      type: 'contact',
      contact: { name, phone_number },
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  broadcastLocation(
    broadcastList: string[],
    { lat, lon }: ViberLocation,
    options: Record<string, any> = {}
  ) {
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
    options: Record<string, any> = {}
  ) {
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
    stickerId: string,
    options: Record<string, any> = {}
  ) {
    return this.broadcastMessage(broadcastList, {
      type: 'sticker',
      sticker_id: stickerId,
      ...options,
    });
  }

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  broadcastCarouselContent(
    broadcastList: string[],
    richMedia: ViberRichMedia,
    options: Record<string, any> = {}
  ) {
    return this.broadcastMessage(broadcastList, {
      type: 'rich_media',
      min_api_version: 2,
      rich_media: richMedia,
      ...options,
    });
  }

  /**
   * Get Account Info
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-account-info
   */
  getAccountInfo() {
    return this._callAPI('/get_account_info', {});
  }

  /**
   * Get User Details
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   */
  async getUserDetails(id: string) {
    const data = await this._callAPI('/get_user_details', { id });
    return data.user;
  }

  /**
   * Get Online
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-online
   */
  async getOnlineStatus(ids: string[]) {
    const data = await this._callAPI('/get_online', { ids });
    return data.users;
  }
}
