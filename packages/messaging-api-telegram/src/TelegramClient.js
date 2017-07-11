/* @flow */
import axios from 'axios';

import type { ChatAction } from './TelegramTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

export default class TelegramClient {
  static connect = (token: string): TelegramClient => new TelegramClient(token);

  _token: string;
  _http: Axios;

  constructor(token: string) {
    this._token = token;
    this._http = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getHTTPClient: () => Axios = () => this._http;

  _request = (url: string, data?: Object) =>
    this._http.post(url, data).then(res => res.data);

  /**
   * https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebhookInfo = () => this._request('/getWebhookInfo');

  /**
   * https://core.telegram.org/bots/api#setwebhook
   */
  setWebhook = (url: string) =>
    this._request('/setWebhook', {
      url,
    });

  /**
   * https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebhook = () => this._request('/deleteWebhook');

  /**
   * https://core.telegram.org/bots/api#getme
   */
  getMe = () => this._request('/getMe');

  /**
   * https://core.telegram.org/bots/api#sendmessage
   */
  sendMessage = (chatId: string, text: string, options?: Object) =>
    this._request('/sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendphoto
   */
  sendPhoto = (chatId: string, photo: string, options?: Object) =>
    this._request('/sendPhoto', {
      chat_id: chatId,
      photo,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendaudio
   */
  sendAudio = (chatId: string, audio: string, options?: Object) =>
    this._request('/sendAudio', {
      chat_id: chatId,
      audio,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#senddocument
   */
  sendDocument = (chatId: string, document: string, options?: Object) =>
    this._request('/sendDocument', {
      chat_id: chatId,
      document,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendsticker
   */
  sendSticker = (chatId: string, sticker: string, options?: Object) =>
    this._request('/sendSticker', {
      chat_id: chatId,
      sticker,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendvideo
   */
  sendVideo = (chatId: string, video: string, options?: Object) =>
    this._request('/sendVideo', {
      chat_id: chatId,
      video,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendvoice
   */
  sendVoice = (chatId: string, voice: string, options?: Object) =>
    this._request('/sendVoice', {
      chat_id: chatId,
      voice,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendvideonote
   */
  // sendVideoNote = (chatId: string, videoNote: string) =>
  //   this._request('/sendVideoNote', {
  //     chat_id: chatId,
  //     video_note: videoNote,
  //   });

  /**
   * https://core.telegram.org/bots/api#sendlocation
   */
  sendLocation = (
    chatId: string,
    { latitude, longitude }: { latitude: number, longitude: number },
    options?: Object
  ) =>
    this._request('/sendLocation', {
      chat_id: chatId,
      latitude,
      longitude,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendvenue
   */
  sendVenue = (
    chatId: string,
    {
      latitude,
      longitude,
      title,
      address,
    }: { latitude: number, longitude: number, title: string, address: string },
    options?: Object
  ) =>
    this._request('/sendVenue', {
      chat_id: chatId,
      latitude,
      longitude,
      title,
      address,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendcontact
   */
  sendContact = (
    chatId: string,
    { phoneNumber, firstName }: { phoneNumber: string, firstName: string },
    options?: Object
  ) =>
    this._request('/sendContact', {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction = (chatId: string, action: ChatAction) =>
    this._request('/sendChatAction', {
      chat_id: chatId,
      action,
    });
}
