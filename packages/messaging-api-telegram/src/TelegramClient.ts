/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import omit from 'lodash.omit';
import pick from 'lodash/pick';
import snakeCaseKeys from 'snakecase-keys';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import {
  Chat,
  ChatAction,
  ChatMember,
  File,
  GameHighScore,
  Message,
  SetWebhookOption,
  Update,
  User,
  UserProfilePhotos,
  WebhookInfo,
} from './TelegramTypes';

type ClientConfig = {
  accessToken: string;
  origin?: string;
  onRequest?: Function;
};

export default class TelegramClient {
  static connect(accessTokenOrConfig: string | ClientConfig): TelegramClient {
    return new TelegramClient(accessTokenOrConfig);
  }

  _token: string;

  _onRequest: Function;

  _axios: AxiosInstance;

  constructor(accessTokenOrConfig: string | ClientConfig) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._token = accessTokenOrConfig;
      this._onRequest = onRequest;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.telegram.org'}/bot${this._token}/`,
      headers: {
        'Content-Type': 'application/json',
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

  async _request(path: string, body: Record<string, any> = {}) {
    try {
      const response = await this._axios.post(path, snakeCaseKeys(body));

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
        const msg = `Telegram API - ${error_code} ${description || ''}`;

        throw new AxiosError(msg, err);
      }
      throw new AxiosError(err.message, err);
    }
  }

  /**
   * https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(options?: Record<string, any>): Promise<Update[]> {
    return this._request('/getUpdates', {
      ...options,
    });
  }

  /**
   * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
   *
   * https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebhookInfo(): Promise<WebhookInfo> {
    return this._request('/getWebhookInfo');
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success.
   *
   * If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/<token>. Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
   *
   * https://core.telegram.org/bots/api#setwebhook
   *
   * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration.
   * @param options.certificate not supported yet.
   * @param options.maxConnections Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40.
   * @param options.allowedUpdates List the types of updates you want your bot to receive.
   * @returns True on success.
   */
  setWebhook(url: string, options: SetWebhookOption = {}): Promise<boolean> {
    const optionsWithoutCertificate = pick(options, [
      'max_connections',
      'allowed_updates',
      'maxConnections',
      'allowedUpdates',
    ]);
    return this._request('/setWebhook', {
      url,
      ...optionsWithoutCertificate,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success. Requires no parameters.
   *
   * https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebhook(): Promise<boolean> {
    return this._request('/deleteWebhook');
  }

  /**
   * https://core.telegram.org/bots/api#getme
   */
  getMe(): Promise<User> {
    return this._request('/getMe');
  }

  /**
   * https://core.telegram.org/bots/api#sendmessage
   */
  sendMessage(
    chatId: string,
    text: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  forwardMessage(
    chatId: string,
    fromChatId: string,
    messageId: number,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendphoto
   */
  sendPhoto(
    chatId: string,
    photo: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendPhoto', {
      chat_id: chatId,
      photo,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendaudio
   */
  sendAudio(
    chatId: string,
    audio: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendAudio', {
      chat_id: chatId,
      audio,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#senddocument
   */
  sendDocument(
    chatId: string,
    document: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendDocument', {
      chat_id: chatId,
      document,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvideo
   */
  sendVideo(
    chatId: string,
    video: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendVideo', {
      chat_id: chatId,
      video,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendanimation
   */
  // TODO: implement sendAnimation

  /**
   * https://core.telegram.org/bots/api#sendvoice
   */
  sendVoice(
    chatId: string,
    voice: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendVoice', {
      chat_id: chatId,
      voice,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendvideonote
   */
  sendVideoNote(
    chatId: string,
    videoNote: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendVideoNote', {
      chat_id: chatId,
      video_note: videoNote,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendmediagroup
   */
  sendMediaGroup(
    chatId: string,
    media: Record<string, any>[],
    options?: Record<string, any>
  ): Promise<Message[]> {
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
    { latitude, longitude }: { latitude: number; longitude: number },
    options?: Record<string, any>
  ): Promise<Message> {
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
    { latitude, longitude }: { latitude: number; longitude: number },
    options?: Record<string, any>
  ): Promise<Message | boolean> {
    return this._request('/editMessageLiveLocation', {
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation(
    identifier: Record<string, any>
  ): Promise<Message | boolean> {
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
    }: {
      latitude: number;
      longitude: number;
      title: string;
      address: string;
    },
    options?: Record<string, any>
  ): Promise<Message> {
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
    { phone_number, first_name }: { phone_number: string; first_name: string },
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendContact', {
      chat_id: chatId,
      phone_number,
      first_name,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendpoll
   */
  // TODO: implement sendPoll

  /**
   * https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction(chatId: string, action: ChatAction): Promise<boolean> {
    return this._request('/sendChatAction', {
      chat_id: chatId,
      action,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos(
    userId: string,
    options?: Record<string, any>
  ): Promise<UserProfilePhotos> {
    return this._request('/getUserProfilePhotos', {
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getfile
   */
  getFile(fileId: string): Promise<File> {
    return this._request('/getFile', {
      file_id: fileId,
    });
  }

  /**
   * Get link for file. This is extension method of getFile()
   */
  getFileLink(fileId: string): Promise<string> {
    return this.getFile(fileId).then(
      result =>
        `https://api.telegram.org/file/bot${this._token}/${result.file_path}`
    );
  }

  /**
   * https://core.telegram.org/bots/api#kickchatmember
   */
  kickChatMember(
    chatId: string,
    userId: string,
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/kickChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#unbanChatMember
   */
  unbanChatMember(chatId: string, userId: string): Promise<boolean> {
    return this._request('/unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#restrictChatMember
   */
  restrictChatMember(
    chatId: string,
    userId: string,
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/restrictChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#promoteChatMember
   */
  promoteChatMember(
    chatId: string,
    userId: string,
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/promoteChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setchatpermissions
   */
  // TODO: implement setChatPermissions

  /**
   * https://core.telegram.org/bots/api#exportChatInviteLink
   */
  exportChatInviteLink(chatId: string): Promise<string> {
    return this._request('/exportChatInviteLink', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatPhoto
   */
  setChatPhoto(chatId: string, photo: string): Promise<boolean> {
    return this._request('/setChatPhoto', {
      chat_id: chatId,
      photo,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deleteChatPhoto
   */
  deleteChatPhoto(chatId: string): Promise<boolean> {
    return this._request('/deleteChatPhoto', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatTitle
   */
  setChatTitle(chatId: string, title: string): Promise<boolean> {
    return this._request('/setChatTitle', {
      chat_id: chatId,
      title,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setChatDescription
   */
  setChatDescription(chatId: string, description: string): Promise<boolean> {
    return this._request('/setChatDescription', {
      chat_id: chatId,
      description,
    });
  }

  /**
   * https://core.telegram.org/bots/api#pinChatMessage
   */
  pinChatMessage(
    chatId: string,
    messageId: number,
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/pinChatMessage', {
      chat_id: chatId,
      messsage_id: messageId,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#unpinChatMessage
   */
  unpinChatMessage(chatId: string): Promise<boolean> {
    return this._request('/unpinChatMessage', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#leaveChat
   */
  leaveChat(chatId: string): Promise<boolean> {
    return this._request('/leaveChat', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchat
   */
  getChat(chatId: string): Promise<Chat> {
    return this._request('/getChat', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatAdministrators(chatId: string): Promise<ChatMember[]> {
    return this._request('/getChatAdministrators', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMembersCount(chatId: string): Promise<number> {
    return this._request('/getChatMembersCount', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getchatmember
   */
  getChatMember(chatId: string, userId: number): Promise<ChatMember> {
    return this._request('/getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setchatstickerset
   */
  setChatStickerSet(chatId: string, stickerSetName: string): Promise<boolean> {
    return this._request('/setChatStickerSet', {
      chat_id: chatId,
      sticker_set_name: stickerSetName,
    });
  }

  /**
   * https://core.telegram.org/bots/api#deletechatstickerset
   */
  deleteChatStickerSet(chatId: string): Promise<boolean> {
    return this._request('/deleteChatStickerSet', {
      chat_id: chatId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#answercallbackquery
   */
  // TODO: implement answerCallbackQuery

  /**
   * https://core.telegram.org/bots/api#editmessagetext
   */
  editMessageText(
    text: string,
    options?: Record<string, any>
  ): Promise<Message | boolean> {
    return this._request('/editMessageText', {
      text,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagecaption
   */
  editMessageCaption(
    caption: string,
    options?: Record<string, any>
  ): Promise<Message | boolean> {
    return this._request('/editMessageCaption', {
      caption,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#editmessagemedia
   */
  // TODO: implement editMessageMedia

  /**
   * https://core.telegram.org/bots/api#editmessagereplymarkup
   */
  editMessageReplyMarkup(
    replyMarkup: Record<string, any>,
    options?: Record<string, any>
  ): Promise<Message | boolean> {
    return this._request('/editMessageReplyMarkup', {
      reply_markup: replyMarkup,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#stoppoll
   */
  // TODO: implement stopPoll

  /**
   * https://core.telegram.org/bots/api#deletemessage
   */
  deleteMessage(chatId: string, messageId: number): Promise<boolean> {
    return this._request('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendsticker
   */
  sendSticker(
    chatId: string,
    sticker: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendSticker', {
      chat_id: chatId,
      sticker,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getstickerset
   */
  // TODO: implement getStickerSet

  /**
   * https://core.telegram.org/bots/api#uploadstickerfile
   */
  // TODO: implement uploadStickerFile

  /**
   * https://core.telegram.org/bots/api#createnewstickerset
   */
  // TODO: implement createNewStickerSet

  /**
   * https://core.telegram.org/bots/api#addstickertoset
   */
  // TODO: implement addStickerToSet

  /**
   * https://core.telegram.org/bots/api#setstickerpositioninset
   */
  // TODO: implement setStickerPositionInSet

  /**
   * https://core.telegram.org/bots/api#deletestickerfromset
   */
  // TODO: implement deleteStickerFromSet

  /**
   * https://core.telegram.org/bots/api#answerinlinequery
   */
  answerInlineQuery(
    inlineQueryId: string,
    results: Record<string, any>[],
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/answerInlineQuery', {
      inline_query_id: inlineQueryId,
      results,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#sendinvoice
   */
  sendInvoice(
    chatId: string,
    product: {
      title: string;
      description: string;
      payload: string;
      provider_token: string;
      start_parameter: string;
      currency: string;
      prices: Record<string, any>[];
    },
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendInvoice', {
      chat_id: chatId,
      ...product,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#answershippingquery
   */
  answerShippingQuery(
    shippingQueryId: string,
    ok: boolean,
    options?: Record<string, any>
  ): Promise<boolean> {
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
    options?: Record<string, any>
  ): Promise<boolean> {
    return this._request('/answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId,
      ok,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setpassportdataerrors
   */
  // TODO: implement setPassportDataErrors

  /**
   * https://core.telegram.org/bots/api#sendgame
   */
  sendGame(
    chatId: string,
    gameShortName: string,
    options?: Record<string, any>
  ): Promise<Message> {
    return this._request('/sendGame', {
      chat_id: chatId,
      game_short_name: gameShortName,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#setgamescore
   */
  setGameScore(
    userId: string,
    score: number,
    options?: Record<string, any>
  ): Promise<Message | boolean> {
    return this._request('/setGameScore', {
      user_id: userId,
      score,
      ...options,
    });
  }

  /**
   * https://core.telegram.org/bots/api#getgamehighscores
   */
  getGameHighScores(
    userId: string,
    options?: Record<string, any>
  ): Promise<GameHighScore[]> {
    return this._request('/getGameHighScores', {
      user_id: userId,
      ...options,
    });
  }
}
