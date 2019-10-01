/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import difference from 'lodash/difference';
import omit from 'lodash.omit';
import pick from 'lodash/pick';
import snakeCaseKeys from 'snakecase-keys';
import snakecase from 'to-snake-case';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import * as Type from './TelegramTypes';

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

  _optionWithoutKeys(option: any, revmoeKeys: string[]): Record<string, any> {
    let keys = Object.keys(option);
    keys = difference(keys, revmoeKeys);
    keys = difference(keys, revmoeKeys.map(key => snakecase(key)));
    return pick(option, keys);
  }

  /**
   * Use this method to receive incoming updates using long polling. An Array of Update objects is returned.
   * - This method will not work if an outgoing webhook is set up.
   * - In order to avoid getting duplicate updates, recalculate offset after each server response.
   *
   * - https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(options?: Type.GetUpdatesOption): Promise<Type.Update[]> {
    return this._request('/getUpdates', {
      ...options,
    });
  }

  /**
   * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
   *
   * - https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebhookInfo(): Promise<Type.WebhookInfo> {
    return this._request('/getWebhookInfo');
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success.
   *
   * If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/<token>. Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
   *
   * - https://core.telegram.org/bots/api#setwebhook
   *
   * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration.
   * @param options.certificate not supported yet.
   * @param options.maxConnections Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40.
   * @param options.allowedUpdates List the types of updates you want your bot to receive.
   * @returns True on success.
   */
  setWebhook(
    url: string,
    options: Type.SetWebhookOption = {}
  ): Promise<boolean> {
    const optionsWithoutCertificate = this._optionWithoutKeys(options, [
      'certificate',
    ]);
    return this._request('/setWebhook', {
      url,
      ...optionsWithoutCertificate,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success. Requires no parameters.
   *
   * - https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebhook(): Promise<boolean> {
    return this._request('/deleteWebhook');
  }

  /**
   * - https://core.telegram.org/bots/api#getme
   */
  getMe(): Promise<Type.User> {
    return this._request('/getMe');
  }

  /**
   * Use this method to send text messages. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param text Text of the message to be sent
   * @param options Options for other optional parameters.
   * - https://core.telegram.org/bots/api#sendmessage
   */
  sendMessage(
    chatId: string | number,
    text: string,
    options?: Type.SendMessageOption
  ): Promise<Type.Message> {
    return this._request('/sendMessage', {
      chatId,
      text,
      ...options,
    });
  }

  /**
   * Use this method to forward messages of any kind. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param fromChatId Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
   * @param messageId Message identifier in the chat specified in from_chat_id
   * @param options.disableNotification Sends the message silently. Users will receive a notification with no sound
   * - https://core.telegram.org/bots/api#forwardmessage
   */
  forwardMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number,
    options?: Type.ForwardMessageOption
  ): Promise<Type.Message> {
    return this._request('/forwardMessage', {
      chatId,
      fromChatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to send photos. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a photo from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendphoto
   */
  sendPhoto(
    chatId: string | number,
    photo: string,
    options: Type.SendPhotoOption = {}
  ): Promise<Type.Message> {
    return this._request('/sendPhoto', {
      chatId,
      photo,
      ...options,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the sendVoice method instead.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an audio file from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendaudio
   */
  sendAudio(
    chatId: string | number,
    audio: string,
    options: Type.SendAudioOption = {}
  ): Promise<Type.Message> {
    const optionsWithoutThumb = pick(options, [
      'caption',
      'parse_mode',
      'parseMode',
      'duration',
      'performer',
      'title',
      'disable_notification',
      'disableNotification',
      'reply_to_message_id',
      'replyToMessageId',
      'reply_markup',
      'replyMarkup',
    ]);
    return this._request('/sendAudio', {
      chatId,
      audio,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#senddocument
   */
  sendDocument(
    chatId: string | number,
    document: string,
    options: Type.SendDocumentOption = {}
  ): Promise<Type.Message> {
    const optionsWithoutThumb = this._optionWithoutKeys(options, ['thumb']);

    return this._request('/sendDocument', {
      chat_id: chatId,
      document,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a video from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendvideo
   */
  sendVideo(
    chatId: string | number,
    video: string,
    options: Type.SendVideoOption = {}
  ): Promise<Type.Message> {
    const optionsWithoutThumb = this._optionWithoutKeys(options, ['thumb']);

    return this._request('/sendVideo', {
      chatId,
      video,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an animation from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendanimation
   */
  sendAnimation(
    chatId: string | number,
    animation: string,
    options: Type.SendAnimationOption = {}
  ): Promise<Type.Message> {
    const optionsWithoutThumb = this._optionWithoutKeys(options, ['thumb']);

    return this._request('/sendAnimation', {
      chatId,
      animation,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendvoice
   */
  sendVoice(
    chatId: string | number,
    voice: string,
    options: Type.SendVoiceOption = {}
  ): Promise<Type.Message> {
    return this._request('/sendVoice', {
      chatId,
      voice,
      ...options,
    });
  }

  /**
   * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param videoNote Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers. Sending video notes by a URL is currently unsupported. Upload file is not supported yet.
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendvideonote
   */
  sendVideoNote(
    chatId: string | number,
    videoNote: string,
    options: Type.SendVideoNoteOption = {}
  ): Promise<Type.Message> {
    const optionsWithoutThumb = this._optionWithoutKeys(options, ['thumb']);

    return this._request('/sendVideoNote', {
      chatId,
      videoNote,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send a group of photos or videos as an album. On success, an array of the sent Messages is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendmediagroup
   */
  sendMediaGroup(
    chatId: string | number,
    media: (Type.InputMediaPhoto | Type.InputMediaVideo)[],
    options?: Type.SendMediaGroupOption
  ): Promise<Type.Message[]> {
    const mediaWithoutThumb = media.map(m =>
      this._optionWithoutKeys(m, ['thumb'])
    );
    return this._request('/sendMediaGroup', {
      chatId,
      media: mediaWithoutThumb,
      ...options,
    });
  }

  /**
   * Use this method to send point on the map. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param latitude Latitude of the location
   * @param longitude Longitude of the location
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#sendlocation
   */
  sendLocation(
    chatId: string | number,
    { latitude, longitude }: { latitude: number; longitude: number },
    options?: Type.SendLocationOption
  ): Promise<Type.Message> {
    return this._request('/sendLocation', {
      chatId,
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#editmessagelivelocation
   */
  editMessageLiveLocation(
    { latitude, longitude }: { latitude: number; longitude: number },
    options?: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/editMessageLiveLocation', {
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation(
    identifier: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/stopMessageLiveLocation', {
      ...identifier,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#sendvenue
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
  ): Promise<Type.Message> {
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
   * - https://core.telegram.org/bots/api#sendcontact
   */
  sendContact(
    chatId: string,
    { phone_number, first_name }: { phone_number: string; first_name: string },
    options?: Record<string, any>
  ): Promise<Type.Message> {
    return this._request('/sendContact', {
      chat_id: chatId,
      phone_number,
      first_name,
      ...options,
    });
  }

  /**
   * Use this method to send a native poll. A native poll can't be sent to a private chat. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername). A native poll can't be sent to a private chat.
   * @param question Poll question, 1-255 characters
   * @param options List of answer options, 2-10 strings 1-100 characters each
   * @param otherOptions Optional parameters for other parameters.
   *
   * - https://core.telegram.org/bots/api#sendpoll
   */
  sendPoll(
    chatId: string | number,
    question: string,
    options: string[],
    otherOptions?: Type.SendPollOption
  ): Promise<Type.Message> {
    return this._request('/sendPoll', {
      chatId,
      question,
      options,
      ...otherOptions,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction(chatId: string, action: Type.ChatAction): Promise<boolean> {
    return this._request('/sendChatAction', {
      chat_id: chatId,
      action,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos(
    userId: string,
    options?: Record<string, any>
  ): Promise<Type.UserProfilePhotos> {
    return this._request('/getUserProfilePhotos', {
      user_id: userId,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getfile
   */
  getFile(fileId: string): Promise<Type.File> {
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
   * - https://core.telegram.org/bots/api#kickchatmember
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
   * - https://core.telegram.org/bots/api#unbanChatMember
   */
  unbanChatMember(chatId: string, userId: string): Promise<boolean> {
    return this._request('/unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#restrictChatMember
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
   * - https://core.telegram.org/bots/api#promoteChatMember
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
   * - https://core.telegram.org/bots/api#setchatpermissions
   */
  // TODO: implement setChatPermissions

  /**
   * - https://core.telegram.org/bots/api#exportChatInviteLink
   */
  exportChatInviteLink(chatId: string): Promise<string> {
    return this._request('/exportChatInviteLink', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#setChatPhoto
   */
  setChatPhoto(chatId: string, photo: string): Promise<boolean> {
    return this._request('/setChatPhoto', {
      chat_id: chatId,
      photo,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#deleteChatPhoto
   */
  deleteChatPhoto(chatId: string): Promise<boolean> {
    return this._request('/deleteChatPhoto', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#setChatTitle
   */
  setChatTitle(chatId: string, title: string): Promise<boolean> {
    return this._request('/setChatTitle', {
      chat_id: chatId,
      title,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#setChatDescription
   */
  setChatDescription(chatId: string, description: string): Promise<boolean> {
    return this._request('/setChatDescription', {
      chat_id: chatId,
      description,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#pinChatMessage
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
   * - https://core.telegram.org/bots/api#unpinChatMessage
   */
  unpinChatMessage(chatId: string): Promise<boolean> {
    return this._request('/unpinChatMessage', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#leaveChat
   */
  leaveChat(chatId: string): Promise<boolean> {
    return this._request('/leaveChat', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getchat
   */
  getChat(chatId: string): Promise<Type.Chat> {
    return this._request('/getChat', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatAdministrators(chatId: string): Promise<Type.ChatMember[]> {
    return this._request('/getChatAdministrators', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMembersCount(chatId: string): Promise<number> {
    return this._request('/getChatMembersCount', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getchatmember
   */
  getChatMember(chatId: string, userId: number): Promise<Type.ChatMember> {
    return this._request('/getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#setchatstickerset
   */
  setChatStickerSet(chatId: string, stickerSetName: string): Promise<boolean> {
    return this._request('/setChatStickerSet', {
      chat_id: chatId,
      sticker_set_name: stickerSetName,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#deletechatstickerset
   */
  deleteChatStickerSet(chatId: string): Promise<boolean> {
    return this._request('/deleteChatStickerSet', {
      chat_id: chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#answercallbackquery
   */
  // TODO: implement answerCallbackQuery

  /**
   * - https://core.telegram.org/bots/api#editmessagetext
   */
  editMessageText(
    text: string,
    options?: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/editMessageText', {
      text,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#editmessagecaption
   */
  editMessageCaption(
    caption: string,
    options?: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/editMessageCaption', {
      caption,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#editmessagemedia
   */
  // TODO: implement editMessageMedia

  /**
   * - https://core.telegram.org/bots/api#editmessagereplymarkup
   */
  editMessageReplyMarkup(
    replyMarkup: Record<string, any>,
    options?: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/editMessageReplyMarkup', {
      reply_markup: replyMarkup,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#stoppoll
   */
  // TODO: implement stopPoll

  /**
   * - https://core.telegram.org/bots/api#deletemessage
   */
  deleteMessage(chatId: string, messageId: number): Promise<boolean> {
    return this._request('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#sendsticker
   */
  sendSticker(
    chatId: string,
    sticker: string,
    options?: Record<string, any>
  ): Promise<Type.Message> {
    return this._request('/sendSticker', {
      chat_id: chatId,
      sticker,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getstickerset
   */
  // TODO: implement getStickerSet

  /**
   * - https://core.telegram.org/bots/api#uploadstickerfile
   */
  // TODO: implement uploadStickerFile

  /**
   * - https://core.telegram.org/bots/api#createnewstickerset
   */
  // TODO: implement createNewStickerSet

  /**
   * - https://core.telegram.org/bots/api#addstickertoset
   */
  // TODO: implement addStickerToSet

  /**
   * - https://core.telegram.org/bots/api#setstickerpositioninset
   */
  // TODO: implement setStickerPositionInSet

  /**
   * - https://core.telegram.org/bots/api#deletestickerfromset
   */
  // TODO: implement deleteStickerFromSet

  /**
   * - https://core.telegram.org/bots/api#answerinlinequery
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
   * - https://core.telegram.org/bots/api#sendinvoice
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
  ): Promise<Type.Message> {
    return this._request('/sendInvoice', {
      chat_id: chatId,
      ...product,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#answershippingquery
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
   * - https://core.telegram.org/bots/api#answerprecheckoutquery
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
   * - https://core.telegram.org/bots/api#setpassportdataerrors
   */
  // TODO: implement setPassportDataErrors

  /**
   * - https://core.telegram.org/bots/api#sendgame
   */
  sendGame(
    chatId: string,
    gameShortName: string,
    options?: Record<string, any>
  ): Promise<Type.Message> {
    return this._request('/sendGame', {
      chat_id: chatId,
      game_short_name: gameShortName,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#setgamescore
   */
  setGameScore(
    userId: string,
    score: number,
    options?: Record<string, any>
  ): Promise<Type.Message | boolean> {
    return this._request('/setGameScore', {
      user_id: userId,
      score,
      ...options,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#getgamehighscores
   */
  getGameHighScores(
    userId: string,
    options?: Record<string, any>
  ): Promise<Type.GameHighScore[]> {
    return this._request('/getGameHighScores', {
      user_id: userId,
      ...options,
    });
  }
}
