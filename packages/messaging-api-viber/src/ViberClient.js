/* @flow */

import axios from 'axios';

import type {
  ViberEventType,
  ViberContact,
  ViberLocation,
  ViberRichMedia,
  ViberSender,
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
  _http: Axios;

  constructor(token: string, sender: ViberSender) {
    this._token = token;
    this._sender = sender;
    this._http = axios.create({
      baseURL: `https://chatapi.viber.com/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': token,
      },
    });
  }

  getHTTPClient: () => Axios = () => this._http;

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
    const { data } = await this._http.post('/set_webhook', body);

    if (data.status !== 0) {
      throw new Error(data.status_message);
    }

    return data;
  };

  /**
   * Removing your webhook
   *
   * https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   */
  removeWebhook = () => this.setWebhook('');

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#send-message
   */
  sendMessage = (receiver: string, { type, ...options }: Object) =>
    this._http.post('/send_message', {
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
  sendPicture = (receiver: string, { text, media, ...options }: Object = {}) =>
    this.sendMessage(receiver, {
      type: 'picture',
      text,
      media,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#video-message
   */
  sendVideo = (receiver: string, { media, size, ...options }: Object = {}) =>
    this.sendMessage(receiver, {
      type: 'video',
      media,
      size,
      ...options,
    });

  /**
   * https://developers.viber.com/docs/api/rest-bot-api/#file-message
   */
  sendFile = (
    receiver: string,
    { media, size, file_name },
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
}
