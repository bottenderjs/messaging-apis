import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import difference from 'lodash/difference';
import invariant from 'ts-invariant';
import isPlainObject from 'lodash/isPlainObject';
import pick from 'lodash/pick';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecase,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as TelegramTypes from './TelegramTypes';

export default class TelegramClient {
  /**
   * @deprecated Use `new TelegramClient(...)` instead.
   */
  static connect(config: TelegramTypes.ClientConfig): TelegramClient {
    warning(
      false,
      '`TelegramClient.connect(...)` is deprecated. Use `new TelegramClient(...)` instead.'
    );
    return new TelegramClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The access token used by the client.
   */
  readonly accessToken: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: TelegramTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `TelegramClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    this.onRequest = config.onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://api.telegram.org'}/bot${
        this.accessToken
      }/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this.onRequest,
      })
    );
  }

  private async request(path: string, body: Record<string, any> = {}) {
    try {
      const response = await this.axios.post(path, snakecaseKeysDeep(body));

      const { data, config, request } = response;

      if (!data.ok) {
        throw new AxiosError(`Telegram API - ${data.description || ''}`, {
          config,
          request,
          response,
        });
      }

      if (isPlainObject(data.result) || Array.isArray(data.result)) {
        return camelcaseKeysDeep(data.result);
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

  private optionWithoutKeys(
    option: any,
    removeKeys: string[]
  ): Record<string, any> {
    let keys = Object.keys(option);
    keys = difference(keys, removeKeys);
    keys = difference(
      keys,
      removeKeys.map((key) => snakecase(key))
    );
    return pick(option, keys);
  }

  /**
   * Use this method to receive incoming updates using long polling.
   * - This method will not work if an outgoing webhook is set up.
   * - In order to avoid getting duplicate updates, recalculate offset after each server response.
   *
   * @param options - Optional parameters.
   * @param options.offset - Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned.
   * @param options.limit - Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.
   * @param options.timeout - Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
   * @param options.allowedUpdates - A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   * @returns An array of [Update](https://core.telegram.org/bots/api#update) objects is returned.
   *
   * @see https://core.telegram.org/bots/api#getupdates
   *
   * @example
   *
   * ```js
   * await client.getUpdates({ limit: 10 });
   * // [
   * //   {
   * //     updateId: 513400512,
   * //     message: {
   * //     messageId: 3,
   * //     from: {
   * //       id: 313534466,
   * //       firstName: 'first',
   * //       lastName: 'last',
   * //       username: 'username',
   * //     },
   * //     chat: {
   * //       id: 313534466,
   * //       firstName: 'first',
   * //       lastName: 'last',
   * //       username: 'username',
   * //       type: 'private',
   * //     },
   * //     date: 1499402829,
   * //     text: 'hi',
   * //   },
   * // },
   * // ...
   * // ]
   * ```
   */
  getUpdates(
    options?: TelegramTypes.GetUpdatesOption
  ): Promise<TelegramTypes.Update[]> {
    return this.request('/getUpdates', {
      ...options,
    });
  }

  /**
   * Use this method to get current webhook status.
   *
   * @returns On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
   *
   * @see https://core.telegram.org/bots/api#getwebhookinfo
   *
   * @example
   *
   * ```js
   * await client.getWebhookInfo();
   * // {
   * //   url: 'https://4a16faff.ngrok.io/',
   * //   hasCustomCertificate: false,
   * //   pendingUpdateCount: 0,
   * //   maxConnections: 40,
   * // }
   * ```
   */
  getWebhookInfo(): Promise<TelegramTypes.WebhookInfo> {
    return this.request('/getWebhookInfo');
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
   *
   * If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/<token>. Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
   *
   * @param url - HTTPS url to send updates to. Use an empty string to remove webhook integration.
   * @param options - Optional parameters.
   * @param options.certificate - not supported yet.
   * @param options.maxConnections - Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40.
   * @param options.allowedUpdates - List the types of updates you want your bot to receive.
   * @returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setwebhook
   *
   * @example
   *
   * ```js
   * await client.setWebhook('https://4a16faff.ngrok.io/');
   * ```
   */
  setWebhook(
    url: string,
    options: TelegramTypes.SetWebhookOption = {}
  ): Promise<boolean> {
    const optionsWithoutCertificate = this.optionWithoutKeys(options, [
      'certificate',
    ]);
    return this.request('/setWebhook', {
      url,
      ...optionsWithoutCertificate,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates.
   *
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletewebhook
   *
   * @example
   *
   * ```js
   * await client.deleteWebhook();
   * ```
   */
  deleteWebhook(): Promise<boolean> {
    return this.request('/deleteWebhook');
  }

  /**
   * A simple method for testing your bot's auth token.
   *
   * @returns Returns basic information about the bot in form of a User object.
   *
   * @see https://core.telegram.org/bots/api#getme
   *
   * @example
   *
   * ```js
   * await client.getMe();
   * // {
   * //   id: 313534466,
   * //   firstName: 'first',
   * //   username: 'a_bot'
   * // }
   * ```
   */
  getMe(): Promise<TelegramTypes.User> {
    return this.request('/getMe');
  }

  /**
   * Use this method to send text messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param text - Text of the message to be sent.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendmessage
   *
   * @example
   *
   * ```js
   * await client.sendMessage(CHAT_ID, 'hi', {
   *   disableWebPagePreview: true,
   *   disableNotification: true,
   * });
   * ```
   */
  sendMessage(
    chatId: string | number,
    text: string,
    options?: TelegramTypes.SendMessageOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendMessage', {
      chatId,
      text,
      ...options,
    });
  }

  /**
   * Use this method to forward messages of any kind.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param fromChatId - Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   * @param messageId - Message identifier in the chat specified in fromChatId
   * @param options - Options for other optional parameters.
   * @param options.disableNotification - Sends the message silently. Users will receive a notification with no sound
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#forwardmessage
   *
   * @example
   *
   * ```js
   * await client.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID, {
   *   disableNotification: true,
   * });
   * ```
   */
  forwardMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number,
    options?: TelegramTypes.ForwardMessageOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/forwardMessage', {
      chatId,
      fromChatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to send photos.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a photo from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendphoto
   *
   * @example
   *
   * ```js
   * await client.sendPhoto(CHAT_ID, 'https://example.com/image.png', {
   *   caption: 'gooooooodPhoto',
   *   disableNotification: true,
   * });
   * ```
   */
  sendPhoto(
    chatId: string | number,
    photo: string,
    options: TelegramTypes.SendPhotoOption = {}
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendPhoto', {
      chatId,
      photo,
      ...options,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the sendVoice method instead.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param audio -Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an audio file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendaudio
   *
   * @example
   *
   * ```js
   * await client.sendAudio(CHAT_ID, 'https://example.com/audio.mp3', {
   *   caption: 'gooooooodAudio',
   *   disableNotification: true,
   * });
   * ```
   */
  sendAudio(
    chatId: string | number,
    audio: string,
    options: TelegramTypes.SendAudioOption = {}
  ): Promise<TelegramTypes.Message> {
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
    return this.request('/sendAudio', {
      chatId,
      audio,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#senddocument
   *
   * @example
   *
   * ```js
   * await client.sendDocument(CHAT_ID, 'https://example.com/doc.gif', {
   *   caption: 'gooooooodDocument',
   *   disableNotification: true,
   * });
   * ```
   */
  sendDocument(
    chatId: string | number,
    document: string,
    options: TelegramTypes.SendDocumentOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendDocument', {
      chatId,
      document,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a video from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvideo
   *
   * @example
   *
   * ```js
   * await client.sendVideo(CHAT_ID, 'https://example.com/video.mp4', {
   *   caption: 'gooooooodVideo',
   *   disableNotification: true,
   * });
   * ```
   */
  sendVideo(
    chatId: string | number,
    video: string,
    options: TelegramTypes.SendVideoOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendVideo', {
      chatId,
      video,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param animation - Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an animation from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendanimation
   *
   * @example
   *
   * ```js
   * ```
   */
  sendAnimation(
    chatId: string | number,
    animation: string,
    options: TelegramTypes.SendAnimationOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendAnimation', {
      chatId,
      animation,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param voice - Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvoice
   *
   * @example
   *
   * ```js
   * await client.sendVoice(CHAT_ID, 'https://example.com/voice.ogg', {
   *   caption: 'gooooooodVoice',
   *   disableNotification: true,
   * });
   * ```
   */
  sendVoice(
    chatId: string | number,
    voice: string,
    options: TelegramTypes.SendVoiceOption = {}
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendVoice', {
      chatId,
      voice,
      ...options,
    });
  }

  /**
   * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param videoNote - Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers. Sending video notes by a URL is currently unsupported. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvideonote
   *
   * @example
   *
   * ```js
   * await client.sendVideoNote(CHAT_ID, 'https://example.com/video_note.mp4', {
   *   duration: 40,
   *   disableNotification: true,
   * });
   * ```
   */
  sendVideoNote(
    chatId: string | number,
    videoNote: string,
    options: TelegramTypes.SendVideoNoteOption = {}
  ): Promise<TelegramTypes.Message> {
    const optionsWithoutThumb = this.optionWithoutKeys(options, ['thumb']);

    return this.request('/sendVideoNote', {
      chatId,
      videoNote,
      ...optionsWithoutThumb,
    });
  }

  /**
   * Use this method to send a group of photos or videos as an album.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param media - A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
   * @param options - Options for other optional parameters.
   * @returns On success, an array of the sent Messages is returned.
   *
   * @see https://core.telegram.org/bots/api#sendmediagroup
   *
   * @example
   *
   * ```js
   * await client.sendMediaGroup(CHAT_ID, [
   *   { type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' },
   * ]);
   * ```
   */
  sendMediaGroup(
    chatId: string | number,
    media: (TelegramTypes.InputMediaPhoto | TelegramTypes.InputMediaVideo)[],
    options?: TelegramTypes.SendMediaGroupOption
  ): Promise<TelegramTypes.Message[]> {
    const mediaWithoutThumb = media.map((m) =>
      this.optionWithoutKeys(m, ['thumb'])
    );
    return this.request('/sendMediaGroup', {
      chatId,
      media: mediaWithoutThumb,
      ...options,
    });
  }

  /**
   * Use this method to send point on the map.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param location - Object contains latitude and longitude.
   * @param location.latitude - Latitude of the location.
   * @param location.longitude - Longitude of the location.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendlocation
   *
   * @example
   *
   * ```js
   * await client.sendLocation(
   *   CHAT_ID,
   *   {
   *     latitude: 30,
   *     longitude: 45,
   *   },
   *   {
   *     disableNotification: true,
   *   }
   * );
   * ```
   */
  sendLocation(
    chatId: string | number,
    location: { latitude: number; longitude: number },
    options?: TelegramTypes.SendLocationOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendLocation', {
      chatId,
      latitude: location.latitude,
      longitude: location.longitude,
      ...options,
    });
  }

  /**
   * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param location - Object contains new latitude and longitude.
   * @param location.latitude - Latitude of new location
   * @param location.longitude - Longitude of new location
   * @param options - One of chatId, messageId or inlineMessageId is required.
   * @param options.chatId - Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param options.messageId - Required if inlineMessageId is not specified. Identifier of the message to edit
   * @param options.inlineMessageId - Required if chatId and messageId are not specified. Identifier of the inline message
   * @param options.replyMarkup - A JSON-serialized object for a new inline keyboard.
   *
   * @see https://core.telegram.org/bots/api#editmessagelivelocation
   *
   * @example
   *
   * ```js
   * await client.editMessageLiveLocation(
   *   {
   *     latitude: 30,
   *     longitude: 45,
   *   },
   *   {
   *     messageId: MESSAGE_ID,
   *   }
   * );
   * ```
   */
  editMessageLiveLocation(
    location: { latitude: number; longitude: number },
    options: TelegramTypes.EditMessageLiveLocationOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageLiveLocation', {
      latitude: location.latitude,
      longitude: location.longitude,
      ...options,
    });
  }

  /**
   * Use this method to stop updating a live location message before live_period expires. On success, if the message was sent by the bot, the sent Message is returned, otherwise True is returned.
   *
   * @param options - One of chatId, messageId or inlineMessageId is required.
   * @param options.chatId - Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param options.messageId - Required if inlineMessageId is not specified. Identifier of the message to edit
   * @param options.inlineMessageId - Required if chatId and messageId are not specified. Identifier of the inline message
   * @param options.replyMarkup - A JSON-serialized object for a new inline keyboard.
   *
   * @see https://core.telegram.org/bots/api#stopmessagelivelocation
   *
   * @example
   *
   * ```js
   * await client.stopMessageLiveLocation({ messageId: MESSAGE_ID });
   * ```
   */
  stopMessageLiveLocation(
    options: TelegramTypes.StopMessageLiveLocationOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/stopMessageLiveLocation', {
      ...options,
    });
  }

  /**
   * Use this method to send information about a venue.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param venue - Object contains information of the venue.
   * @param venue.latitude - Latitude of the venue
   * @param venue.longitude - Longitude of the venue
   * @param venue.title - Name of the venue
   * @param venue.address - Address of the venue
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendvenue
   *
   * @example
   *
   * ```js
   * await client.sendVenue(
   *   CHAT_ID,
   *   {
   *     latitude: 30,
   *     longitude: 45,
   *     title: 'a_title',
   *     address: 'an_address',
   *   },
   *   {
   *     disableNotification: true,
   *   }
   * );
   * ```
   */
  sendVenue(
    chatId: string | number,
    venue: TelegramTypes.Venue,
    options?: TelegramTypes.SendVenueOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendVenue', {
      chatId,
      ...venue,
      ...options,
    });
  }

  /**
   * Use this method to send phone contacts.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param requiredOption.phoneNumber - Contact's phone number
   * @param requiredOption.firstName - Contact's first name
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendcontact
   *
   * @example
   *
   * ```js
   * await client.sendContact(
   *   CHAT_ID,
   *   {
   *     phoneNumber: '886123456789',
   *     firstName: 'first',
   *   },
   *   { lastName: 'last' }
   * );
   * ```
   */
  sendContact(
    chatId: string | number,
    requiredOption: TelegramTypes.SendContactRequiredOption,
    options?: TelegramTypes.SendContactOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendContact', {
      chatId,
      ...requiredOption,
      ...options,
    });
  }

  /**
   * Use this method to send a native poll. A native poll can't be sent to a private chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). A native poll can't be sent to a private chat.
   * @param question - Poll question, 1-255 characters
   * @param options - List of answer options, 2-10 strings 1-100 characters each
   * @param otherOptions - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendpoll
   *
   * @example
   *
   * ```js
   * ```
   */
  sendPoll(
    chatId: string | number,
    question: string,
    options: string[],
    otherOptions?: TelegramTypes.SendPollOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendPoll', {
      chatId,
      question,
      options,
      ...otherOptions,
    });
  }

  /**
   * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
   *
   * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param action - Types of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
   * @param Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#sendchataction
   *
   * @example
   *
   * ```js
   * await client.sendChatAction(CHAT_ID, 'typing');
   * ```
   */
  sendChatAction(
    chatId: string | number,
    action: TelegramTypes.ChatAction
  ): Promise<boolean> {
    return this.request('/sendChatAction', {
      chatId,
      action,
    });
  }

  /**
   * Use this method to get a list of profile pictures for a user.
   *
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters.
   * @returns Returns a UserProfilePhotos object.
   *
   * @see https://core.telegram.org/bots/api#getuserprofilephotos
   *
   * @example
   *
   * ```js
   * await client.getUserProfilePhotos(USER_ID, { limit: 1 });
   * // {
   * //   totalCount: 3,
   * //   photos: [
   * //     [
   * //       {
   * //         fileId:
   * //           'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
   * //         fileSize: 14650,
   * //         width: 160,
   * //         height: 160,
   * //       },
   * //       {
   * //         fileId:
   * //           'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
   * //         fileSize: 39019,
   * //         width: 320,
   * //         height: 320,
   * //       },
   * //       {
   * //         fileId:
   * //           'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
   * //         fileSize: 132470,
   * //         width: 640,
   * //         height: 640,
   * //       },
   * //     ],
   * //   ],
   * // }
   * ```
   */
  getUserProfilePhotos(
    userId: number,
    options?: TelegramTypes.GetUserProfilePhotosOption
  ): Promise<TelegramTypes.UserProfilePhotos> {
    return this.request('/getUserProfilePhotos', {
      userId,
      ...options,
    });
  }

  /**
   * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size.
   *
   * @param fileId - File identifier to get info about
   * @returns On success, a File object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
   *
   * @see https://core.telegram.org/bots/api#getfile
   *
   * @example
   *
   * ```js
   * await client.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2')
   * // {
   * //   fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
   * //   fileSize: 106356,
   * //   filePath: 'photos/1068230105874016297.jpg',
   * // }
   * ```
   */
  getFile(fileId: string): Promise<TelegramTypes.File> {
    return this.request('/getFile', {
      fileId,
    });
  }

  /**
   * Get link for file. This is an extension method of getFile()
   *
   * @param fileId - File identifier to get info about
   * @returns On success, a File URL is returned.
   *
   * @see https://core.telegram.org/bots/api#getfile
   *
   * @example
   *
   * ```js
   * await client.getFileLink('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2')
   * // 'https://api.telegram.org/file/bot<ACCESS_TOKEN>/photos/1068230105874016297.jpg'
   * ```
   */
  getFileLink(fileId: string): Promise<string> {
    return this.getFile(fileId).then(
      (result) =>
        `https://api.telegram.org/file/bot${this.accessToken}/${result.filePath}`
    );
  }

  /**
   * Use this method to kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group. Otherwise members may only be removed by the group's creator or by the member that added them.
   *
   * @param chatId - Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @param options.untilDate - Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#kickchatmember
   *
   * @example
   *
   * ```js
   * await client.kickChatMember(CHAT_ID, USER_ID, { untilDate: UNIX_TIME });
   * ```
   */
  kickChatMember(
    chatId: string | number,
    userId: number,
    options?: TelegramTypes.KickChatMemberOption
  ): Promise<boolean> {
    return this.request('/kickChatMember', {
      chatId,
      userId,
      ...options,
    });
  }

  /**
   * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work.
   *
   * @param chatId - Unique identifier for the target group or username of the target supergroup or channel (in the format `@username`)
   * @param userId - Unique identifier of the target user
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#unbanchatmember
   *
   * @example
   *
   * ```js
   * await client.unbanChatMember(CHAT_ID, USER_ID);
   * ```
   */
  unbanChatMember(chatId: string | number, userId: number): Promise<boolean> {
    return this.request('/unbanChatMember', {
      chatId,
      userId,
    });
  }

  /**
   * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param userId - Unique identifier of the target user
   * @param permissions - New user permissions
   * @param options - Other optional parameters.
   * @param options.untilDate - Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#restrictchatmember
   *
   * @example
   *
   * ```js
   * await client.restrictChatMember(CHAT_ID, USER_ID, { canSendMessages: true });
   * ```
   */
  restrictChatMember(
    chatId: string | number,
    userId: number,
    permissions: TelegramTypes.ChatPermissions,
    options?: TelegramTypes.RestrictChatMemberOption
  ): Promise<boolean> {
    return this.request('/restrictChatMember', {
      chatId,
      userId,
      permissions,
      ...options,
    });
  }

  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#promotechatmember
   *
   * @example
   *
   * ```js
   * await client.promoteChatMember(CHAT_ID, USER_ID, {
   *   canChangeInfo: true,
   *   canInviteUsers: true,
   * });
   * ```
   */
  promoteChatMember(
    chatId: string | number,
    userId: number,
    options?: TelegramTypes.PromoteChatMemberOption
  ): Promise<boolean> {
    return this.request('/promoteChatMember', {
      chatId,
      userId,
      ...options,
    });
  }

  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param permissions - New default chat permissions
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setchatpermissions
   *
   * @example
   *
   * ```js
   * ```
   */
  setChatPermissions(
    chatId: string | number,
    permissions: TelegramTypes.ChatPermissions
  ): Promise<boolean> {
    return this.request('/setChatPermissions', {
      chatId,
      permissions,
    });
  }

  /**
   * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink – after this the link will become available to the bot via the getChat method. If your bot needs to generate a new invite link replacing its previous one, use exportChatInviteLink again.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns the new invite link as String on success.
   *
   * @see https://core.telegram.org/bots/api#exportchatinvitelink
   *
   * @example
   *
   * ```js
   * await client.exportChatInviteLink(CHAT_ID);
   * ```
   */
  exportChatInviteLink(chatId: string | number): Promise<string> {
    return this.request('/exportChatInviteLink', {
      chatId,
    });
  }

  /**
   * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param photo - New chat photo, uploaded using multipart/form-data
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setchatphoto
   *
   */
  // TODO: implement setChatPhoto

  /**
   * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletechatphoto
   *
   * @example
   *
   * ```js
   * await client.deleteChatPhoto(CHAT_ID);
   * ```
   */
  deleteChatPhoto(chatId: string | number): Promise<boolean> {
    return this.request('/deleteChatPhoto', {
      chatId,
    });
  }

  /**
   * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param title - New chat title, 1-255 characters
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setchattitle
   *
   * @example
   *
   * ```js
   * await client.setChatTitle(CHAT_ID, 'New Title');
   * ```
   */
  setChatTitle(chatId: string | number, title: string): Promise<boolean> {
    return this.request('/setChatTitle', {
      chatId,
      title,
    });
  }

  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param description - New chat description, 0-255 characters
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setchatdescription
   *
   * @example
   *
   * ```js
   * await client.setChatDescription(CHAT_ID, 'New Description');
   * ```
   */
  setChatDescription(
    chatId: string | number,
    description: string
  ): Promise<boolean> {
    return this.request('/setChatDescription', {
      chatId,
      description,
    });
  }

  /**
   * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of a message to pin
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#pinchatmessage
   *
   * @example
   *
   * ```js
   * await client.pinChatMessage(CHAT_ID, MESSAGE_ID, { disableNotification: true });
   * ```
   */
  pinChatMessage(
    chatId: string | number,
    messageId: number,
    options?: TelegramTypes.PinChatMessageOption
  ): Promise<boolean> {
    return this.request('/pinChatMessage', {
      chatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#unpinchatmessage
   *
   * @example
   *
   * ```js
   * await client.unpinChatMessage(CHAT_ID);
   * ```
   */
  unpinChatMessage(chatId: string | number): Promise<boolean> {
    return this.request('/unpinChatMessage', {
      chatId,
    });
  }

  /**
   * Use this method for your bot to leave a group, supergroup or channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#leavechat
   *
   * @example
   *
   * ```js
   * await client.leaveChat(CHAT_ID);
   * ```
   */
  leaveChat(chatId: string | number): Promise<boolean> {
    return this.request('/leaveChat', {
      chatId,
    });
  }

  /**
   * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.).
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @return Returns a Chat object on success.
   *
   * @see https://core.telegram.org/bots/api#getchat
   *
   * @example
   *
   * ```js
   * await client.getChat(CHAT_ID);
   * // {
   * //   id: 313534466,
   * //   firstName: 'first',
   * //   lastName: 'last',
   * //   username: 'username',
   * //   type: 'private',
   * // }
   * ```
   */
  getChat(chatId: string | number): Promise<TelegramTypes.Chat> {
    return this.request('/getChat', {
      chatId,
    });
  }

  /**
   * Use this method to get a list of administrators in a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns  On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
   *
   * @see https://core.telegram.org/bots/api#getchatmemberscount
   *
   * @example
   *
   * ```js
   * await client.getChatAdministrators(CHAT_ID);
   * // [
   * //   {
   * //     user: {
   * //       id: 313534466,
   * //       firstName: 'first',
   * //       lastName: 'last',
   * //       username: 'username',
   * //       languangeCode: 'zh-TW',
   * //     },
   * //     status: 'creator',
   * //   },
   * // ]
   * ```
   */
  getChatAdministrators(
    chatId: string | number
  ): Promise<TelegramTypes.ChatMember[]> {
    return this.request('/getChatAdministrators', {
      chatId,
    });
  }

  /**
   * Use this method to get the number of members in a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns Returns Int on success.
   *
   * @see https://core.telegram.org/bots/api#getchatmemberscount
   *
   * @example
   *
   * ```js
   * await client.getChatMembersCount(CHAT_ID);
   * // '6'
   * ```
   */
  getChatMembersCount(chatId: string | number): Promise<number> {
    return this.request('/getChatMembersCount', {
      chatId,
    });
  }

  /**
   * Use this method to get information about a member of a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @returns Returns a ChatMember object on success.
   *
   * @see https://core.telegram.org/bots/api#getchatmember
   *
   * @example
   *
   * ```js
   * await client.getChatMember(CHAT_ID, USER_ID);
   * // {
   * //   user: {
   * //     id: 313534466,
   * //     firstName: 'first',
   * //     lastName: 'last',
   * //     username: 'username',
   * //     languangeCode: 'zh-TW',
   * //   },
   * //   status: 'creator',
   * // }
   * ```
   */
  getChatMember(
    chatId: string | number,
    userId: number
  ): Promise<TelegramTypes.ChatMember> {
    return this.request('/getChatMember', {
      chatId,
      userId,
    });
  }

  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param stickerSetName - Name of the sticker set to be set as the group sticker set
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setchatstickerset
   *
   * @example
   *
   * ```js
   * await client.setChatStickerSet(CHAT_ID, 'Sticker Set Name');
   * ```
   */
  setChatStickerSet(
    chatId: string | number,
    stickerSetName: string
  ): Promise<boolean> {
    return this.request('/setChatStickerSet', {
      chatId,
      stickerSetName,
    });
  }

  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletechatstickerset
   *
   * @example
   *
   * ```js
   * await client.deleteChatStickerSet(CHAT_ID);
   * ```
   */
  deleteChatStickerSet(chatId: string | number): Promise<boolean> {
    return this.request('/deleteChatStickerSet', {
      chatId,
    });
  }

  /**
   * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
   *
   * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via `@Botfather` and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
   *
   * @param callbackQueryId - Unique identifier for the query to be answered
   * @param options - Optional parameters for other parameters.
   *
   * @see https://core.telegram.org/bots/api#answercallbackquery
   *
   * @example
   *
   * ```js
   * ```
   */
  answerCallbackQuery(
    callbackQueryId: string,
    options: TelegramTypes.AnswerCallbackQueryOption
  ): Promise<boolean> {
    return this.request('/answerCallbackQuery', {
      callbackQueryId,
      ...options,
    });
  }

  /**
   * Use this method to edit text and game messages.
   *
   * @param text - New text of the message
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @param options.chatId - Unique identifier for the target chat or username of the target channel.
   * @param options.messageId - Identifier of the sent message.
   * @param options.inlineMessageId - Identifier of the inline message.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @see https://core.telegram.org/bots/api#editmessagetext
   *
   * @example
   *
   * ```js
   * await client.editMessageText('new_text', { messageId: MESSAGE_ID });
   * ```
   */
  editMessageText(
    text: string,
    options?: TelegramTypes.EditMessageTextOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageText', {
      text,
      ...options,
    });
  }

  /**
   * Use this method to edit captions of messages.
   *
   * @param caption - New caption of the message
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @param options.chatId - Unique identifier for the target chat or username of the target channel.
   * @param options.messageId - Identifier of the sent message.
   * @param options.inlineMessageId - Identifier of the inline message.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @see https://core.telegram.org/bots/api#editmessagecaption
   *
   * @example
   *
   * ```js
   * await client.editMessageCaption('new_caption', { messageId: MESSAGE_ID });
   * ```
   */
  editMessageCaption(
    caption: string,
    options?: TelegramTypes.EditMessageCaptionOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageCaption', {
      caption,
      ...options,
    });
  }

  /**
   * Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its file_id or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param media - A JSON-serialized object for a new media content of the message
   * @param options - Options for other optional parameters.
   *
   * @see https://core.telegram.org/bots/api#editmessagemedia
   *
   * @example
   *
   * ```js
   * ```
   */
  editMessageMedia(
    media: TelegramTypes.InputMedia,
    options: TelegramTypes.EditMessageMediaOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageMedia', {
      media,
      ...options,
    });
  }

  /**
   * Use this method to edit only the reply markup of messages.
   *
   * @param replyMarkup - A JSON-serialized object for an inline keyboard.
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @param options.chatId - Unique identifier for the target chat or username of the target channel.
   * @param options.messageId - Identifier of the sent message.
   * @param options.inlineMessageId - Identifier of the inline message.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @see https://core.telegram.org/bots/api#editmessagereplymarkup
   *
   * @example
   *
   * ```js
   * await client.editMessageReplyMarkup(
   *   {
   *     keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
   *     resizeKeyboard: true,
   *     oneTimeKeyboard: true,
   *   },
   *   { messageId: MESSAGE_ID }
   * );
   * ```
   */
  editMessageReplyMarkup(
    replyMarkup: TelegramTypes.InlineKeyboardMarkup,
    options?: TelegramTypes.EditMessageReplyMarkupOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageReplyMarkup', {
      replyMarkup,
      ...options,
    });
  }

  /**
   * Use this method to stop a poll which was sent by the bot.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of the original message with the poll
   * @param options - Options for other optional parameters.
   * @returns On success, the stopped Poll with the final results is returned.
   *
   * @see https://core.telegram.org/bots/api#stoppoll
   *
   * @example
   *
   * ```js
   * ```
   */
  stopPoll(
    chatId: string | number,
    messageId: number,
    options?: TelegramTypes.StopPollOption
  ): Promise<TelegramTypes.Poll> {
    return this.request('/stopPoll', {
      chatId,
      messageId,
      ...options,
    });
  }

  /**
   * Use this method to delete a message, including service messages, with the following limitations:
   * - A message can only be deleted if it was sent less than 48 hours ago.
   * - Bots can delete outgoing messages in private chats, groups, and supergroups.
   * - Bots can delete incoming messages in private chats.
   * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
   * - If the bot is an administrator of a group, it can delete any message there.
   * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of the message to delete
   * @returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletemessage
   *
   * @example
   *
   * ```js
   * await client.deleteMessage(CHAT_ID, MESSAGE_ID);
   * ```
   */
  deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
    return this.request('/deleteMessage', {
      chatId,
      messageId,
    });
  }

  /**
   * Use this method to send static .WEBP or animated .TGS stickers.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param sticker - Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a .webp file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendsticker
   *
   * @example
   *
   * ```js
   * await client.sendSticker(CHAT_ID, 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI', {
   *   disableNotification: true,
   * });
   * ```
   */
  sendSticker(
    chatId: string | number,
    sticker: string,
    options?: TelegramTypes.SendStickerOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendSticker', {
      chatId,
      sticker,
      ...options,
    });
  }

  /**
   * Use this method to get a sticker set.
   *
   * @param name - Name of the sticker set
   * @returns On success, a StickerSet object is returned.
   *
   * @see https://core.telegram.org/bots/api#getstickerset
   *
   * @example
   *
   * ```js
   * ```
   */
  getStickerSet(name: string): Promise<TelegramTypes.StickerSet> {
    return this.request('/getStickerSet', { name });
  }

  /**
   * @see https://core.telegram.org/bots/api#uploadstickerfile
   */
  // TODO: implement uploadStickerFile

  /**
   * Use this method to create new sticker set owned by a user. The bot will be able to edit the created sticker set.
   *
   * @param userId - User identifier of created sticker set owner
   * @param name - Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `_by_<bot username>`. `<bot_username>` is case insensitive. 1-64 characters.
   * @param title - Sticker set title, 1-64 characters
   * @param pngSticker - Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#createnewstickerset
   *
   * @example
   *
   * ```js
   * ```
   */
  createNewStickerSet(
    userId: number,
    name: string,
    title: string,
    pngSticker: string,
    emojis: string,
    options?: TelegramTypes.CreateNewStickerSetOption
  ): Promise<boolean> {
    return this.request('/createNewStickerSet', {
      userId,
      name,
      title,
      pngSticker,
      emojis,
      ...options,
    });
  }

  /**
   * Use this method to add a new sticker to a set created by the bot.
   *
   * @param userId - User identifier of sticker set owner
   * @param name - Sticker set name
   * @param pngSticker - Png image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param emojis - One or more emoji corresponding to the sticker
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#addstickertoset
   *
   * @example
   *
   * ```js
   * ```
   */
  addStickerToSet(
    userId: number,
    name: string,
    pngSticker: string,
    emojis: string,
    options?: TelegramTypes.AddStickerToSetOption
  ): Promise<boolean> {
    return this.request('/addStickerToSet', {
      userId,
      name,
      pngSticker,
      emojis,
      ...options,
    });
  }

  /**
   * Use this method to move a sticker in a set created by the bot to a specific position.
   *
   * @param sticker - File identifier of the sticker
   * @param position - New sticker position in the set, zero-based.
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#setstickerpositioninset
   *
   * @example
   *
   * ```js
   * ```
   */
  setStickerPositionInSet(sticker: string, position: number): Promise<boolean> {
    return this.request('setStickerPositionInSet', {
      sticker,
      position,
    });
  }

  /**
   * Use this method to delete a sticker from a set created by the bot.
   *
   * @param sticker - File identifier of the sticker
   * @returns Returns True on success.
   *
   * @see https://core.telegram.org/bots/api#deletestickerfromset
   *
   * @example
   *
   * ```js
   * ```
   */
  deleteStickerFromSet(sticker: string): Promise<boolean> {
    return this.request('/deleteStickerFromSet', { sticker });
  }

  /**
   * Use this method to send answers to an inline query. No more than 50 results per query are allowed.
   *
   * @param inlineQueryId - Unique identifier for the answered query
   * @param results - A JSON-serialized array of results for the inline query
   * @param options - Optional parameters for other parameters.
   * @returns On success, True is returned.
   *
   * @see https://core.telegram.org/bots/api#answerinlinequery
   *
   * @example
   *
   * ```js
   * await client.answerInlineQuery(
   *   'INLINE_QUERY_ID',
   *   [
   *     {
   *       type: 'photo',
   *       id: 'UNIQUE_ID',
   *       photoFileId: 'FILE_ID',
   *       title: 'PHOTO_TITLE',
   *     },
   *     {
   *       type: 'audio',
   *       id: 'UNIQUE_ID',
   *       audioFileId: 'FILE_ID',
   *       caption: 'AUDIO_TITLE',
   *     },
   *   ],
   *   {
   *     cacheTime: 1000,
   *   }
   * );
   * ```
   */
  answerInlineQuery(
    inlineQueryId: string,
    results: TelegramTypes.InlineQueryResult[],
    options?: TelegramTypes.AnswerInlineQueryOption
  ): Promise<boolean> {
    return this.request('/answerInlineQuery', {
      inlineQueryId,
      results,
      ...options,
    });
  }

  /**
   * Use this method to send invoices.
   *
   * @param chatId - Unique identifier for the target private chat
   * @param product.title - name, 1-32 characters
   * @param product.description - Product description, 1-255 characters
   * @param product.payload - Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
   * @param product.providerToken - Payments provider token, obtained via Botfather
   * @param product.startParameter - Unique deep-linking parameter that can be used to generate this invoice when used as a start parameter
   * @param product.currency - Three-letter ISO 4217 currency code, see more on currencies
   * @param product.prices - Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendinvoice
   *
   * @example
   *
   * ```js
   * await client.sendInvoice(CHAT_ID, {
   *   title: 'product name',
   *   description: 'product description',
   *   payload: 'bot-defined invoice payload',
   *   providerToken: 'PROVIDER_TOKEN',
   *   startParameter: 'pay',
   *   currency: 'USD',
   *   prices: [
   *     { label: 'product', amount: 11000 },
   *     { label: 'tax', amount: 11000 },
   *   ],
   * });
   * ```
   */
  sendInvoice(
    chatId: number,
    product: TelegramTypes.Product,
    options?: TelegramTypes.SendInvoiceOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendInvoice', {
      chatId,
      ...product,
      ...options,
    });
  }

  /**
   * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
   *
   * @param shippingQueryId - Unique identifier for the query to be answered
   * @param ok - Specify True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
   * @param options - Options for other optional parameters.
   *
   * @see https://core.telegram.org/bots/api#answershippingquery
   *
   * @example
   *
   * ```js
   * await client.answerShippingQuery('UNIQUE_ID', true);
   * ```
   */
  answerShippingQuery(
    shippingQueryId: string,
    ok: boolean,
    options?: TelegramTypes.AnswerShippingQueryOption
  ): Promise<boolean> {
    return this.request('/answerShippingQuery', {
      shippingQueryId,
      ok,
      ...options,
    });
  }

  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
   *
   * @param preCheckoutQueryId - Unique identifier for the query to be answered
   * @param ok - Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
   * @param options - Optional parameters for other parameters.
   * @returns On success, True is returned.
   *
   * @see https://core.telegram.org/bots/api#answerprecheckoutquery
   *
   * @example
   *
   * ```js
   * await client.answerPreCheckoutQuery('UNIQUE_ID', true);
   * ```
   */
  answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    options?: TelegramTypes.AnswerPreCheckoutQueryOption
  ): Promise<boolean> {
    return this.request('/answerPreCheckoutQuery', {
      preCheckoutQueryId,
      ok,
      ...options,
    });
  }

  /**
   * @see https://core.telegram.org/bots/api#setpassportdataerrors
   */
  // TODO: implement setPassportDataErrors

  /**
   * Use this method to send a game.
   *
   * @param chatId - Unique identifier for the target chat
   * @param gameShortName - Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   *
   * @see https://core.telegram.org/bots/api#sendgame
   *
   * @example
   *
   * ```js
   * await client.sendGame(CHAT_ID, 'Mario Bros.', {
   *   disableNotification: true,
   * });
   * ```
   */
  sendGame(
    chatId: number,
    gameShortName: string,
    options?: TelegramTypes.SendGameOption
  ): Promise<TelegramTypes.Message> {
    return this.request('/sendGame', {
      chatId,
      gameShortName,
      ...options,
    });
  }

  /**
   * Use this method to set the score of the specified user in a game.
   *
   * @param userId - User identifier
   * @param score - New score, must be non-negative
   * @param options - Options for other optional parameters.
   * @returns On success, if the message was sent by the bot, returns the edited Message, otherwise returns True. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
   *
   * @see https://core.telegram.org/bots/api#setgamescore
   *
   * @example
   *
   * ```js
   * await client.setGameScore(USER_ID, 999);
   * ```
   */
  setGameScore(
    userId: number,
    score: number,
    options?: TelegramTypes.SetGameScoreOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/setGameScore', {
      userId,
      score,
      ...options,
    });
  }

  /**
   * Use this method to get data for high score tables. Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   *
   * This method will currently return scores for the target user, plus two of his closest neighbors on each side. Will also return the top three users if the user and his neighbors are not among them. Please note that this behavior is subject to change.
   *
   * @param userId - Target user id
   * @param options - Optional parameters for other parameters.
   * @returns Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   *
   * @see https://core.telegram.org/bots/api#getgamehighscores
   *
   * @example
   *
   * ```js
   * await client.getGameHighScores(USER_ID);
   * // [
   * //   {
   * //     position: 1,
   * //     user: {
   * //       id: 427770117,
   * //       isBot: false,
   * //       firstName: 'first',
   * //     },
   * //     score: 999,
   * //   },
   * // ]
   * ```
   */
  getGameHighScores(
    userId: number,
    options?: TelegramTypes.GetGameHighScoresOption
  ): Promise<TelegramTypes.GameHighScore[]> {
    return this.request('/getGameHighScores', {
      userId,
      ...options,
    });
  }
}
