/* @flow */

import axios from 'axios';
import AxiosError from 'axios-error';

import type {
  ViberEventType,
  ViberContact,
  ViberLocation,
  ViberRichMedia,
  ViberSender,
  ViberPicture,
  ViberVideo,
  ViberFile,
} from './ViberTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

/**
 * https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  static connect = (token: string, sender: ViberSender): ViberClient =>
    new ViberClient(token, sender);

  _token: string;
  _sender: ViberSender;
  _axios: Axios;

  constructor(token: string, sender: ViberSender) {
    this._token = token;
    this._sender = sender;
    this._axios = axios.create({
      baseURL: `https://chatapi.viber.com/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': token,
      },
    });
  }

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._token;
  }

  _callAPI = async (...args: Array<any>) => {
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
  };

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
  setWebhook = async (url: string, eventTypes?: Array<ViberEventType>) => {
    const body: { url: string, event_types?: Array<ViberEventType> } = {
      url,
    };
    if (eventTypes) {
      body.event_types = eventTypes;
    }
    return this._callAPI('/set_webhook', body);
  };

  /**
   * Removing your webhook
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   */
  removeWebhook = () => this.setWebhook('');

  /**
   * Send Message
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#send-message
   */
  sendMessage = async (receiver: string, { type, ...options }: Object) =>
    this._callAPI('/send_message', {
      receiver,
      type,
      sender: this._sender,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  sendText = (receiver: string, text: string, options?: Object = {}) =>
    this.sendMessage(receiver, {
      type: 'text',
      text,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   */
  sendPicture = (
    receiver: string,
    { text, media, thumbnail }: ViberPicture,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'picture',
      text,
      media,
      thumbnail,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#video-message
   */
  sendVideo = (
    receiver: string,
    { media, size, thumbnail, duration }: ViberVideo,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'video',
      media,
      size,
      thumbnail,
      duration,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#file-message
   */
  sendFile = (
    receiver: string,
    { media, size, file_name }: ViberFile,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'file',
      media,
      size,
      file_name,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  sendContact = (
    receiver: string,
    { name, phone_number }: ViberContact,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'contact',
      contact: { name, phone_number },
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  sendLocation = (
    receiver: string,
    { lat, lon }: ViberLocation,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'location',
      location: { lat, lon },
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#url-message
   */
  sendURL = (receiver: string, url: string, options: Object = {}) =>
    this.sendMessage(receiver, {
      type: 'url',
      media: url,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   */
  sendSticker = (receiver: string, stickerId: string, options: Object = {}) =>
    this.sendMessage(receiver, {
      type: 'sticker',
      sticker_id: stickerId,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  sendCarouselContent = (
    receiver: string,
    richMedia: ViberRichMedia,
    options: Object = {}
  ) =>
    this.sendMessage(receiver, {
      type: 'rich_media',
      min_api_version: 2,
      rich_media: richMedia,
      ...options,
    });

  /**
   * Broadcast Message
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#broadcast-message
   */
  broadcastMessage = async (
    broadcastList: Array<string>,
    { type, ...options }: Object
  ) =>
    this._callAPI('/broadcast_message', {
      broadcast_list: broadcastList,
      type,
      sender: this._sender,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#text-message
   */
  broadcastText = (
    broadcastList: Array<string>,
    text: string,
    options?: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'text',
      text,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   */
  broadcastPicture = (
    broadcastList: Array<string>,
    { text, media, thumbnail }: ViberPicture,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'picture',
      text,
      media,
      thumbnail,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#video-message
   */
  broadcastVideo = (
    broadcastList: Array<string>,
    { media, size, thumbnail, duration }: ViberVideo,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'video',
      media,
      size,
      thumbnail,
      duration,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#file-message
   */
  broadcastFile = (
    broadcastList: Array<string>,
    { media, size, file_name }: ViberFile,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'file',
      media,
      size,
      file_name,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   */
  broadcastContact = (
    broadcastList: Array<string>,
    { name, phone_number }: ViberContact,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'contact',
      contact: { name, phone_number },
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#location-message
   */
  broadcastLocation = (
    broadcastList: Array<string>,
    { lat, lon }: ViberLocation,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'location',
      location: { lat, lon },
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#url-message
   */
  broadcastURL = (
    broadcastList: Array<string>,
    url: string,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'url',
      media: url,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   */
  broadcastSticker = (
    broadcastList: Array<string>,
    stickerId: string,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'sticker',
      sticker_id: stickerId,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   */
  broadcastCarouselContent = (
    broadcastList: Array<string>,
    richMedia: ViberRichMedia,
    options: Object = {}
  ) =>
    this.broadcastMessage(broadcastList, {
      type: 'rich_media',
      min_api_version: 2,
      rich_media: richMedia,
      ...options,
    });

  /**
   * Get Account Info
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-account-info
   */
  getAccountInfo = async () => this._callAPI('/get_account_info', {});

  /**
   * Get User Details
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   */
  getUserDetails = async (id: string) => {
    const data = await this._callAPI('/get_user_details', { id });
    return data.user;
  };

  /**
   * Get Online
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#get-online
   */
  getOnlineStatus = async (ids: Array<string>) => {
    const data = await this._callAPI('/get_online', { ids });
    return data.users;
  };
}
