/* eslint-disable camelcase */

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import camelCaseKeys from 'camelcase-keys';
import difference from 'lodash/difference';
import isObject from 'lodash/isObject';
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

      if (isObject(data.result)) {
        return camelCaseKeys(data.result, { deep: true });
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
   * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param latitude Latitude of new location
   * @param longitude Longitude of new location
   * @param options.chatId Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param options.messageId Required if inline_message_id is not specified. Identifier of the message to edit
   * @param options.inlineMessageId Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param options.replyMarkup A JSON-serialized object for a new inline keyboard.
   *
   * - https://core.telegram.org/bots/api#editmessagelivelocation
   */
  editMessageLiveLocation(
    { latitude, longitude }: { latitude: number; longitude: number },
    options: Type.EditMessageLiveLocationOption
  ): Promise<Type.Message | boolean> {
    return this._request('/editMessageLiveLocation', {
      latitude,
      longitude,
      ...options,
    });
  }

  /**
   * Use this method to stop updating a live location message before live_period expires. On success, if the message was sent by the bot, the sent Message is returned, otherwise True is returned.
   *
   * @param options.chatId Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param options.messageId Required if inline_message_id is not specified. Identifier of the message to edit
   * @param options.inlineMessageId Required if chat_id and message_id are not specified. Identifier of the inline message
   * @param options.replyMarkup A JSON-serialized object for a new inline keyboard.
   *
   * - https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation(
    options: Type.StopMessageLiveLocationOption
  ): Promise<Type.Message | boolean> {
    return this._request('/stopMessageLiveLocation', {
      ...options,
    });
  }

  /**
   * Use this method to send information about a venue. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param latitude Latitude of the venue
   * @param longitude Longitude of the venue
   * @param title Name of the venue
   * @param address Address of the venue
   * @param options Optional parameters for other parameters.
   *
   * - https://core.telegram.org/bots/api#sendvenue
   */
  sendVenue(
    chatId: string | number,
    // TODO: replace this parameter with Type.Venue
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
    options?: Type.SendVenueOption
  ): Promise<Type.Message> {
    return this._request('/sendVenue', {
      chatId,
      latitude,
      longitude,
      title,
      address,
      ...options,
    });
  }

  /**
   * Use this method to send phone contacts. On success, the sent Message is returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param requiredOptions.phoneNumber Contact's phone number
   * @param requiredOptions.firstName Contact's first name
   * @param options Optional parameters for other parameters.
   *
   * - https://core.telegram.org/bots/api#sendcontact
   */
  sendContact(
    chatId: string | number,
    requiredOptions: Type.SendContactRequiredOption,
    options?: Type.SendContactOption
  ): Promise<Type.Message> {
    return this._request('/sendContact', {
      chatId,
      ...requiredOptions,
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
   * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
   *
   * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
   *
   * - https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction(
    chatId: string | number,
    action: Type.ChatAction
  ): Promise<boolean> {
    return this._request('/sendChatAction', {
      chatId,
      action,
    });
  }

  /**
   * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
   *
   * @param userId Unique identifier of the target user
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos(
    userId: number,
    options?: Type.GetUserProfilePhotosOption
  ): Promise<Type.UserProfilePhotos> {
    return this._request('/getUserProfilePhotos', {
      userId,
      ...options,
    });
  }

  /**
   * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
   *
   * @param fileId File identifier to get info about
   *
   * - https://core.telegram.org/bots/api#getfile
   */
  getFile(fileId: string): Promise<Type.File> {
    return this._request('/getFile', {
      fileId,
    });
  }

  /**
   * Get link for file. This is extension method of getFile()
   */
  getFileLink(fileId: string): Promise<string> {
    return this.getFile(fileId).then(
      result =>
        `https://api.telegram.org/file/bot${this._token}/${result.filePath}`
    );
  }

  /**
   * Use this method to kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group. Otherwise members may only be removed by the group's creator or by the member that added them.
   *
   * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername)
   * @param userId Unique identifier of the target user
   * @param options.untilDate Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   *
   * - https://core.telegram.org/bots/api#kickchatmember
   */
  kickChatMember(
    chatId: string | number,
    userId: number,
    options?: Type.KickChatMemberOption
  ): Promise<boolean> {
    return this._request('/kickChatMember', {
      chatId,
      userId,
      ...options,
    });
  }

  /**
   * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. Returns True on success.
   *
   * @param chatId Unique identifier for the target group or username of the target supergroup or channel (in the format @username)
   * @param userId Unique identifier of the target user
   *
   * - https://core.telegram.org/bots/api#unbanchatmember
   */
  unbanChatMember(chatId: string | number, userId: number): Promise<boolean> {
    return this._request('/unbanChatMember', {
      chatId,
      userId,
    });
  }

  /**
   * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
   * @param userId Unique identifier of the target user
   * @param permissions New user permissions
   * @param options.untilDate Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   *
   * - https://core.telegram.org/bots/api#restrictchatmember
   */
  restrictChatMember(
    chatId: string | number,
    userId: number,
    permissions: Type.ChatPermissions,
    options?: Type.RestrictChatMemberOption
  ): Promise<boolean> {
    return this._request('/restrictChatMember', {
      chatId,
      userId,
      permissions,
      ...options,
    });
  }

  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param userId Unique identifier of the target user
   * @param options Options for other optional parameters
   *
   * - https://core.telegram.org/bots/api#promotechatmember
   */
  promoteChatMember(
    chatId: string | number,
    userId: number,
    options?: Type.PromoteChatMemberOption
  ): Promise<boolean> {
    return this._request('/promoteChatMember', {
      chatId,
      userId,
      ...options,
    });
  }

  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
   * @param permissions New default chat permissions
   *
   * - https://core.telegram.org/bots/api#setchatpermissions
   */
  setChatPermissions(
    chatId: string | number,
    permissions: Type.ChatPermissions
  ): Promise<boolean> {
    return this._request('/setChatPermissions', {
      chatId,
      permissions,
    });
  }

  /**
   * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns the new invite link as String on success.
   *
   * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink – after this the link will become available to the bot via the getChat method. If your bot needs to generate a new invite link replacing its previous one, use exportChatInviteLink again.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#exportchatinvitelink
   */
  exportChatInviteLink(chatId: string | number): Promise<string> {
    return this._request('/exportChatInviteLink', {
      chatId,
    });
  }

  /**
   * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param photo New chat photo, uploaded using multipart/form-data
   *
   * - https://core.telegram.org/bots/api#setchatphoto
   */
  // TODO: implement setChatPhoto

  /**
   * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#deletechatphoto
   */
  deleteChatPhoto(chatId: string | number): Promise<boolean> {
    return this._request('/deleteChatPhoto', {
      chatId,
    });
  }

  /**
   * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param title New chat title, 1-255 characters
   *
   * - https://core.telegram.org/bots/api#setchattitle
   */
  setChatTitle(chatId: string | number, title: string): Promise<boolean> {
    return this._request('/setChatTitle', {
      chatId,
      title,
    });
  }

  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param description New chat description, 0-255 characters
   *
   * - https://core.telegram.org/bots/api#setchatdescription
   */
  setChatDescription(
    chatId: string | number,
    description: string
  ): Promise<boolean> {
    return this._request('/setChatDescription', {
      chatId,
      description,
    });
  }

  /**
   * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param messageId Identifier of a message to pin
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#pinchatmessage
   */
  pinChatMessage(
    chatId: string | number,
    messageId: number,
    options?: Type.PinChatMessageOption
  ): Promise<boolean> {
    return this._request('/pinChatMessage', {
      chatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#unpinchatmessage
   */
  unpinChatMessage(chatId: string | number): Promise<boolean> {
    return this._request('/unpinChatMessage', {
      chatId,
    });
  }

  /**
   * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#leavechat
   */
  leaveChat(chatId: string | number): Promise<boolean> {
    return this._request('/leaveChat', {
      chatId,
    });
  }

  /**
   * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#getchat
   */
  getChat(chatId: string | number): Promise<Type.Chat> {
    return this._request('/getChat', {
      chatId,
    });
  }

  /**
   * Use this method to get a list of administrators in a chat. On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatAdministrators(chatId: string | number): Promise<Type.ChatMember[]> {
    return this._request('/getChatAdministrators', {
      chatId,
    });
  }

  /**
   * Use this method to get the number of members in a chat. Returns Int on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   *
   * - https://core.telegram.org/bots/api#getchatmemberscount
   */
  getChatMembersCount(chatId: string | number): Promise<number> {
    return this._request('/getChatMembersCount', {
      chatId,
    });
  }

  /**
   * Use this method to get information about a member of a chat. Returns a ChatMember object on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   * @param userId Unique identifier of the target user
   *
   * - https://core.telegram.org/bots/api#getchatmember
   */
  getChatMember(
    chatId: string | number,
    userId: number
  ): Promise<Type.ChatMember> {
    return this._request('/getChatMember', {
      chatId,
      userId,
    });
  }

  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
   * @param stickerSetName Name of the sticker set to be set as the group sticker set
   *
   * - https://core.telegram.org/bots/api#setchatstickerset
   */
  setChatStickerSet(
    chatId: string | number,
    stickerSetName: string
  ): Promise<boolean> {
    return this._request('/setChatStickerSet', {
      chat_id: chatId,
      stickerSetName,
    });
  }

  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
   *
   * @param chatId Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
   *
   * - https://core.telegram.org/bots/api#deletechatstickerset
   */
  deleteChatStickerSet(chatId: string | number): Promise<boolean> {
    return this._request('/deleteChatStickerSet', {
      chatId,
    });
  }

  /**
   * - https://core.telegram.org/bots/api#answercallbackquery
   */
  // TODO: implement answerCallbackQuery

  /**
   * Use this method to edit text and game messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param text New text of the message
   * @param options Options for other optional parameters.
   *
   * - https://core.telegram.org/bots/api#editmessagetext
   */
  editMessageText(
    text: string,
    options?: Type.EditMessageTextOption
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
