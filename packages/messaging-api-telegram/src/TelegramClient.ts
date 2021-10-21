import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as TelegramTypes from './TelegramTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { ok, errorCode, description } = response.data;
  if (ok) return response;
  const msg = `Telegram API - ${errorCode} ${description ?? ''}`;
  throw new PrintableAxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

function wrapPrintableAxiosError(err: unknown) {
  return Promise.reject(
    axios.isAxiosError(err)
      ? new PrintableAxiosError(`Telegram API - ${err.message}`, err)
      : err
  );
}

export default class TelegramClient {
  /**
   * The underlying axios instance.
   */
  public readonly axios: AxiosInstance;

  /**
   * The access token used by the client.
   */
  private accessToken: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * The constructor of TelegramClient.
   *
   * @param config - the config object
   * @example
   * ```js
   * const telegram = new TelegramClient({
   *   accessToken: TELEGRAM_BOT_TOKEN,
   * });
   * ```
   */
  constructor(config: TelegramTypes.ClientConfig) {
    this.accessToken = config.accessToken;
    this.onRequest = config.onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin ?? 'https://api.telegram.org'}/bot${
        this.accessToken
      }/`,
      headers: {
        'Content-Type': 'application/json',
      },
      transformRequest: [
        (data, headers) => {
          if (headers['Content-Type'] !== 'application/json' || !data) {
            return data;
          }

          return snakecaseKeysDeep(data);
        },
        // eslint-disable-next-line no-nested-ternary
        ...(Array.isArray(axios.defaults.transformRequest)
          ? axios.defaults.transformRequest
          : axios.defaults.transformRequest !== undefined
          ? [axios.defaults.transformRequest]
          : []),
      ],
      transformResponse: [
        // eslint-disable-next-line no-nested-ternary
        ...(Array.isArray(axios.defaults.transformResponse)
          ? axios.defaults.transformResponse
          : axios.defaults.transformResponse !== undefined
          ? [axios.defaults.transformResponse]
          : []),
        (data, headers) => {
          if (headers['content-type'] !== 'application/json') return data;
          return camelcaseKeysDeep(data);
        },
      ],
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this.onRequest,
      })
    );

    this.axios.interceptors.response.use(
      throwErrorIfAny,
      wrapPrintableAxiosError
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request(path: string, body: Record<string, any> = {}) {
    const response = await this.axios.post(path, body);

    return response.data.result;
  }

  /**
   * Use this method to receive incoming updates using long polling.
   * - This method will not work if an outgoing webhook is set up.
   * - In order to avoid getting duplicate updates, recalculate offset after each server response.
   *
   * @param options - Optional parameters.
   * @returns An array of [Update](https://core.telegram.org/bots/api#update) objects is returned.
   * @see https://core.telegram.org/bots/api#getupdates
   * @example
   * ```js
   * await telegram.getUpdates({ limit: 10 });
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
  public getUpdates(
    options?: TelegramTypes.GetUpdatesOption
  ): Promise<TelegramTypes.Update[]> {
    return this.request('/getUpdates', { ...options });
  }

  /**
   * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
   *
   * If you'd like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/<token>. Since nobody else knows your bot‘s token, you can be pretty sure it’s us.
   *
   * @param url - HTTPS url to send updates to. Use an empty string to remove webhook integration.
   * @param options - Optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setwebhook
   * @example
   * ```js
   * await telegram.setWebhook('https://4a16faff.ngrok.io/');
   * ```
   */
  public setWebhook(options: TelegramTypes.SetWebhookOption): Promise<boolean>;

  public setWebhook(
    url: string,
    options?: Omit<TelegramTypes.SetWebhookOption, 'url'>
  ): Promise<boolean>;

  public setWebhook(
    urlOrOptions: string | TelegramTypes.SetWebhookOption,
    options?: Omit<TelegramTypes.SetWebhookOption, 'url'>
  ): Promise<boolean> {
    const data =
      typeof urlOrOptions === 'object'
        ? urlOrOptions
        : {
            url: urlOrOptions,
            ...options,
          };
    return this.request('/setWebhook', data);
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates.
   *
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletewebhook
   * @example
   * ```js
   * await telegram.deleteWebhook();
   * ```
   */
  public deleteWebhook(
    options?: TelegramTypes.DeleteWebhookOption
  ): Promise<boolean> {
    return this.request('/deleteWebhook', { ...options });
  }

  /**
   * Use this method to get current webhook status.
   *
   * @returns On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
   * @see https://core.telegram.org/bots/api#getwebhookinfo
   * @example
   * ```js
   * await telegram.getWebhookInfo();
   * // {
   * //   url: 'https://4a16faff.ngrok.io/',
   * //   hasCustomCertificate: false,
   * //   pendingUpdateCount: 0,
   * //   maxConnections: 40,
   * // }
   * ```
   */
  public getWebhookInfo(): Promise<TelegramTypes.WebhookInfo> {
    return this.request('/getWebhookInfo');
  }

  /**
   * A simple method for testing your bot's auth token.
   *
   * @returns Returns basic information about the bot in form of a User object.
   * @see https://core.telegram.org/bots/api#getme
   * @example
   * ```js
   * await telegram.getMe();
   * // {
   * //   id: 313534466,
   * //   firstName: 'Bot',
   * //   username: 'a_bot'
   * // }
   * ```
   */
  public getMe(): Promise<boolean> {
    return this.request('/getMe');
  }

  /**
   * Use this method to log out from the cloud Bot API server before launching the bot locally.
   *
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#logout
   * @example
   * ```js
   * await telegram.logOut();
   * ```
   */
  public logOut(): Promise<boolean> {
    return this.request('/logOut');
  }

  /**
   * Use this method to close the bot instance before moving it from one local server to another.
   *
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#close
   * @example
   * ```js
   * await telegram.close();
   * ```
   */
  public close(): Promise<TelegramTypes.User> {
    return this.request('/close');
  }

  /**
   * Use this method to send text messages.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendmessage
   * @example
   * ```js
   * await telegram.sendMessage({
   *   chatId: CHAT_ID,
   *   text: 'hi',
   *   disableWebPagePreview: true,
   *   disableNotification: true,
   * });
   * ```
   */
  public sendMessage(
    options: TelegramTypes.SendMessageOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send text messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param text - Text of the message to be sent.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendmessage
   * @example
   * ```js
   * await telegram.sendMessage(CHAT_ID, 'hi');
   * ```
   */
  public sendMessage(
    chatId: string | number,
    text: string,
    options?: Omit<TelegramTypes.SendMessageOption, 'chatId' | 'text'>
  ): Promise<TelegramTypes.Message>;

  public sendMessage(
    chatIdOrOptions: string | number | TelegramTypes.SendMessageOption,
    text?: string,
    options?: Omit<TelegramTypes.SendMessageOption, 'chatId' | 'text'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            text,
            ...options,
          };
    return this.request('/sendMessage', data);
  }

  /**
   * Use this method to forward messages of any kind.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#forwardmessage
   * @example
   * ```js
   * await telegram.forwardMessage({
   *   chatId: CHAT_ID,
   *   fromChatId: USER_ID,
   *   messageId: MESSAGE_ID,
   *   disableNotification: true,
   * });
   * ```
   */
  public forwardMessage(
    options: TelegramTypes.ForwardMessageOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to forward messages of any kind.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param fromChatId - Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   * @param messageId - Message identifier in the chat specified in fromChatId
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#forwardmessage
   * @example
   * ```js
   * await telegram.forwardMessage(CHAT_ID, USER_ID, MESSAGE_ID);
   * ```
   */
  public forwardMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number,
    options?: Omit<
      TelegramTypes.ForwardMessageOption,
      'chatId' | 'fromChatId' | 'messageId'
    >
  ): Promise<TelegramTypes.Message>;

  public forwardMessage(
    chatIdOrOptions: string | number | TelegramTypes.ForwardMessageOption,
    fromChatId?: string | number,
    messageId?: number,
    options?: Omit<
      TelegramTypes.ForwardMessageOption,
      'chatId' | 'fromChatId' | 'messageId'
    >
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            fromChatId,
            messageId,
            ...options,
          };
    return this.request('/forwardMessage', data);
  }

  /**
   * Use this method to copy messages of any kind.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns the MessageId of the sent message on success.
   * @see https://core.telegram.org/bots/api#copymessage
   * @example
   * ```js
   * await telegram.copyMessage({
   *   chatId: CHAT_ID,
   *   fromChatId: USER_ID,
   *   messageId: MESSAGE_ID,
   *   disableNotification: true,
   * });
   * ```
   */
  public copyMessage(
    options: TelegramTypes.CopyMessageOption
  ): Promise<TelegramTypes.MessageId>;

  /**
   * Use this method to forward messages of any kind.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param fromChatId - Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   * @param messageId - Message identifier in the chat specified in fromChatId
   * @param options - Options for other optional parameters.
   * @returns Returns the MessageId of the sent message on success.
   * @see https://core.telegram.org/bots/api#copymessage
   * @example
   * ```js
   * await telegram.copyMessage(CHAT_ID, USER_ID, MESSAGE_ID);
   * ```
   */
  public copyMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number,
    options?: Omit<
      TelegramTypes.CopyMessageOption,
      'chatId' | 'fromChatId' | 'messageId'
    >
  ): Promise<TelegramTypes.MessageId>;

  public copyMessage(
    chatIdOrOptions: string | number | TelegramTypes.CopyMessageOption,
    fromChatId?: string | number,
    messageId?: number,
    options?: Omit<
      TelegramTypes.ForwardMessageOption,
      'chatId' | 'fromChatId' | 'messageId'
    >
  ): Promise<TelegramTypes.MessageId> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            fromChatId,
            messageId,
            ...options,
          };
    return this.request('/copyMessage', data);
  }

  /**
   * Use this method to send photos.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendphoto
   * @example
   * ```js
   * await telegram.sendPhoto({
   *   chatId: CHAT_ID,
   *   photo: 'https://example.com/image.png',
   *   caption: 'gooooooodPhoto',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendPhoto(
    options: TelegramTypes.SendPhotoOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send photos.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a photo from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendphoto
   * @example
   * ```js
   * await telegram.sendPhoto(CHAT_ID, 'https://example.com/image.png');
   * ```
   */
  public sendPhoto(
    chatId: string | number,
    photo: string,
    options?: Omit<TelegramTypes.SendPhotoOption, 'chatId' | 'photo'>
  ): Promise<TelegramTypes.Message>;

  public sendPhoto(
    chatIdOrOptions: string | number | TelegramTypes.SendPhotoOption,
    photo?: string,
    options?: Omit<TelegramTypes.SendPhotoOption, 'chatId' | 'photo'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            photo,
            ...options,
          };
    return this.request('/sendPhoto', data);
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the sendVoice method instead.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendaudio
   * @example
   * ```js
   * await telegram.sendAudio({
   *   chatId: CHAT_ID,
   *   audio: 'https://example.com/audio.mp3',
   *   caption: 'gooooooodAudio',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendAudio(
    options: TelegramTypes.SendAudioOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
   *
   * For sending voice messages, use the sendVoice method instead.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param audio -Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an audio file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendaudio
   * @example
   * ```js
   * await telegram.sendAudio(CHAT_ID, 'https://example.com/audio.mp3');
   * ```
   */
  public sendAudio(
    chatId: string | number,
    audio: string,
    options?: Omit<TelegramTypes.SendAudioOption, 'chatId' | 'audio'>
  ): Promise<TelegramTypes.Message>;

  public sendAudio(
    chatIdOrOptions: string | number | TelegramTypes.SendAudioOption,
    audio?: string,
    options?: Omit<TelegramTypes.SendAudioOption, 'chatId' | 'audio'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            audio,
            ...options,
          };
    return this.request('/sendAudio', data);
  }

  /**
   * Use this method to send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#senddocument
   * @example
   * ```js
   * await telegram.sendDocument({
   *   chatId: CHAT_ID,
   *   document: 'https://example.com/doc.gif',
   *   caption: 'gooooooodDocument',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendDocument(
    options: TelegramTypes.SendDocumentOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send general files. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#senddocument
   * @example
   * ```js
   * await telegram.sendDocument(CHAT_ID, 'https://example.com/doc.gif');
   * ```
   */
  public sendDocument(
    chatId: string | number,
    document: string,
    options?: Omit<TelegramTypes.SendDocumentOption, 'chatId' | 'document'>
  ): Promise<TelegramTypes.Message>;

  public sendDocument(
    chatIdOrOptions: string | number | TelegramTypes.SendDocumentOption,
    document?: string,
    options?: Omit<TelegramTypes.SendDocumentOption, 'chatId' | 'document'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            document,
            ...options,
          };
    return this.request('/sendDocument', data);
  }

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvideo
   * @example
   * ```js
   * await telegram.sendVideo({
   *   chatId: CHAT_ID,
   *   video: 'https://example.com/video.mp4',
   *   caption: 'gooooooodVideo',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendVideo(
    options: TelegramTypes.SendVideoOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a video from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvideo
   * @example
   * ```js
   * await telegram.sendVideo(CHAT_ID, 'https://example.com/video.mp4');
   * ```
   */
  public sendVideo(
    chatId: string | number,
    video: string,
    options?: Omit<TelegramTypes.SendVideoOption, 'chatId' | 'video'>
  ): Promise<TelegramTypes.Message>;

  public sendVideo(
    chatIdOrOptions: string | number | TelegramTypes.SendVideoOption,
    video?: string,
    options?: Omit<TelegramTypes.SendVideoOption, 'chatId' | 'video'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            video,
            ...options,
          };
    return this.request('/sendVideo', data);
  }

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendanimation
   * @example
   * ```js
   * await telegram.sendAnimation({
   *   chatId: CHAT_ID,
   *   animation: 'https://example.com/animation.mp4',
   *   caption: 'gooooooodAnimation',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendAnimation(
    options: TelegramTypes.SendAnimationOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param animation - Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get an animation from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendanimation
   * @example
   * ```js
   * await telegram.sendAnimation(CHAT_ID, 'https://example.com/animation.mp4');
   * ```
   */

  public sendAnimation(
    chatId: string | number,
    animation: string,
    options?: Omit<TelegramTypes.SendAnimationOption, 'chatId' | 'animation'>
  ): Promise<TelegramTypes.Message>;

  public sendAnimation(
    chatIdOrOptions: string | number | TelegramTypes.SendAnimationOption,
    animation?: string,
    options?: Omit<TelegramTypes.SendAnimationOption, 'chatId' | 'animation'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            animation,
            ...options,
          };
    return this.request('/sendAnimation', data);
  }

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvoice
   * @example
   * ```js
   * await telegram.sendVoice({
   *   chatId: CHAT_ID,
   *   voice: 'https://example.com/voice.ogg',
   *   caption: 'gooooooodVoice',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendVoice(
    options: TelegramTypes.SendVoiceOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
   *
   * @param chatId - identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param voice - Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL as a String for Telegram to get a file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvoice
   * @example
   * ```js
   * await telegram.sendVoice(CHAT_ID, 'https://example.com/voice.ogg');
   * ```
   */
  public sendVoice(
    chatId: string | number,
    voice: string,
    options?: Omit<TelegramTypes.SendVoiceOption, 'chatId' | 'voice'>
  ): Promise<TelegramTypes.Message>;

  public sendVoice(
    chatIdOrOptions: string | number | TelegramTypes.SendVoiceOption,
    voice?: string,
    options?: Omit<TelegramTypes.SendVoiceOption, 'chatId' | 'voice'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            voice,
            ...options,
          };
    return this.request('/sendVoice', data);
  }

  /**
   * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvideonote
   * @example
   * ```js
   * await telegram.sendVideoNote({
   *   chatId: CHAT_ID,
   *   videoNote: 'https://example.com/video_note.mp4',
   *   duration: 40,
   *   disableNotification: true,
   * });
   * ```
   */
  public sendVideoNote(
    options: TelegramTypes.SendVideoNoteOption
  ): Promise<TelegramTypes.Message>;

  /**
   * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param videoNote - Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers. Sending video notes by a URL is currently unsupported. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvideonote
   * @example
   * ```js
   * await telegram.sendVideoNote(CHAT_ID, 'https://example.com/video_note.mp4', {
   *   duration: 40,
   *   disableNotification: true,
   * });
   * ```
   */
  public sendVideoNote(
    chatId: string | number,
    videoNote: string,
    options?: Omit<TelegramTypes.SendVideoNoteOption, 'chatId' | 'videoNote'>
  ): Promise<TelegramTypes.Message>;

  public sendVideoNote(
    chatIdOrOptions: string | number | TelegramTypes.SendVideoNoteOption,
    videoNote?: string,
    options?: Omit<TelegramTypes.SendVideoNoteOption, 'chatId' | 'videoNote'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            videoNote,
            ...options,
          };
    return this.request('/sendVideoNote', data);
  }

  /**
   * Use this method to send a group of photos or videos as an album.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, an array of the sent Messages is returned.
   * @see https://core.telegram.org/bots/api#sendmediagroup
   * @example
   * ```js
   * await telegram.sendMediaGroup({
   *   chatId: CHAT_ID,
   *   media: [
   *     { type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' },
   *   ],
   * });
   * ```
   */
  public sendMediaGroup(
    options: TelegramTypes.SendMediaGroupOption
  ): Promise<TelegramTypes.Message[]>;

  /**
   * Use this method to send a group of photos or videos as an album.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param media - A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
   * @param options - Options for other optional parameters.
   * @returns On success, an array of the sent Messages is returned.
   * @see https://core.telegram.org/bots/api#sendmediagroup
   * @example
   * ```js
   * await telegram.sendMediaGroup(CHAT_ID, [
   *   { type: 'photo', media: 'BQADBAADApYAAgcZZAfj2-xeidueWwI' },
   * ]);
   * ```
   */
  public sendMediaGroup(
    chatId: string | number,
    media: (TelegramTypes.InputMediaPhoto | TelegramTypes.InputMediaVideo)[],
    options?: Omit<TelegramTypes.SendMediaGroupOption, 'chatId' | 'media'>
  ): Promise<TelegramTypes.Message[]>;

  public sendMediaGroup(
    chatIdOrOptions: string | number | TelegramTypes.SendMediaGroupOption,
    media?: (TelegramTypes.InputMediaPhoto | TelegramTypes.InputMediaVideo)[],
    options?: Omit<TelegramTypes.SendMediaGroupOption, 'chatId' | 'media'>
  ): Promise<TelegramTypes.Message[]> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            media,
            ...options,
          };
    return this.request('/sendMediaGroup', data);
  }

  /**
   * Use this method to send point on the map.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendlocation
   * @example
   * ```js
   * await telegram.sendLocation({
   *   chatId: CHAT_ID,
   *   latitude: 30,
   *   longitude: 45,
   *   disableNotification: true,
   * });
   * ```
   */
  public sendLocation(
    options: TelegramTypes.SendLocationOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send point on the map.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendlocation
   * @example
   * ```js
   * await telegram.sendLocation(
   *   CHAT_ID,
   *   {
   *     latitude: 30,
   *     longitude: 45,
   *     disableNotification: true,
   *   }
   * );
   * ```
   */
  public sendLocation(
    chatId: string | number,
    options: Omit<TelegramTypes.SendLocationOption, 'chatId'>
  ): Promise<TelegramTypes.Message>;

  public sendLocation(
    chatIdOrOptions: string | number | TelegramTypes.SendLocationOption,
    options?: Omit<TelegramTypes.SendLocationOption, 'chatId'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/sendLocation', data);
  }

  /**
   * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param options - One of chatId, messageId or inlineMessageId is required.
   * @see https://core.telegram.org/bots/api#editmessagelivelocation
   * @example
   * ```js
   * await telegram.editMessageLiveLocation({
   *   messageId: MESSAGE_ID,
   *   latitude: 30,
   *   longitude: 45,
   * });
   * ```
   */
  public editMessageLiveLocation(
    options: TelegramTypes.EditMessageLiveLocationOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/editMessageLiveLocation', { ...options });
  }

  /**
   * Use this method to stop updating a live location message before live_period expires. On success, if the message was sent by the bot, the sent Message is returned, otherwise True is returned.
   *
   * @param options - One of chatId, messageId or inlineMessageId is required.
   * @see https://core.telegram.org/bots/api#stopmessagelivelocation
   * @example
   * ```js
   * await telegram.stopMessageLiveLocation({ messageId: MESSAGE_ID });
   * ```
   */
  public stopMessageLiveLocation(
    options: TelegramTypes.StopMessageLiveLocationOption
  ): Promise<TelegramTypes.Message | boolean> {
    return this.request('/stopMessageLiveLocation', { ...options });
  }

  /**
   * Use this method to send information about a venue.
   *
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvenue
   * @example
   * ```js
   * await telegram.sendVenue({
   *   chatId: CHAT_ID,
   *   latitude: 30,
   *   longitude: 45,
   *   title: 'a_title',
   *   address: 'an_address',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendVenue(
    options: TelegramTypes.SendVenueOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send information about a venue.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendvenue
   * @example
   * ```js
   * await telegram.sendVenue(
   *   CHAT_ID,
   *   {
   *     latitude: 30,
   *     longitude: 45,
   *     title: 'a_title',
   *     address: 'an_address',
   *     disableNotification: true,
   *   }
   * );
   * ```
   */
  public sendVenue(
    chatId: string | number,
    options: Omit<TelegramTypes.SendVenueOption, 'chatId'>
  ): Promise<TelegramTypes.Message>;

  public sendVenue(
    chatIdOrOptions: string | number | TelegramTypes.SendVenueOption,
    options?: Omit<TelegramTypes.SendVenueOption, 'chatId'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/sendVenue', data);
  }

  /**
   * Use this method to send phone contacts.
   *
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendcontact
   * @example
   * ```js
   * await telegram.sendContact(CHAT_ID, {
   *   chatId: CHAT_ID,
   *   phoneNumber: '886123456789',
   *   firstName: 'first',
   *   lastName: 'last'
   * });
   * ```
   */
  public sendContact(
    options: TelegramTypes.SendContactOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send phone contacts.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendcontact
   * @example
   * ```js
   * await telegram.sendContact(CHAT_ID, {
   *   phoneNumber: '886123456789',
   *   firstName: 'first',
   *   lastName: 'last'
   * });
   * ```
   */
  public sendContact(
    chatId: string | number,
    options: Omit<TelegramTypes.SendContactOption, 'chatId'>
  ): Promise<TelegramTypes.Message>;

  public sendContact(
    chatIdOrOptions: string | number | TelegramTypes.SendContactOption,
    options?: Omit<TelegramTypes.SendContactOption, 'chatId'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/sendContact', data);
  }

  /**
   * Use this method to send a native poll. A native poll can't be sent to a private chat.
   *
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendpoll
   * @example
   * ```js
   * await telegram.sendPoll({
   *   chatId: CHAT_ID,
   *   question: 'question?',
   *   options: ['A', 'B'],
   *   isAnonymous: true,
   * });
   * ```
   */
  public sendPoll(
    options: TelegramTypes.SendPollOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send a native poll. A native poll can't be sent to a private chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). A native poll can't be sent to a private chat.
   * @param question - Poll question, 1-255 characters
   * @param options - List of answer options, 2-10 strings 1-100 characters each
   * @param methodOptions - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendpoll
   * @example
   * ```js
   * await telegram.sendPoll(CHAT_ID, 'question?', ['A', 'B']);
   * ```
   */
  public sendPoll(
    chatId: string | number,
    question: string,
    options: string[],
    methodOptions?: Omit<
      TelegramTypes.SendPollOption,
      'chatId' | 'question' | 'options'
    >
  ): Promise<TelegramTypes.Message>;

  public sendPoll(
    chatIdOrOptions: string | number | TelegramTypes.SendPollOption,
    question?: string,
    options?: string[],
    methodOptions?: Omit<
      TelegramTypes.SendPollOption,
      'chatId' | 'question' | 'options'
    >
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            question,
            options,
            ...methodOptions,
          };
    return this.request('/sendPoll', data);
  }

  /**
   * Use this method to send an animated emoji that will display a random value.
   *
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#senddice
   * @example
   * ```js
   * await telegram.sendDice({
   *   chatId: CHAT_ID,
   *   emoji: '🎯',
   * });
   * ```
   */
  public sendDice(
    options: TelegramTypes.SendDiceOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send an animated emoji that will display a random value.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). A native poll can't be sent to a private chat.
   * @param options - Optional parameters for other parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#senddice
   * @example
   * ```js
   * await telegram.sendDice(CHAT_ID, { emoji: '🎯' });
   * ```
   */
  public sendDice(
    chatId: string | number,
    options?: Omit<TelegramTypes.SendDiceOption, 'chatId'>
  ): Promise<TelegramTypes.Message>;

  public sendDice(
    chatIdOrOptions: string | number | TelegramTypes.SendDiceOption,
    options?: Omit<TelegramTypes.SendDiceOption, 'chatId'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/sendDice', data);
  }

  /**
   * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
   *
   * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
   *
   * @param options - Optional parameters for other parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#sendchataction
   * @example
   * ```js
   * await telegram.sendChatAction({
   *   chatId: CHAT_ID,
   *   action: 'typing',
   * });
   * ```
   */
  public sendChatAction(
    options: TelegramTypes.SendChatActionOption
  ): Promise<boolean>;

  /**
   * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
   *
   * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param action - Types of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#sendchataction
   * @example
   * ```js
   * await telegram.sendChatAction(CHAT_ID, 'typing');
   * ```
   */
  public sendChatAction(
    chatId: string | number,
    action: TelegramTypes.ChatAction
  ): Promise<boolean>;

  public sendChatAction(
    chatIdOrOptions: string | number | TelegramTypes.SendChatActionOption,
    action?: TelegramTypes.ChatAction
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            action,
          };
    return this.request('/sendChatAction', data);
  }

  /**
   * Use this method to get a list of profile pictures for a user.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns a UserProfilePhotos object.
   * @see https://core.telegram.org/bots/api#getuserprofilephotos
   * @example
   * ```js
   * await telegram.getUserProfilePhotos({ userId: USER_ID, limit: 1 });
   * // {
   * //   totalCount: 2,
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
   * //     ],
   * //   ],
   * // }
   * ```
   */
  public getUserProfilePhotos(
    options: TelegramTypes.GetUserProfilePhotosOption
  ): Promise<TelegramTypes.UserProfilePhotos>;

  /**
   * Use this method to get a list of profile pictures for a user.
   *
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters.
   * @returns Returns a UserProfilePhotos object.
   * @see https://core.telegram.org/bots/api#getuserprofilephotos
   * @example
   * ```js
   * await telegram.getUserProfilePhotos(USER_ID, { limit: 1 });
   * // {
   * //   totalCount: 2,
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
   * //     ],
   * //   ],
   * // }
   * ```
   */
  public getUserProfilePhotos(
    userId: number,
    options?: Omit<TelegramTypes.GetUserProfilePhotosOption, 'userId'>
  ): Promise<TelegramTypes.UserProfilePhotos>;

  public getUserProfilePhotos(
    userIdOrOptions: number | TelegramTypes.GetUserProfilePhotosOption,
    options?: Omit<TelegramTypes.GetUserProfilePhotosOption, 'userId'>
  ): Promise<TelegramTypes.UserProfilePhotos> {
    const data =
      typeof userIdOrOptions === 'object'
        ? userIdOrOptions
        : {
            userId: userIdOrOptions,
            ...options,
          };
    return this.request('/getUserProfilePhotos', data);
  }

  /**
   * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size.
   *
   * @param fileId - File identifier to get info about
   * @returns On success, a File object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
   * @see https://core.telegram.org/bots/api#getfile
   * @example
   * ```js
   * await telegram.getFile('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2')
   * // {
   * //   fileId: 'UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2',
   * //   fileSize: 106356,
   * //   filePath: 'photos/1068230105874016297.jpg',
   * // }
   * ```
   */
  public getFile(
    options: TelegramTypes.GetFileOption
  ): Promise<TelegramTypes.File>;

  public getFile(fileId: string): Promise<TelegramTypes.File>;

  public getFile(
    fileIdOrOptions: string | TelegramTypes.GetFileOption
  ): Promise<TelegramTypes.File> {
    const data =
      typeof fileIdOrOptions === 'object'
        ? fileIdOrOptions
        : {
            fileId: fileIdOrOptions,
          };
    return this.request('/getFile', data);
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
   * await telegram.getFileLink('UtAqweADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pM4A1UpI0koD65K2')
   * // 'https://api.telegram.org/file/bot<ACCESS_TOKEN>/photos/1068230105874016297.jpg'
   * ```
   */
  public getFileLink(fileId: string): Promise<string> {
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
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#banchatmember
   * @example
   * ```js
   * await telegram.banChatMember({
   *   chatId: CHAT_ID,
   *   userId: USER_ID,
   *   untilDate: UNIX_TIME,
   * });
   * ```
   */
  public banChatMember(
    options: TelegramTypes.BanChatMemberOption
  ): Promise<boolean>;

  /**
   * Use this method to kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group. Otherwise members may only be removed by the group's creator or by the member that added them.
   *
   * @param chatId - Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#banchatmember
   * @example
   * ```js
   * await telegram.banChatMember(CHAT_ID, USER_ID, { untilDate: UNIX_TIME });
   * ```
   */
  public banChatMember(
    chatId: string | number,
    userId: number,
    options?: Omit<TelegramTypes.BanChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean>;

  public banChatMember(
    chatIdOrOptions: string | number | TelegramTypes.BanChatMemberOption,
    userId?: number,
    options?: Omit<TelegramTypes.BanChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
            ...options,
          };
    return this.request('/banChatMember', data);
  }

  /**
   * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unbanchatmember
   * @example
   * ```js
   * await telegram.unbanChatMember({
   *   chatId: CHAT_ID,
   *   userId: USER_ID,
   * });
   * ```
   */
  public unbanChatMember(
    options: TelegramTypes.UnbanChatMemberOption
  ): Promise<boolean>;

  /**
   * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work.
   *
   * @param chatId - Unique identifier for the target group or username of the target supergroup or channel (in the format `@username`)
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unbanchatmember
   * @example
   * ```js
   * await telegram.unbanChatMember(CHAT_ID, USER_ID);
   * ```
   */
  public unbanChatMember(
    chatId: string | number,
    userId: number,
    options?: Omit<TelegramTypes.UnbanChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean>;

  public unbanChatMember(
    chatIdOrOptions: string | number | TelegramTypes.UnbanChatMemberOption,
    userId?: number,
    options?: Omit<TelegramTypes.UnbanChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
            ...options,
          };
    return this.request('/unbanChatMember', data);
  }

  /**
   * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user.
   *
   * @param options - Other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#restrictchatmember
   * @example
   * ```js
   * await telegram.restrictChatMember({
   *   chatId: CHAT_ID,
   *   userId: USER_ID,
   *   permissions: { canSendMessages: true },
   * });
   * ```
   */
  public restrictChatMember(
    options: TelegramTypes.RestrictChatMemberOption
  ): Promise<boolean>;

  /**
   * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param userId - Unique identifier of the target user
   * @param permissions - New user permissions
   * @param options - Other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#restrictchatmember
   * @example
   * ```js
   * await telegram.restrictChatMember(CHAT_ID, USER_ID, { canSendMessages: true });
   * ```
   */
  public restrictChatMember(
    chatId: string | number,
    userId: number,
    permissions: TelegramTypes.ChatPermissions,
    options?: Omit<
      TelegramTypes.RestrictChatMemberOption,
      'chatId' | 'userId' | 'permissions'
    >
  ): Promise<boolean>;

  public restrictChatMember(
    chatIdOrOptions: string | number | TelegramTypes.RestrictChatMemberOption,
    userId?: number,
    permissions?: TelegramTypes.ChatPermissions,
    options?: Omit<
      TelegramTypes.RestrictChatMemberOption,
      'chatId' | 'userId' | 'permissions'
    >
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
            permissions,
            ...options,
          };
    return this.request('/restrictChatMember', data);
  }

  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#promotechatmember
   * @example
   * ```js
   * await telegram.promoteChatMember({
   *   chatId: CHAT_ID,
   *   userId: USER_ID,
   *   canChangeInfo: true,
   *   canInviteUsers: true,
   * });
   * ```
   */
  public promoteChatMember(
    options: TelegramTypes.PromoteChatMemberOption
  ): Promise<boolean>;

  /**
   * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#promotechatmember
   * @example
   * ```js
   * await telegram.promoteChatMember(CHAT_ID, USER_ID, {
   *   canChangeInfo: true,
   *   canInviteUsers: true,
   * });
   * ```
   */
  public promoteChatMember(
    chatId: string | number,
    userId: number,
    options?: Omit<TelegramTypes.PromoteChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean>;

  public promoteChatMember(
    chatIdOrOptions: string | number | TelegramTypes.PromoteChatMemberOption,
    userId?: number,
    options?: Omit<TelegramTypes.PromoteChatMemberOption, 'chatId' | 'userId'>
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
            ...options,
          };
    return this.request('/promoteChatMember', data);
  }

  /**
   * Use this method to set a custom title for an administrator in a supergroup promoted by the bot.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatadministratorcustomtitle
   * @example
   * ```js
   * await telegram.setChatAdministratorCustomTitle({
   *   chatId: CHAT_ID,
   *   userId: USER_ID,
   *   customTitle: 'Custom Title',
   * });
   * ```
   */
  public setChatAdministratorCustomTitle(
    options: TelegramTypes.SetChatAdministratorCustomTitleOption
  ): Promise<boolean>;

  /**
   * Use this method to set a custom title for an administrator in a supergroup promoted by the bot.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @param customTitle - New custom title for the administrator; 0-16 characters, emoji are not allowed
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatadministratorcustomtitle
   * @example
   * ```js
   * await telegram.setChatAdministratorCustomTitle(CHAT_ID, USER_ID, 'Custom Title');
   * ```
   */
  public setChatAdministratorCustomTitle(
    chatId: string | number,
    userId: number,
    customTitle: string
  ): Promise<boolean>;

  public setChatAdministratorCustomTitle(
    chatIdOrOptions:
      | string
      | number
      | TelegramTypes.SetChatAdministratorCustomTitleOption,
    userId?: number,
    customTitle?: string
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
            customTitle,
          };
    return this.request('/setChatAdministratorCustomTitle', data);
  }

  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatpermissions
   * @example
   * ```js
   * await telegram.setChatPermissions(427770117, {
   *   canSendMessages: true,
   * });
   * ```
   */
  public setChatPermissions(
    options: TelegramTypes.SetChatPermissionsOption
  ): Promise<boolean>;

  /**
   * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param permissions - New default chat permissions
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatpermissions
   * @example
   * ```js
   * await telegram.setChatPermissions(427770117, {
   *   canSendMessages: true,
   * });
   * ```
   */
  public setChatPermissions(
    chatId: string | number,
    permissions: TelegramTypes.ChatPermissions
  ): Promise<boolean>;

  public setChatPermissions(
    chatIdOrOptions: string | number | TelegramTypes.SetChatPermissionsOption,
    permissions?: TelegramTypes.ChatPermissions
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            permissions,
          };
    return this.request('/setChatPermissions', data);
  }

  /**
   * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink – after this the link will become available to the bot via the getChat method. If your bot needs to generate a new invite link replacing its previous one, use exportChatInviteLink again.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns the new invite link as String on success.
   * @see https://core.telegram.org/bots/api#exportchatinvitelink
   * @example
   * ```js
   * await telegram.exportChatInviteLink({ chatId: CHAT_ID });
   * ```
   */
  public exportChatInviteLink(
    options: TelegramTypes.ExportChatInviteLinkOption
  ): Promise<string>;

  /**
   * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink – after this the link will become available to the bot via the getChat method. If your bot needs to generate a new invite link replacing its previous one, use exportChatInviteLink again.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns the new invite link as String on success.
   * @see https://core.telegram.org/bots/api#exportchatinvitelink
   * @example
   * ```js
   * await telegram.exportChatInviteLink(CHAT_ID);
   * ```
   */
  public exportChatInviteLink(chatId: string | number): Promise<string>;

  public exportChatInviteLink(
    chatIdOrOptions: string | number | TelegramTypes.ExportChatInviteLinkOption
  ): Promise<string> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/exportChatInviteLink', data);
  }

  /**
   * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param options - Options for other optional parameters
   * @returns Returns the new invite link as ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#createchatinvitelink
   * @example
   * ```js
   * await telegram.createChatInviteLink({
   *   chatId: 427770117,
   *   memberLimit: 10,
   * });
   * ```
   */
  public createChatInviteLink(
    options: TelegramTypes.CreateChatInviteLinkOption
  ): Promise<TelegramTypes.ChatInviteLink>;

  /**
   * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param options - Options for other optional parameters
   * @returns Returns the new invite link as ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#createchatinvitelink
   * @example
   * ```js
   * await telegram.createChatInviteLink(427770117, {
   *   memberLimit: 10,
   * });
   * ```
   */
  public createChatInviteLink(
    chatId: string | number,
    options?: Omit<TelegramTypes.CreateChatInviteLinkOption, 'chatId'>
  ): Promise<TelegramTypes.ChatInviteLink>;

  public createChatInviteLink(
    chatIdOrOptions: string | number | TelegramTypes.CreateChatInviteLinkOption,
    options?: Omit<TelegramTypes.CreateChatInviteLinkOption, 'chatId'>
  ): Promise<TelegramTypes.ChatInviteLink> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/createChatInviteLink', data);
  }

  /**
   * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param options - Options for other optional parameters
   * @returns Returns the edited invite link as a ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#editchatinvitelink
   * @example
   * ```js
   * await telegram.editChatInviteLink({
   *   chatId: 427770117,
   *   inviteLink: 'https://www.example.com/link',
   *   memberLimit: 10,
   * });
   * ```
   */
  public editChatInviteLink(
    options: TelegramTypes.EditChatInviteLinkOption
  ): Promise<TelegramTypes.ChatInviteLink>;

  /**
   * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param inviteLink - The invite link to edit
   * @param options - Options for other optional parameters
   * @returns Returns the edited invite link as a ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#editchatinvitelink
   * @example
   * ```js
   * await telegram.editChatInviteLink(427770117, 'https://www.example.com/link', {
   *   memberLimit: 10,
   * });
   * ```
   */
  public editChatInviteLink(
    chatId: string | number,
    inviteLink: string,
    options?: Omit<
      TelegramTypes.EditChatInviteLinkOption,
      'chatId' | 'inviteLink'
    >
  ): Promise<TelegramTypes.ChatInviteLink>;

  public editChatInviteLink(
    chatIdOrOptions: string | number | TelegramTypes.EditChatInviteLinkOption,
    inviteLink?: string,
    options?: Omit<
      TelegramTypes.EditChatInviteLinkOption,
      'chatId' | 'inviteLink'
    >
  ): Promise<TelegramTypes.ChatInviteLink> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            inviteLink,
            ...options,
          };
    return this.request('/editChatInviteLink', data);
  }

  /**
   * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param options - Options for other optional parameters
   * @returns Returns the revoked invite link as ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#revokechatinvitelink
   * @example
   * ```js
   * await telegram.revokeChatInviteLink({
   *   chatId: 427770117,
   *   inviteLink: 'https://www.example.com/link',
   * });
   * ```
   */
  public revokeChatInviteLink(
    options: TelegramTypes.RevokeChatInviteLinkOption
  ): Promise<TelegramTypes.ChatInviteLink>;

  /**
   * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param inviteLink - The invite link to edit
   * @param options - Options for other optional parameters
   * @returns Returns the revoked invite link as ChatInviteLink object.
   * @see https://core.telegram.org/bots/api#revokechatinvitelink
   * @example
   * ```js
   * await telegram.revokeChatInviteLink(427770117, 'https://www.example.com/link');
   * ```
   */
  public revokeChatInviteLink(
    chatId: string | number,
    inviteLink: string
  ): Promise<TelegramTypes.ChatInviteLink>;

  public revokeChatInviteLink(
    chatIdOrOptions: string | number | TelegramTypes.RevokeChatInviteLinkOption,
    inviteLink?: string
  ): Promise<TelegramTypes.ChatInviteLink> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            inviteLink,
          };
    return this.request('/revokeChatInviteLink', data);
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
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletechatphoto
   * @example
   * ```js
   * await telegram.deleteChatPhoto({ chatId: CHAT_ID });
   * ```
   */
  public deleteChatPhoto(
    options: TelegramTypes.DeleteChatPhotoOption
  ): Promise<boolean>;

  /**
   * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletechatphoto
   * @example
   * ```js
   * await telegram.deleteChatPhoto(CHAT_ID);
   * ```
   */
  public deleteChatPhoto(chatId: string | number): Promise<boolean>;

  public deleteChatPhoto(
    chatIdOrOptions: string | number | TelegramTypes.DeleteChatPhotoOption
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/deleteChatPhoto', data);
  }

  /**
   * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchattitle
   * @example
   * ```js
   * await telegram.setChatTitle({ chatId: CHAT_ID, title: 'New Title' });
   * ```
   */
  public setChatTitle(
    options: TelegramTypes.SetChatTitleOption
  ): Promise<boolean>;

  /**
   * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * Note: In regular groups (non-supergroups), this method will only work if the ‘All Members Are Admins’ setting is off in the target group.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param title - New chat title, 1-255 characters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchattitle
   * @example
   * ```js
   * await telegram.setChatTitle(CHAT_ID, 'New Title');
   * ```
   */
  public setChatTitle(chatId: string | number, title: string): Promise<boolean>;

  public setChatTitle(
    chatIdOrOptions: string | number | TelegramTypes.SetChatTitleOption,
    title?: string
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            title,
          };
    return this.request('/setChatTitle', data);
  }

  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param options - Options for other optional parameters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatdescription
   * @example
   * ```js
   * await telegram.setChatDescription({
   *   chatId: CHAT_ID,
   *   description: 'New Description',
   * });
   * ```
   */
  public setChatDescription(
    options: TelegramTypes.SetChatDescriptionOption
  ): Promise<boolean>;

  /**
   * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param description - New chat description, 0-255 characters
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatdescription
   * @example
   * ```js
   * await telegram.setChatDescription(CHAT_ID, 'New Description');
   * ```
   */
  public setChatDescription(
    chatId: string | number,
    description: string
  ): Promise<boolean>;

  public setChatDescription(
    chatIdOrOptions: string | number | TelegramTypes.SetChatDescriptionOption,
    description?: string
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            description,
          };
    return this.request('/setChatDescription', data);
  }

  /**
   * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#pinchatmessage
   * @example
   * ```js
   * await telegram.pinChatMessage({
   *   chatId: CHAT_ID,
   *   messageId: MESSAGE_ID,
   *   disableNotification: true,
   * });
   * ```
   */
  public pinChatMessage(
    options: TelegramTypes.PinChatMessageOption
  ): Promise<boolean>;

  /**
   * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of a message to pin
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#pinchatmessage
   * @example
   * ```js
   * await telegram.pinChatMessage(CHAT_ID, MESSAGE_ID);
   * ```
   */
  public pinChatMessage(
    chatId: string | number,
    messageId: number,
    options?: Omit<TelegramTypes.PinChatMessageOption, 'chatId' | 'messageId'>
  ): Promise<boolean>;

  public pinChatMessage(
    chatIdOrOptions: string | number | TelegramTypes.PinChatMessageOption,
    messageId?: number,
    options?: Omit<TelegramTypes.PinChatMessageOption, 'chatId' | 'messageId'>
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            messageId,
            ...options,
          };
    return this.request('/pinChatMessage', data);
  }

  /**
   * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unpinchatmessage
   * @example
   * ```js
   * await telegram.unpinChatMessage({ chatId: CHAT_ID, messageId: MESSAGE_ID });
   * ```
   */
  public unpinChatMessage(
    options: TelegramTypes.UnpinChatMessageOption
  ): Promise<boolean>;

  /**
   * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unpinchatmessage
   * @example
   * ```js
   * await telegram.unpinChatMessage(CHAT_ID, MESSAGE_ID);
   * ```
   */
  public unpinChatMessage(
    chatId: string | number,
    messageId?: number
  ): Promise<boolean>;

  public unpinChatMessage(
    chatIdOrOptions: string | number | TelegramTypes.UnpinChatMessageOption,
    messageId?: number
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            messageId,
          };
    return this.request('/unpinChatMessage', data);
  }

  /**
   * Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in a supergroup or 'can_edit_messages' admin right in a channel.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unpinallchatmessages
   * @example
   * ```js
   * await telegram.unpinAllChatMessages({ chatId: CHAT_ID });
   * ```
   */
  public unpinAllChatMessages(
    options: TelegramTypes.UnpinAllChatMessagesOption
  ): Promise<boolean>;

  /**
   * Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' admin right in a supergroup or 'can_edit_messages' admin right in a channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#unpinallchatmessages
   * @example
   * ```js
   * await telegram.unpinAllChatMessages(CHAT_ID);
   * ```
   */
  public unpinAllChatMessages(chatId: string | number): Promise<boolean>;

  public unpinAllChatMessages(
    chatIdOrOptions: string | number | TelegramTypes.UnpinAllChatMessagesOption
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/unpinAllChatMessages', data);
  }

  /**
   * Use this method for your bot to leave a group, supergroup or channel.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#leavechat
   * @example
   * ```js
   * await telegram.leaveChat({ chatId: CHAT_ID });
   * ```
   */
  public leaveChat(options: TelegramTypes.LeaveChatOption): Promise<boolean>;

  /**
   * Use this method for your bot to leave a group, supergroup or channel.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#leavechat
   * @example
   * ```js
   * await telegram.leaveChat(CHAT_ID);
   * ```
   */
  public leaveChat(chatId: string | number): Promise<boolean>;

  public leaveChat(
    chatIdOrOptions: string | number | TelegramTypes.LeaveChatOption
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/leaveChat', data);
  }

  /**
   * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.).
   *
   * @param options - Options for other optional parameters.
   * @returns Returns a Chat object on success.
   * @see https://core.telegram.org/bots/api#getchat
   * @example
   * ```js
   * await telegram.getChat({ chatId: CHAT_ID });
   * // {
   * //   id: 313534466,
   * //   firstName: 'first',
   * //   lastName: 'last',
   * //   username: 'username',
   * //   type: 'private',
   * // }
   * ```
   */
  public getChat(
    options: TelegramTypes.GetChatOption
  ): Promise<TelegramTypes.Chat>;

  /**
   * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.).
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns Returns a Chat object on success.
   * @see https://core.telegram.org/bots/api#getchat
   * @example
   * ```js
   * await telegram.getChat(CHAT_ID);
   * // {
   * //   id: 313534466,
   * //   firstName: 'first',
   * //   lastName: 'last',
   * //   username: 'username',
   * //   type: 'private',
   * // }
   * ```
   */
  public getChat(chatId: string | number): Promise<TelegramTypes.Chat>;

  public getChat(
    chatIdOrOptions: string | number | TelegramTypes.GetChatOption
  ): Promise<TelegramTypes.Chat> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/getChat', data);
  }

  /**
   * Use this method to get a list of administrators in a chat.
   *
   * @param options - Options for other optional parameters.
   * @returns  On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
   * @see https://core.telegram.org/bots/api#getchatadministrators
   * @example
   * ```js
   * await telegram.getChatAdministrators({ chatId: CHAT_ID });
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
  public getChatAdministrators(
    options: TelegramTypes.GetChatAdministratorsOption
  ): Promise<TelegramTypes.ChatMember[]>;

  /**
   * Use this method to get a list of administrators in a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns  On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
   * @see https://core.telegram.org/bots/api#getchatadministrators
   * @example
   * ```js
   * await telegram.getChatAdministrators(CHAT_ID);
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
  public getChatAdministrators(
    chatId: string | number
  ): Promise<TelegramTypes.ChatMember[]>;

  public getChatAdministrators(
    chatIdOrOptions: string | number | TelegramTypes.GetChatAdministratorsOption
  ): Promise<TelegramTypes.ChatMember[]> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/getChatAdministrators', data);
  }

  /**
   * Use this method to get the number of members in a chat.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns Int on success.
   * @see https://core.telegram.org/bots/api#getchatmembercount
   * @example
   * ```js
   * await telegram.getChatMemberCount({ chatId: CHAT_ID });
   * // '6'
   * ```
   */
  public getChatMemberCount(
    options: TelegramTypes.GetChatMemberCountOption
  ): Promise<number>;

  /**
   * Use this method to get the number of members in a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @returns Returns Int on success.
   * @see https://core.telegram.org/bots/api#getchatmembercount
   * @example
   * ```js
   * await telegram.getChatMemberCount(CHAT_ID);
   * // '6'
   * ```
   */
  public getChatMemberCount(chatId: string | number): Promise<number>;

  public getChatMemberCount(
    chatIdOrOptions: string | number | TelegramTypes.GetChatMemberCountOption
  ): Promise<number> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/getChatMemberCount', data);
  }

  /**
   * Use this method to get information about a member of a chat.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns a ChatMember object on success.
   * @see https://core.telegram.org/bots/api#getchatmember
   * @example
   * ```js
   * await telegram.getChatMember({ chatId: CHAT_ID, userId: USER_ID });
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
  public getChatMember(
    options: TelegramTypes.GetChatMemberOption
  ): Promise<TelegramTypes.ChatMember>;

  /**
   * Use this method to get information about a member of a chat.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
   * @param userId - Unique identifier of the target user
   * @returns Returns a ChatMember object on success.
   * @see https://core.telegram.org/bots/api#getchatmember
   * @example
   * ```js
   * await telegram.getChatMember(CHAT_ID, USER_ID);
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
  public getChatMember(
    chatId: string | number,
    userId: number
  ): Promise<TelegramTypes.ChatMember>;

  public getChatMember(
    chatIdOrOptions: string | number | TelegramTypes.GetChatMemberOption,
    userId?: number
  ): Promise<TelegramTypes.ChatMember> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            userId,
          };
    return this.request('/getChatMember', data);
  }

  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatstickerset
   * @example
   * ```js
   * await telegram.setChatStickerSet({
   *   chatId: CHAT_ID,
   *   stickerSetName: 'Sticker Set Name',
   * });
   * ```
   */
  public setChatStickerSet(
    options: TelegramTypes.SetChatStickerSetOption
  ): Promise<boolean>;

  /**
   * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @param stickerSetName - Name of the sticker set to be set as the group sticker set
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setchatstickerset
   * @example
   * ```js
   * await telegram.setChatStickerSet(CHAT_ID, 'Sticker Set Name');
   * ```
   */
  public setChatStickerSet(
    chatId: string | number,
    stickerSetName: string
  ): Promise<boolean>;

  public setChatStickerSet(
    chatIdOrOptions: string | number | TelegramTypes.SetChatStickerSetOption,
    stickerSetName?: string
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            stickerSetName,
          };
    return this.request('/setChatStickerSet', data);
  }

  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletechatstickerset
   * @example
   * ```js
   * await telegram.deleteChatStickerSet({ chatId: CHAT_ID });
   * ```
   */
  public deleteChatStickerSet(
    options: TelegramTypes.DeleteChatStickerSetOption
  ): Promise<boolean>;

  /**
   * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field canSetStickerSet optionally returned in getChat requests to check if the bot can use this method.
   *
   * @param chatId - Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletechatstickerset
   * @example
   * ```js
   * await telegram.deleteChatStickerSet(CHAT_ID);
   * ```
   */
  public deleteChatStickerSet(chatId: string | number): Promise<boolean>;

  public deleteChatStickerSet(
    chatIdOrOptions: string | number | TelegramTypes.DeleteChatStickerSetOption
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
          };
    return this.request('/deleteChatStickerSet', data);
  }

  /**
   * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
   *
   * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via `@Botfather` and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
   *
   * @param options - Optional parameters for other parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answercallbackquery
   * @example
   * ```js
   * await telegram.answerCallbackQuery({
   *   callbackQueryId: 'CALLBACK_QUERY_ID',
   *   text: 'text',
   *   showAlert: true,
   * });
   * ```
   */
  public answerCallbackQuery(
    options: TelegramTypes.AnswerCallbackQueryOption
  ): Promise<boolean>;

  /**
   * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
   *
   * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via `@Botfather` and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
   *
   * @param callbackQueryId - Unique identifier for the query to be answered
   * @param options - Optional parameters for other parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answercallbackquery
   * @example
   * ```js
   * await telegram.answerCallbackQuery('CALLBACK_QUERY_ID');
   * ```
   */
  public answerCallbackQuery(
    callbackQueryId: string,
    options?: Omit<TelegramTypes.AnswerCallbackQueryOption, 'callbackQueryId'>
  ): Promise<boolean>;

  public answerCallbackQuery(
    callbackQueryIdOrOptions: string | TelegramTypes.AnswerCallbackQueryOption,
    options?: Omit<TelegramTypes.AnswerCallbackQueryOption, 'callbackQueryId'>
  ): Promise<boolean> {
    const data =
      typeof callbackQueryIdOrOptions === 'object'
        ? callbackQueryIdOrOptions
        : {
            callbackQueryId: callbackQueryIdOrOptions,
            ...options,
          };
    return this.request('/answerCallbackQuery', data);
  }

  /**
   * Use this method to change the list of the bot's commands. See https://core.telegram.org/bots#commands for more details about bot commands.
   *
   * @param options - Optional parameters for other parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setmycommands
   * @example
   * ```js
   * await telegram.setMyCommands({
   *   commands: [{ command: 'command', description: 'my command' }],
   * });
   * ```
   */
  public setMyCommands(
    options: TelegramTypes.SetMyCommandsOption
  ): Promise<boolean>;

  /**
   * Use this method to change the list of the bot's commands. See https://core.telegram.org/bots#commands for more details about bot commands.
   *
   * @param commands - A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
   * @param options - Optional parameters for other parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setmycommands
   * @example
   * ```js
   * await telegram.setMyCommands([
   *   { command: 'command', description: 'my command' }
   * ]);
   * ```
   */
  public setMyCommands(
    commands: TelegramTypes.BotCommand[],
    options?: Omit<TelegramTypes.SetMyCommandsOption, 'commands'>
  ): Promise<boolean>;

  public setMyCommands(
    commandsOrOptions:
      | TelegramTypes.BotCommand[]
      | TelegramTypes.SetMyCommandsOption,
    options?: Omit<TelegramTypes.SetMyCommandsOption, 'commands'>
  ): Promise<boolean> {
    const data = Array.isArray(commandsOrOptions)
      ? {
          commands: commandsOrOptions,
          ...options,
        }
      : commandsOrOptions;
    return this.request('/setMyCommands', data);
  }

  /**
   * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users.
   *
   * @param options - Optional parameters for other parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletemycommands
   * @example
   * ```js
   * await telegram.deleteMyCommands();
   * ```
   */
  public deleteMyCommands(
    options: TelegramTypes.DeleteMyCommandsOption
  ): Promise<boolean> {
    return this.request('/deleteMyCommands', { ...options });
  }

  /**
   * Use this method to get the current list of the bot's commands for the given scope and user language.
   *
   * @param options - Optional parameters for other parameters.
   * @returns Returns Array of BotCommand on success. If commands aren't set, an empty list is returned.
   * @see https://core.telegram.org/bots/api#getmycommands
   * @example
   * ```js
   * await telegram.getMyCommands();
   * // [{ command: 'command', description: 'desc..'}]
   * ```
   */
  public getMyCommands(
    options: TelegramTypes.GetMyCommandsOption
  ): Promise<TelegramTypes.BotCommand[]> {
    return this.request('/getMyCommands', { ...options });
  }

  /**
   * Use this method to edit text and game messages.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagetext
   * @example
   * ```js
   * await telegram.editMessageText({
   *   messageId: MESSAGE_ID,
   *   text: 'new_text',
   * });
   * ```
   */
  public editMessageText(
    options: TelegramTypes.EditMessageTextOption
  ): Promise<TelegramTypes.Message | boolean>;

  /**
   * Use this method to edit text and game messages.
   *
   * @param text - New text of the message
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagetext
   * @example
   * ```js
   * await telegram.editMessageText('new_text', { messageId: MESSAGE_ID });
   * ```
   */
  public editMessageText(
    text: string,
    options: DistributiveOmit<TelegramTypes.EditMessageTextOption, 'text'>
  ): Promise<TelegramTypes.Message | boolean>;

  public editMessageText(
    textOrOptions: string | TelegramTypes.EditMessageTextOption,
    options?: DistributiveOmit<TelegramTypes.EditMessageTextOption, 'text'>
  ): Promise<TelegramTypes.Message | boolean> {
    const data =
      typeof textOrOptions === 'object'
        ? textOrOptions
        : {
            text: textOrOptions,
            ...options,
          };
    return this.request('/editMessageText', data);
  }

  /**
   * Use this method to edit captions of messages.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagecaption
   * @example
   * ```js
   * await telegram.editMessageCaption({
   *   messageId: MESSAGE_ID,
   *   caption: 'new_caption',
   * });
   * ```
   */
  public editMessageCaption(
    options: TelegramTypes.EditMessageCaptionOption
  ): Promise<TelegramTypes.Message | boolean>;

  /**
   * Use this method to edit captions of messages.
   *
   * @param caption - New caption of the message
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagecaption
   * @example
   * ```js
   * await telegram.editMessageCaption('new_caption', { messageId: MESSAGE_ID });
   * ```
   */
  public editMessageCaption(
    caption: string,
    options: DistributiveOmit<TelegramTypes.EditMessageCaptionOption, 'caption'>
  ): Promise<TelegramTypes.Message | boolean>;

  public editMessageCaption(
    captionOrOptions: string | TelegramTypes.EditMessageCaptionOption,
    options?: DistributiveOmit<
      TelegramTypes.EditMessageCaptionOption,
      'caption'
    >
  ): Promise<TelegramTypes.Message | boolean> {
    const data =
      typeof captionOrOptions === 'object'
        ? captionOrOptions
        : {
            caption: captionOrOptions,
            ...options,
          };
    return this.request('/editMessageCaption', data);
  }

  /**
   * Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its file_id or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param options - Options for other optional parameters.
   * @see https://core.telegram.org/bots/api#editmessagemedia
   * @example
   * ```js
   * await telegram.editMessageMedia({
   *   chatId: 427770117,
   *   messageId: 66,
   *   media: {
   *     type: 'audio',
   *     media: 'https://example.com/audio.mp3',
   *     caption: 'caption',
   *     parseMode: 'MarkdownV2',
   *     duration: 1,
   *     performer: 'performer',
   *     title: 'title',
   *   },
   * });
   * ```
   */
  public editMessageMedia(
    options: TelegramTypes.EditMessageMediaOption
  ): Promise<TelegramTypes.Message | boolean>;

  /**
   * Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its file_id or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
   *
   * @param media - A JSON-serialized object for a new media content of the message
   * @param options - Options for other optional parameters.
   * @see https://core.telegram.org/bots/api#editmessagemedia
   * @example
   * ```js
   * await telegram.editMessageMedia(
   *   {
   *     type: 'audio',
   *     media: 'https://example.com/audio.mp3',
   *     caption: 'caption',
   *     parseMode: 'MarkdownV2',
   *     duration: 1,
   *     performer: 'performer',
   *     title: 'title',
   *   },
   *   {
   *     chatId: 427770117,
   *     messageId: 66,
   *   }
   * );
   * ```
   */
  public editMessageMedia(
    media: TelegramTypes.InputMedia,
    options: DistributiveOmit<TelegramTypes.EditMessageMediaOption, 'media'>
  ): Promise<TelegramTypes.Message | boolean>;

  public editMessageMedia(
    mediaOrOptions:
      | TelegramTypes.InputMedia
      | TelegramTypes.EditMessageMediaOption,
    options?: DistributiveOmit<TelegramTypes.EditMessageMediaOption, 'media'>
  ): Promise<TelegramTypes.Message | boolean> {
    const data =
      'chatId' in mediaOrOptions ||
      'messageId' in mediaOrOptions ||
      'inlineMessageId' in mediaOrOptions
        ? mediaOrOptions
        : {
            media: mediaOrOptions,
            ...options,
          };
    return this.request('/editMessageMedia', data);
  }

  /**
   * Use this method to edit only the reply markup of messages.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagereplymarkup
   * @example
   * ```js
   * await telegram.editMessageReplyMarkup({
   *   messageId: MESSAGE_ID
   *   keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
   *   resizeKeyboard: true,
   *   oneTimeKeyboard: true,
   * });
   * ```
   */
  public editMessageReplyMarkup(
    options: TelegramTypes.EditMessageReplyMarkupOption
  ): Promise<TelegramTypes.Message | boolean>;

  /**
   * Use this method to edit only the reply markup of messages.
   *
   * @param replyMarkup - A JSON-serialized object for an inline keyboard.
   * @param options - Options for other optional parameters. One of chatId, messageId or inlineMessageId is required.
   * @returns On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
   * @see https://core.telegram.org/bots/api#editmessagereplymarkup
   * @example
   * ```js
   * await telegram.editMessageReplyMarkup(
   *   {
   *     keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
   *     resizeKeyboard: true,
   *     oneTimeKeyboard: true,
   *   },
   *   { messageId: MESSAGE_ID }
   * );
   * ```
   */
  public editMessageReplyMarkup(
    replyMarkup: TelegramTypes.InlineKeyboardMarkup,
    options: DistributiveOmit<
      TelegramTypes.EditMessageReplyMarkupOption,
      'replyMarkup'
    >
  ): Promise<TelegramTypes.Message | boolean>;

  public editMessageReplyMarkup(
    replyMarkupOrOptions:
      | TelegramTypes.InlineKeyboardMarkup
      | TelegramTypes.EditMessageReplyMarkupOption,
    options?: DistributiveOmit<
      TelegramTypes.EditMessageReplyMarkupOption,
      'replyMarkup'
    >
  ): Promise<TelegramTypes.Message | boolean> {
    const data =
      'chatId' in replyMarkupOrOptions ||
      'messageId' in replyMarkupOrOptions ||
      'inlineMessageId' in replyMarkupOrOptions
        ? replyMarkupOrOptions
        : {
            replyMarkup: replyMarkupOrOptions,
            ...options,
          };
    return this.request('/editMessageReplyMarkup', data);
  }

  /**
   * Use this method to stop a poll which was sent by the bot.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the stopped Poll with the final results is returned.
   * @see https://core.telegram.org/bots/api#stoppoll
   * @example
   * ```js
   * await telegram.stopPoll({ chatId: 427770117, messageId: 66 });
   * ```
   */
  public stopPoll(
    options: TelegramTypes.StopPollOption
  ): Promise<TelegramTypes.Poll>;

  /**
   * Use this method to stop a poll which was sent by the bot.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param messageId - Identifier of the original message with the poll
   * @param options - Options for other optional parameters.
   * @returns On success, the stopped Poll with the final results is returned.
   * @see https://core.telegram.org/bots/api#stoppoll
   * @example
   * ```js
   * await telegram.stopPoll(427770117, 66);
   * ```
   */
  public stopPoll(
    chatId: string | number,
    messageId: number,
    options?: Omit<TelegramTypes.StopPollOption, 'chatId' | 'messageId'>
  ): Promise<TelegramTypes.Poll>;

  public stopPoll(
    chatIdOrOptions: string | number | TelegramTypes.StopPollOption,
    messageId?: number,
    options?: Omit<TelegramTypes.StopPollOption, 'chatId' | 'messageId'>
  ): Promise<TelegramTypes.Poll> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            messageId,
            ...options,
          };
    return this.request('/stopPoll', data);
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
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletemessage
   * @example
   * ```js
   * await telegram.deleteMessage({
   *   chatId: CHAT_ID,
   *   mesageId: MESSAGE_ID,
   * });
   * ```
   */
  public deleteMessage(
    options: TelegramTypes.DeleteMessageOption
  ): Promise<boolean>;

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
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletemessage
   * @example
   * ```js
   * await telegram.deleteMessage(CHAT_ID, MESSAGE_ID);
   * ```
   */
  public deleteMessage(
    chatId: string | number,
    messageId: number
  ): Promise<boolean>;

  public deleteMessage(
    chatIdOrOptions: string | number | TelegramTypes.DeleteMessageOption,
    messageId?: number
  ): Promise<boolean> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            messageId,
          };
    return this.request('/deleteMessage', data);
  }

  /**
   * Use this method to send static .WEBP or animated .TGS stickers.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendsticker
   * @example
   * ```js
   * await telegram.sendSticker({
   *   chatId: CHAT_ID,
   *   sticker: 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendSticker(
    options: TelegramTypes.SendStickerOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send static .WEBP or animated .TGS stickers.
   *
   * @param chatId - Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   * @param sticker - Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a .webp file from the Internet. Upload file is not supported yet.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendsticker
   * @example
   * ```js
   * await telegram.sendSticker(CHAT_ID, 'CAADAgADQAADyIsGAAE7MpzFPFQX5QI', {
   *   disableNotification: true,
   * });
   * ```
   */
  public sendSticker(
    chatId: string | number,
    sticker: string,
    options?: Omit<TelegramTypes.SendStickerOption, 'chatId' | 'sticker'>
  ): Promise<TelegramTypes.Message>;

  public sendSticker(
    chatIdOrOptions: string | number | TelegramTypes.SendStickerOption,
    sticker?: string,
    options?: Omit<TelegramTypes.SendStickerOption, 'chatId' | 'sticker'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            sticker,
            ...options,
          };
    return this.request('/sendSticker', data);
  }

  /**
   * Use this method to get a sticker set.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, a StickerSet object is returned.
   * @see https://core.telegram.org/bots/api#getstickerset
   * @example
   * ```js
   * await telegram.getStickerSet({ name: 'sticker set name' });
   * ```
   */
  public getStickerSet(
    options: TelegramTypes.GetStickerSetOption
  ): Promise<TelegramTypes.StickerSet>;

  /**
   * Use this method to get a sticker set.
   *
   * @param name - Name of the sticker set
   * @returns On success, a StickerSet object is returned.
   * @see https://core.telegram.org/bots/api#getstickerset
   * @example
   * ```js
   * await telegram.getStickerSet('sticker set name');
   * ```
   */
  public getStickerSet(name: string): Promise<TelegramTypes.StickerSet>;

  public getStickerSet(
    nameOrOptions: string | TelegramTypes.GetStickerSetOption
  ): Promise<TelegramTypes.StickerSet> {
    const data =
      typeof nameOrOptions === 'object'
        ? nameOrOptions
        : {
            name: nameOrOptions,
          };
    return this.request('/getStickerSet', data);
  }

  /**
   * @see https://core.telegram.org/bots/api#uploadstickerfile
   */
  // TODO: implement uploadStickerFile

  /**
   * Use this method to create new sticker set owned by a user. The bot will be able to edit the created sticker set.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#createnewstickerset
   * @example
   * ```js
   * await telegram.createNewStickerSet({
   *   userId: 1,
   *   name: 'sticker_set_name',
   *   title: 'title',
   *   pngSticker: 'https://example.com/sticker.png',
   *   emojis: '💛',
   * });
   * ```
   */
  public createNewStickerSet(
    options: TelegramTypes.CreateNewStickerSetOption
  ): Promise<boolean> {
    return this.request('/createNewStickerSet', {
      ...options,
    });
  }

  /**
   * Use this method to add a new sticker to a set created by the bot.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#addstickertoset
   * @example
   * ```js
   * await telegram.addStickerToSet({
   *   userId: 1,
   *   name: 'sticker_set_name',
   *   pngSticker: 'https://example.com/sticker.png',
   *   emojis: '💛',
   * });
   * ```
   */
  public addStickerToSet(
    options: TelegramTypes.AddStickerToSetOption
  ): Promise<boolean> {
    return this.request('/addStickerToSet', {
      ...options,
    });
  }

  /**
   * Use this method to move a sticker in a set created by the bot to a specific position.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setstickerpositioninset
   * @example
   * ```js
   * await telegram.setStickerPositionInSet({
   *   sticker: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
   *   position: 0,
   * });
   * ```
   */
  public setStickerPositionInSet(
    options: TelegramTypes.SetStickerPositionInSetOption
  ): Promise<boolean>;

  /**
   * Use this method to move a sticker in a set created by the bot to a specific position.
   *
   * @param sticker - File identifier of the sticker
   * @param position - New sticker position in the set, zero-based.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setstickerpositioninset
   * @example
   * ```js
   * await telegram.setStickerPositionInSet(
   *   'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB',
   *   0
   * );
   * ```
   */
  public setStickerPositionInSet(
    sticker: string,
    position: number
  ): Promise<boolean>;

  public setStickerPositionInSet(
    stickerOrOptions: string | TelegramTypes.SetStickerPositionInSetOption,
    position?: number
  ): Promise<boolean> {
    const data =
      typeof stickerOrOptions === 'object'
        ? stickerOrOptions
        : {
            sticker: stickerOrOptions,
            position,
          };
    return this.request('setStickerPositionInSet', data);
  }

  /**
   * Use this method to delete a sticker from a set created by the bot.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletestickerfromset
   * @example
   * ```js
   * await telegram.deleteStickerFromSet({
   *   sticker: 'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB'
   * });
   * ```
   */
  public deleteStickerFromSet(
    options: TelegramTypes.DeleteStickerFromSetOption
  ): Promise<boolean>;

  /**
   * Use this method to delete a sticker from a set created by the bot.
   *
   * @param sticker - File identifier of the sticker
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#deletestickerfromset
   * @example
   * ```js
   * await telegram.deleteStickerFromSet(
   *   'CAADBAADQwEAAhA1aAABVQO2hjT7dSEWB'
   * );
   * ```
   */
  public deleteStickerFromSet(sticker: string): Promise<boolean>;

  public deleteStickerFromSet(
    stickerOrOptions: string | TelegramTypes.DeleteStickerFromSetOption
  ): Promise<boolean> {
    const data =
      typeof stickerOrOptions === 'object'
        ? stickerOrOptions
        : {
            sticker: stickerOrOptions,
          };
    return this.request('/deleteStickerFromSet', data);
  }

  /**
   * Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only.
   *
   * @param options - Options for other optional parameters.
   * @returns Returns True on success.
   * @see https://core.telegram.org/bots/api#setstickersetthumb
   * @example
   * ```js
   * await telegram.setStickerSetThumb({
   *   name: 'sticker_set_name',
   *   userId: 1,
   *   thumb: 'thumb',
   * });
   * ```
   */
  public setStickerSetThumb(
    options: TelegramTypes.SetStickerSetThumbOption
  ): Promise<boolean> {
    return this.request('/setStickerSetThumb', { ...options });
  }

  /**
   * Use this method to send answers to an inline query. No more than 50 results per query are allowed.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answerinlinequery
   * @example
   * ```js
   * await telegram.answerInlineQuery(
   *   inlineQueryId: 'INLINE_QUERY_ID',
   *   results: [
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
   *   cacheTime: 1000,
   * });
   * ```
   */
  public answerInlineQuery(
    options: TelegramTypes.AnswerInlineQueryOption
  ): Promise<boolean>;

  /**
   * Use this method to send answers to an inline query. No more than 50 results per query are allowed.
   *
   * @param inlineQueryId - Unique identifier for the answered query
   * @param results - A JSON-serialized array of results for the inline query
   * @param options - Options for other optional parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answerinlinequery
   * @example
   * ```js
   * await telegram.answerInlineQuery(
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
  public answerInlineQuery(
    inlineQueryId: string,
    results: TelegramTypes.InlineQueryResult[],
    options?: Omit<
      TelegramTypes.AnswerInlineQueryOption,
      'inlineQueryId' | 'results'
    >
  ): Promise<boolean>;

  public answerInlineQuery(
    inlineQueryIdOrOptions: string | TelegramTypes.AnswerInlineQueryOption,
    results?: TelegramTypes.InlineQueryResult[],
    options?: TelegramTypes.AnswerInlineQueryOption
  ): Promise<boolean> {
    const data =
      typeof inlineQueryIdOrOptions === 'object'
        ? inlineQueryIdOrOptions
        : {
            inlineQueryId: inlineQueryIdOrOptions,
            results,
            ...options,
          };
    return this.request('/answerInlineQuery', data);
  }

  /**
   * Use this method to send invoices.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendinvoice
   * @example
   * ```js
   * await telegram.sendInvoice({
   *   chatId: CHAT_ID,
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
  public sendInvoice(
    options: TelegramTypes.SendInvoiceOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send invoices.
   *
   * @param chatId - Unique identifier for the target private chat
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendinvoice
   * @example
   * ```js
   * await telegram.sendInvoice(CHAT_ID, {
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
  public sendInvoice(
    chatId: number,
    options: Omit<TelegramTypes.SendInvoiceOption, 'chatId'>
  ): Promise<TelegramTypes.Message>;

  public sendInvoice(
    chatIdOrOptions: number | TelegramTypes.SendInvoiceOption,
    options?: Omit<TelegramTypes.SendInvoiceOption, 'chatId'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            ...options,
          };
    return this.request('/sendInvoice', data);
  }

  /**
   * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
   *
   * @param options - Options for other optional parameters.
   * @see https://core.telegram.org/bots/api#answershippingquery
   * @example
   * ```js
   * await telegram.answerShippingQuery({
   *   shippingQueryId: 'UNIQUE_ID',
   *   ok: true,
   *   shippingOptions: [{
   *     id: 'id',
   *     title: 'title',
   *     prices: [{ label: 'label', amount: 100 }],
   *   }],
   * });
   * ```
   */
  public answerShippingQuery(
    options: TelegramTypes.AnswerShippingQueryOption
  ): Promise<boolean>;

  /**
   * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
   *
   * @param shippingQueryId - Unique identifier for the query to be answered
   * @param ok - Specify True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
   * @param options - Options for other optional parameters.
   * @see https://core.telegram.org/bots/api#answershippingquery
   * @example
   * ```js
   * await telegram.answerShippingQuery('UNIQUE_ID', true, {
   *   shippingOptions: [{
   *     id: 'id',
   *     title: 'title',
   *     prices: [{ label: 'label', amount: 100 }],
   *   }],
   * });
   * ```
   */
  public answerShippingQuery(
    shippingQueryId: string,
    ok: boolean,
    options?: DistributiveOmit<
      TelegramTypes.AnswerShippingQueryOption,
      'shippingQueryId' | 'ok'
    >
  ): Promise<boolean>;

  public answerShippingQuery(
    shippingQueryIdOrOptions: string | TelegramTypes.AnswerShippingQueryOption,
    ok?: boolean,
    options?: DistributiveOmit<
      TelegramTypes.AnswerShippingQueryOption,
      'shippingQueryId' | 'ok'
    >
  ): Promise<boolean> {
    const data =
      typeof shippingQueryIdOrOptions === 'object'
        ? shippingQueryIdOrOptions
        : {
            shippingQueryId: shippingQueryIdOrOptions,
            ok,
            ...options,
          };
    return this.request('/answerShippingQuery', data);
  }

  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answerprecheckoutquery
   * @example
   * ```js
   * await telegram.answerPreCheckoutQuery({
   *   preCheckoutQueryId: 'UNIQUE_ID',
   *   ok: true,
   * });
   * ```
   */
  public answerPreCheckoutQuery(
    options: TelegramTypes.AnswerPreCheckoutQueryOption
  ): Promise<boolean>;

  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
   *
   * @param preCheckoutQueryId - Unique identifier for the query to be answered
   * @param ok - Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
   * @param options - Optional parameters for other parameters.
   * @returns On success, True is returned.
   * @see https://core.telegram.org/bots/api#answerprecheckoutquery
   * @example
   * ```js
   * await telegram.answerPreCheckoutQuery('UNIQUE_ID', true);
   * ```
   */
  public answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    options?: Omit<
      TelegramTypes.AnswerPreCheckoutQueryOption,
      'preCheckoutQueryId' | 'ok'
    >
  ): Promise<boolean>;

  public answerPreCheckoutQuery(
    preCheckoutQueryIdOrOptions:
      | string
      | TelegramTypes.AnswerPreCheckoutQueryOption,
    ok?: boolean,
    options?: Omit<
      TelegramTypes.AnswerPreCheckoutQueryOption,
      'preCheckoutQueryId' | 'ok'
    >
  ): Promise<boolean> {
    const data =
      typeof preCheckoutQueryIdOrOptions === 'object'
        ? preCheckoutQueryIdOrOptions
        : {
            preCheckoutQueryId: preCheckoutQueryIdOrOptions,
            ok,
            ...options,
          };
    return this.request('/answerPreCheckoutQuery', data);
  }

  /**
   * @see https://core.telegram.org/bots/api#setpassportdataerrors
   */
  // TODO: implement setPassportDataErrors

  /**
   * Use this method to send a game.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendgame
   * @example
   * ```js
   * await telegram.sendGame({
   *   chatId: CHAT_ID,
   *   gameShortName: 'Mario Bros.',
   *   disableNotification: true,
   * });
   * ```
   */
  public sendGame(
    options: TelegramTypes.SendGameOption
  ): Promise<TelegramTypes.Message>;

  /**
   * Use this method to send a game.
   *
   * @param chatId - Unique identifier for the target chat
   * @param gameShortName - Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
   * @param options - Options for other optional parameters.
   * @returns On success, the sent Message is returned.
   * @see https://core.telegram.org/bots/api#sendgame
   * @example
   * ```js
   * await telegram.sendGame(CHAT_ID, 'Mario Bros.', {
   *   disableNotification: true,
   * });
   * ```
   */
  public sendGame(
    chatId: number,
    gameShortName: string,
    options?: Omit<TelegramTypes.SendGameOption, 'chatId' | 'gameShortName'>
  ): Promise<TelegramTypes.Message>;

  public sendGame(
    chatIdOrOptions: number | TelegramTypes.SendGameOption,
    gameShortName?: string,
    options?: Omit<TelegramTypes.SendGameOption, 'chatId' | 'gameShortName'>
  ): Promise<TelegramTypes.Message> {
    const data =
      typeof chatIdOrOptions === 'object'
        ? chatIdOrOptions
        : {
            chatId: chatIdOrOptions,
            gameShortName,
            ...options,
          };
    return this.request('/sendGame', data);
  }

  /**
   * Use this method to set the score of the specified user in a game.
   *
   * @param options - Options for other optional parameters.
   * @returns On success, if the message was sent by the bot, returns the edited Message, otherwise returns True. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
   * @see https://core.telegram.org/bots/api#setgamescore
   * @example
   * ```js
   * await telegram.setGameScore({ userId: USER_ID, score: 999 });
   * ```
   */
  public setGameScore(
    options: TelegramTypes.SetGameScoreOption
  ): Promise<TelegramTypes.Message | boolean>;

  /**
   * Use this method to set the score of the specified user in a game.
   *
   * @param userId - User identifier
   * @param score - New score, must be non-negative
   * @param options - Options for other optional parameters.
   * @returns On success, if the message was sent by the bot, returns the edited Message, otherwise returns True. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
   * @see https://core.telegram.org/bots/api#setgamescore
   * @example
   * ```js
   * await telegram.setGameScore(USER_ID, 999);
   * ```
   */
  public setGameScore(
    userId: number,
    score: number,
    options?: DistributiveOmit<
      TelegramTypes.SetGameScoreOption,
      'userId' | 'score'
    >
  ): Promise<TelegramTypes.Message | boolean>;

  public setGameScore(
    userIdOrOptions: number | TelegramTypes.SetGameScoreOption,
    score?: number,
    options?: DistributiveOmit<
      TelegramTypes.SetGameScoreOption,
      'userId' | 'score'
    >
  ): Promise<TelegramTypes.Message | boolean> {
    const data =
      typeof userIdOrOptions === 'object'
        ? userIdOrOptions
        : {
            userId: userIdOrOptions,
            score,
            ...options,
          };
    return this.request('/setGameScore', data);
  }

  /**
   * Use this method to get data for high score tables. Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   *
   * This method will currently return scores for the target user, plus two of his closest neighbors on each side. Will also return the top three users if the user and his neighbors are not among them. Please note that this behavior is subject to change.
   *
   * @param options - Options for other parameters.
   * @returns Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   * @see https://core.telegram.org/bots/api#getgamehighscores
   * @example
   * ```js
   * await telegram.getGameHighScores({ userId: USER_ID });
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
  public getGameHighScores(
    options: TelegramTypes.GetGameHighScoresOption
  ): Promise<TelegramTypes.GameHighScore[]>;

  /**
   * Use this method to get data for high score tables. Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   *
   * This method will currently return scores for the target user, plus two of his closest neighbors on each side. Will also return the top three users if the user and his neighbors are not among them. Please note that this behavior is subject to change.
   *
   * @param userId - Target user id
   * @param options - Optional parameters for other parameters.
   * @returns Will return the score of the specified user and several of his neighbors in a game. On success, returns an Array of GameHighScore objects.
   * @see https://core.telegram.org/bots/api#getgamehighscores
   * @example
   * ```js
   * await telegram.getGameHighScores(USER_ID);
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
  public getGameHighScores(
    userId: number,
    options?: DistributiveOmit<TelegramTypes.GetGameHighScoresOption, 'userId'>
  ): Promise<TelegramTypes.GameHighScore[]>;

  public getGameHighScores(
    userIdOrOptions: number | TelegramTypes.GetGameHighScoresOption,
    options?: DistributiveOmit<TelegramTypes.GetGameHighScoresOption, 'userId'>
  ): Promise<TelegramTypes.GameHighScore[]> {
    const data =
      typeof userIdOrOptions === 'object'
        ? userIdOrOptions
        : {
            userId: userIdOrOptions,
            ...options,
          };
    return this.request('/getGameHighScores', data);
  }
}
