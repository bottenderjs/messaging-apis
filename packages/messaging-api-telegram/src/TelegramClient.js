/* @flow */
/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios from 'axios';

import type { ChatAction } from './TelegramTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type ClientConfig = {
  accessToken: string,
  origin?: string,
};

export default class TelegramClient {
  static connect(accessTokenOrConfig: string | ClientConfig): TelegramClient {
    return new TelegramClient(accessTokenOrConfig);
  }

  _token: string;

  _axios: Axios;

  constructor(accessTokenOrConfig: string | ClientConfig) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      origin = config.origin;
    } else {
      this._token = accessTokenOrConfig;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.telegram.org'}/bot${this._token}/`,
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

  async _request(...args: Array<any>) {
    try {
      const response = await this._axios.post(...args);

      const { data, config, request } = response;

      if (!data.ok) {
        throw new AxiosError(`Telegram API - ${data.description || ''}`, {
          config,
          request,
          response,
        });
      }

      return data.result;
    } catch (err) {
      if (err.response && err.response.data) {
        const { error_code, description } = err.response.data;
        const msg = `Telegram API - ${error_code} ${description || ''}`; // eslint-disable-line camelcase

        throw new AxiosError(msg, err);
      }
      throw new AxiosError(err.message, err);
    }
  }

  /**
   * https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(options?: Object) {
    return this._request('/getUpdates', {
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebhookInfo() {
    return this._request('/getWebhookInfo');
  }

  /**
   * https://core.telegram.org/bots/api#setwebhook
   */
  setWebhook(url: string) {
    return this._request('/setWebhook', {
      url,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebhook() {
    return this._request('/deleteWebhook');
  }

  /**
   * https://core.telegram.org/bots/api#getme
   */
  getMe() {
    return this._request('/getMe');
  }

  /**
   * https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos(userId: string, options?: Object) {
    return this._request('/getUserProfilePhotos', {
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getfile
   */
  getFile(fileId: string) {
    return (this._request('/getFile', {
      file_id: fileId,
    }): Object);
  }

  /**
   * Get link for file. This is extension method of getFile()
   */
  getFileLink(fileId: string) {
    return this.getFile(fileId).then(
      result =>
        `https://api.telegram.org/file/bot${this._token}/${result.file_path}`
    );
  }

  /**
   * https://core.telegram.org/bots/api#getchat
   */
  getChat(chatId: string) {
    return this._request('/getChat', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatAdministrators(chatId: string) {
    return this._request('/getChatAdministrators', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMembersCount(chatId: string) {
    return this._request('/getChatMembersCount', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMember(chatId: string, userId: string) {
    return this._request('/getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendmessage
   */
  sendMessage(chatId: string, text: string, options?: Object) {
    return this._request('/sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendphoto
   */
  sendPhoto(chatId: string, photo: string, options?: Object) {
    return this._request('/sendPhoto', {
      chat_id: chatId,
      photo,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendaudio
   */
  sendAudio(chatId: string, audio: string, options?: Object) {
    return this._request('/sendAudio', {
      chat_id: chatId,
      audio,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#senddocument
   */
  sendDocument(chatId: string, document: string, options?: Object) {
    return this._request('/sendDocument', {
      chat_id: chatId,
      document,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendsticker
   */
  sendSticker(chatId: string, sticker: string, options?: Object) {
    return this._request('/sendSticker', {
      chat_id: chatId,
      sticker,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvideo
   */
  sendVideo(chatId: string, video: string, options?: Object) {
    return this._request('/sendVideo', {
      chat_id: chatId,
      video,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvoice
   */
  sendVoice(chatId: string, voice: string, options?: Object) {
    return this._request('/sendVoice', {
      chat_id: chatId,
      voice,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvideonote
   */
  sendVideoNote(chatId: string, videoNote: string, options?: Object) {
    return this._request('/sendVideoNote', {
      chat_id: chatId,
      video_note: videoNote,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendmediagroup
   */
  sendMediaGroup(chatId: string, media: Array<Object>, options?: Object) {
    return this._request('/sendMediaGroup', {
      chat_id: chatId,
      media,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendlocation
   */
  sendLocation(
    chatId: string,
    { latitude, longitude }: {| latitude: number, longitude: number |},
    options?: Object
  ) {
    return this._request('/sendLocation', {
      chat_id: chatId,
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagelivelocation
   */
  editMessageLiveLocation(
    { latitude, longitude }: {| latitude: number, longitude: number |},
    options?: Object
  ) {
    return this._request('/editMessageLiveLocation', {
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation(identifier: Object) {
    return this._request('/stopMessageLiveLocation', {
      ...identifier,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvenue
   */
  sendVenue(
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
  ) {
    return this._request('/sendVenue', {
      chat_id: chatId,
      latitude,
      longitude,
      title,
      address,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendcontact
   */
  sendContact(
    chatId: string,
    {
      phone_number,
      first_name,
    }: {| phone_number: string, first_name: string |},
    options?: Object
  ) {
    return this._request('/sendContact', {
      chat_id: chatId,
      phone_number,
      first_name,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction(chatId: string, action: ChatAction) {
    return this._request('/sendChatAction', {
      chat_id: chatId,
      action,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagetext
   */
  editMessageText(text: string, options?: Object) {
    return this._request('/editMessageText', {
      text,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagecaption
   */
  editMessageCaption(caption: string, options?: Object) {
    return this._request('/editMessageCaption', {
      caption,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagereplymarkup
   */
  editMessageReplyMarkup(replyMarkup: Object, options?: Object) {
    return this._request('/editMessageReplyMarkup', {
      reply_markup: replyMarkup,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deletemessage
   */
  deleteMessage(chatId: string, messageId: string) {
    return this._request('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#kickchatmember
   */
  kickChatMember(chatId: string, userId: string, options?: Object) {
    return this._request('/kickChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#unbanChatMember
   */
  unbanChatMember(chatId: string, userId: string) {
    return this._request('/unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#restrictChatMember
   */
  restrictChatMember(chatId: string, userId: string, options?: Object) {
    return this._request('/restrictChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#promoteChatMember
   */
  promoteChatMember(chatId: string, userId: string, options?: Object) {
    return this._request('/promoteChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#exportChatInviteLink
   */
  exportChatInviteLink(chatId: string) {
    return this._request('/exportChatInviteLink', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatPhoto
   */
  setChatPhoto(chatId: string, photo: string) {
    return this._request('/setChatPhoto', {
      chat_id: chatId,
      photo,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deleteChatPhoto
   */
  deleteChatPhoto(chatId: string) {
    return this._request('/deleteChatPhoto', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatTitle
   */
  setChatTitle(chatId: string, title: string) {
    return this._request('/setChatTitle', {
      chat_id: chatId,
      title,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatDescription
   */
  setChatDescription(chatId: string, description: string) {
    return this._request('/setChatDescription', {
      chat_id: chatId,
      description,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setchatstickerset
   */
  setChatStickerSet(chatId: string, stickerSetName: string) {
    return this._request('/setChatStickerSet', {
      chat_id: chatId,
      sticker_set_name: stickerSetName,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deletechatstickerset
   */
  deleteChatStickerSet(chatId: string) {
    return this._request('/deleteChatStickerSet', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#pinChatMessage
   */
  pinChatMessage(chatId: string, messageId: number, options?: Object) {
    return this._request('/pinChatMessage', {
      chat_id: chatId,
      messsage_id: messageId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#unpinChatMessage
   */
  unpinChatMessage(chatId: string) {
    return this._request('/unpinChatMessage', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#leaveChat
   */
  leaveChat(chatId: string) {
    return this._request('/leaveChat', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  forwardMessage(
    chatId: string,
    fromChatId: string,
    messageId: string,
    options?: Object
  ) {
    return this._request('/forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendinvoice
   */
  sendInvoice(
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
  ) {
    return this._request('/sendInvoice', {
      chat_id: chatId,
      ...product,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#answershippingquery
   */
  answerShippingQuery(shippingQueryId: string, ok: boolean, options?: Object) {
    return this._request('/answerShippingQuery', {
      shipping_query_id: shippingQueryId,
      ok,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#answerprecheckoutquery
   */
  answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    options?: Object
  ) {
    return this._request('/answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId,
      ok,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#answerinlinequery
   */
  answerInlineQuery(
    inlineQueryId: string,
    results: Array<Object>,
    options?: Object
  ) {
    return this._request('/answerInlineQuery', {
      inline_query_id: inlineQueryId,
      results,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendgame
   */
  sendGame(chatId: string, gameShortName: string, options?: Object) {
    return this._request('/sendGame', {
      chat_id: chatId,
      game_short_name: gameShortName,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setgamescore
   */
  setGameScore(userId: string, score: number, options?: Object) {
    return this._request('/setGameScore', {
      user_id: userId,
      score,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getgamehighscores
   */
  getGameHighScores(userId: string, options?: Object) {
    return this._request('/getGameHighScores', {
      user_id: userId,
      ...options,
    });
  }
}
