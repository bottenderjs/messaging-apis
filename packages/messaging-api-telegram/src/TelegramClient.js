/* @flow */

import axios from 'axios';
import AxiosError from 'axios-error';
import warning from 'warning';

import type { ChatAction } from './TelegramTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

function handleError(err) {
  const { error_code, description } = err.response.data;
  const msg = `Telegram API - ${error_code} ${description || ''}`; // eslint-disable-line camelcase
  throw new AxiosError(msg, err);
}

export default class TelegramClient {
  static connect = (token: string): TelegramClient => new TelegramClient(token);

  _token: string;
  _axios: Axios;

  constructor(token: string) {
    this._token = token;
    this._axios = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._token;
  }

  getHTTPClient: () => Axios = () => {
    warning(
      false,
      '`.getHTTPClient` method is deprecated. use `.axios` getter instead.'
    );
    return this._axios;
  };

  _request = (url: string, data?: Object) =>
    this._axios.post(url, data).then(res => res.data, handleError);

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
   * https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos = (userId: string, options?: Object) =>
    this._request('/getUserProfilePhotos', {
      user_id: userId,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#getfile
   */
  getFile = (fileId: string) =>
    this._request('/getFile', {
      file_id: fileId,
    });

  /**
   * Get link for file. This is extension method of getFile()
   */
  getFileLink = (fileId: string) =>
    this.getFile(fileId).then(
      response =>
        `https://api.telegram.org/file/bot${this._token}/${response.result
          .file_path}`
    );

  /**
   * https://core.telegram.org/bots/api#getchat
   */
  getChat = (chatId: string) =>
    this._request('/getChat', {
      chat_id: chatId,
    });

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatAdministrators = (chatId: string) =>
    this._request('/getChatAdministrators', {
      chat_id: chatId,
    });

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMembersCount = (chatId: string) =>
    this._request('/getChatMembersCount', {
      chat_id: chatId,
    });

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMember = (chatId: string, userId: string) =>
    this._request('/getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });

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
    { latitude, longitude }: {| latitude: number, longitude: number |},
    options?: Object
  ) =>
    this._request('/sendLocation', {
      chat_id: chatId,
      latitude,
      longitude,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#editmessagelivelocation
   */
  editMessageLiveLocation = (
    { latitude, longitude }: {| latitude: number, longitude: number |},
    options?: Object
  ) =>
    this._request('/editMessageLiveLocation', {
      latitude,
      longitude,
      ...options,
    });

  /**
   * https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation = (identifier: Object) =>
    this._request('/stopMessageLiveLocation', {
      ...identifier,
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
    }: {|
      latitude: number,
      longitude: number,
      title: string,
      address: string,
    |},
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
    {
      phone_number,
      first_name,
    }: {| phone_number: string, first_name: string |},
    options?: Object
  ) =>
    this._request('/sendContact', {
      chat_id: chatId,
      phone_number,
      first_name,
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

  /**
    * https://core.telegram.org/bots/api#editmessagetext
    */
  editMessageText = (text: string, options?: Object) =>
    this._request('/editMessageText', {
      text,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#editmessagecaption
    */
  editMessageCaption = (caption: string, options?: Object) =>
    this._request('/editMessageCaption', {
      caption,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#editmessagereplymarkup
    */
  editMessageReplyMarkup = (replyMarkup: Object, options?: Object) =>
    this._request('/editMessageReplyMarkup', {
      reply_markup: replyMarkup,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#deletemessage
    */
  deleteMessage = (chatId: string, messageId: string) =>
    this._request('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });

  /**
    * https://core.telegram.org/bots/api#kickchatmember
    */
  kickChatMember = (chatId: string, userId: string, options?: Object) =>
    this._request('/kickChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#unbanChatMember
    */
  unbanChatMember = (chatId: string, userId: string) =>
    this._request('/unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });

  /**
    * https://core.telegram.org/bots/api#restrictChatMember
    */
  restrictChatMember = (chatId: string, userId: string, options?: Object) =>
    this._request('/restrictChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#promoteChatMember
    */
  promoteChatMember = (chatId: string, userId: string, options?: Object) =>
    this._request('/promoteChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#exportChatInviteLink
    */
  exportChatInviteLink = (chatId: string) =>
    this._request('/exportChatInviteLink', {
      chat_id: chatId,
    });

  /**
    * https://core.telegram.org/bots/api#setChatPhoto
    */
  setChatPhoto = (chatId: string, photo: string) =>
    this._request('/setChatPhoto', {
      chat_id: chatId,
      photo,
    });

  /**
    * https://core.telegram.org/bots/api#deleteChatPhoto
    */
  deleteChatPhoto = (chatId: string) =>
    this._request('/deleteChatPhoto', {
      chat_id: chatId,
    });

  /**
    * https://core.telegram.org/bots/api#setChatTitle
    */
  setChatTitle = (chatId: string, title: string) =>
    this._request('/setChatTitle', {
      chat_id: chatId,
      title,
    });

  /**
    * https://core.telegram.org/bots/api#setChatDescription
    */
  setChatDescription = (chatId: string, description: string) =>
    this._request('/setChatDescription', {
      chat_id: chatId,
      description,
    });

  /**
    * https://core.telegram.org/bots/api#setchatstickerset
    */
  setChatStickerSet = (chatId: string, stickerSetName: string) =>
    this._request('/setChatStickerSet', {
      chat_id: chatId,
      sticker_set_name: stickerSetName,
    });

  /**
    * https://core.telegram.org/bots/api#deletechatstickerset
    */
  deleteChatStickerSet = (chatId: string) =>
    this._request('/deleteChatStickerSet', {
      chat_id: chatId,
    });

  /**
    * https://core.telegram.org/bots/api#pinChatMessage
    */
  pinChatMessage = (chatId: string, messageId: number, options?: Object) =>
    this._request('/pinChatMessage', {
      chat_id: chatId,
      messsage_id: messageId,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#unpinChatMessage
    */
  unpinChatMessage = (chatId: string) =>
    this._request('/unpinChatMessage', {
      chat_id: chatId,
    });

  /**
    * https://core.telegram.org/bots/api#leaveChat
    */
  leaveChat = (chatId: string) =>
    this._request('/leaveChat', {
      chat_id: chatId,
    });

  /**
    * https://core.telegram.org/bots/api#getchatmemberscount
    */
  forwardMessage = (
    chatId: string,
    fromChatId: string,
    messageId: string,
    options?: Object
  ) =>
    this._request('/forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options,
    });

  /**
      * https://core.telegram.org/bots/api#sendinvoice
      */
  sendInvoice = (
    chatId: string,
    product: {|
      title: string,
      description: string,
      payload: string,
      provider_token: string,
      start_parameter: string,
      currency: string,
      prices: Array<Object>,
    |},
    options?: Object
  ) =>
    this._request('/sendInvoice', {
      chat_id: chatId,
      ...product,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#answershippingquery
    */
  answerShippingQuery = (
    shippingQueryId: string,
    ok: boolean,
    options?: Object
  ) =>
    this._request('/answerShippingQuery', {
      shipping_query_id: shippingQueryId,
      ok,
      ...options,
    });

  /**
    * https://core.telegram.org/bots/api#answerprecheckoutquery
    */
  answerPreCheckoutQuery = (
    preCheckoutQueryId: string,
    ok: boolean,
    options?: Object
  ) =>
    this._request('/answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId,
      ok,
      ...options,
    });
}
