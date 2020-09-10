import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  onRequest,
  pascalcaseKeysDeep,
  snakecaseKeys,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as ViberTypes from './ViberTypes';

function transformMessageCase(message: ViberTypes.Message): any {
  const { keyboard, richMedia, ...others } = message as any;

  return {
    ...snakecaseKeysDeep(others),
    ...(keyboard ? { keyboard: pascalcaseKeysDeep(keyboard) } : undefined),
    ...(richMedia
      ? {
          richMedia: pascalcaseKeysDeep(richMedia),
        }
      : undefined),
  } as any;
}

/**
 * @see https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  /**
   * @deprecated Use `new ViberClient(...)` instead.
   */
  static connect(config: ViberTypes.ClientConfig): ViberClient {
    warning(
      false,
      '`ViberClient.connect(...)` is deprecated. Use `new ViberClient(...)` instead.'
    );
    return new ViberClient(config);
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
   * The sender used by the client.
   */
  private sender: ViberTypes.Sender;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: ViberTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `ViberClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    this.sender = config.sender;
    this.onRequest = config.onRequest || onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://chatapi.viber.com'}/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': this.accessToken,
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );
  }

  private async callAPI<R extends object>(
    path: string,
    body: Record<string, any> = {}
  ): Promise<ViberTypes.SucceededResponseData<R>> {
    try {
      const response = await this.axios.post(
        path,

        // we can't apply a deep snake_case transform here
        // because it accept only PascalCase for keyboard and rich media
        snakecaseKeys(body, { deep: false })
      );

      const { config, request } = response;

      const data = camelcaseKeysDeep(
        response.data
      ) as any as ViberTypes.ResponseData<R>;

      if (data.status !== 0) {
        throw new AxiosError(`Viber API - ${data.statusMessage}`, {
          config,
          request,
          response,
        });
      }

      return data;
    } catch (err: any) {
      throw new AxiosError(err.message, err);
    }
  }

  /**
   * Webhooks
   *
   * @see https://viber.github.io/docs/api/rest-bot-api/#webhooks
   */

  /**
   * Sets a Webhook
   *
   * @param url - Account webhook URL to receive callbacks & messages from users.
   * @param options - The optional parameters.
   * @param options.eventTypes - Indicates the types of Viber events that the account owner would like to be notified about. Don’t include this parameter in your request to get all events. Possible values: `delivered`, `seen`, `failed`, `subscribed`, `unsubscribed` and `conversation_started`.
   * @param options.sendName - Indicates whether or not the bot should receive the user name. Default `false`.
   * @param options.sendPhoto - Indicates whether or not the bot should receive the user photo. Default `false`.
   * @returns Status
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#setting-a-webhook
   *
   * @example
   *
   * ```js
   * await client.setWebhook('https://4a16faff.ngrok.io/');
   *
   * // Or filter event types using optional parameter
   * await client.setWebhook('https://4a16faff.ngrok.io/', {
   *   eventTypes: ['delivered', 'seen', 'conversation_started'],
   * });
   * ```
   */
  setWebhook(
    url: string,
    optionsOrEventTypes:
      | ViberTypes.EventType[]
      | {
          eventTypes?: ViberTypes.EventType[];
          sendName?: boolean;
          sendPhoto?: boolean;
        } = {}
  ): Promise<
    ViberTypes.SucceededResponseData<{
      eventTypes: ViberTypes.EventType[];
    }>
  > {
    const options = Array.isArray(optionsOrEventTypes)
      ? { eventTypes: optionsOrEventTypes }
      : optionsOrEventTypes;

    return this.callAPI<{
      eventTypes: ViberTypes.EventType[];
    }>('/set_webhook', {
      url,
      ...options,
    });
  }

  /**
   * Removes your webhook
   *
   * @returns Status
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   *
   * @example
   *
   * ```js
   * await client.removeWebhook();
   * ```
   */
  removeWebhook(): Promise<
    ViberTypes.SucceededResponseData<{
      eventTypes: ViberTypes.EventType[];
    }>
  > {
    return this.setWebhook('');
  }

  /**
   * Sends a message to the user.
   *
   * @param receiver - Unique Viber user id.
   * @param message - Message and options to be sent.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#send-message
   *
   * @example
   *
   * ```js
   * await client.sendMessage(USER_ID, {
   *   type: 'text',
   *   text: 'Hello',
   * });
   * ```
   *
   * @note Maximum total JSON size of the request is 30kb.
   */
  sendMessage(
    receiver: string,
    message: ViberTypes.Message
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.callAPI('/send_message', {
      receiver,
      sender: this.sender,
      ...transformMessageCase(message),
    });
  }

  /**
   * Sends a text message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481925-61e46008-aeeb-11e7-842f-79fee8066c6a.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param text - The text of the message.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#text-message
   *
   * @example
   *
   * ```js
   * await client.sendText(USER_ID, 'Hello');
   * ```
   */
  sendText(
    receiver: string,
    text: string,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'text',
      text,
      ...options,
    });
  }

  /**
   * Sends a picture message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481916-5ec6cdac-aeeb-11e7-878b-6c8c4211a760.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param picture - The picture of the message.
   * @param picture.text - Description of the photo. Can be an empty string if irrelevant. Max 120 characters.
   * @param picture.media - URL of the image (JPEG). Max size 1 MB. Only JPEG format is supported. Other image formats as well as animated GIFs can be sent as URL messages or file messages.
   * @param picture.thumbnail - URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   *
   * @example
   *
   * ```js
   * await client.sendPicture(USER_ID, {
   *   text: 'Photo description',
   *   media: 'http://www.images.com/img.jpg',
   *   thumbnail: 'http://www.images.com/thumb.jpg',
   * });
   * ```
   */
  sendPicture(
    receiver: string,
    picture: ViberTypes.Picture,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'picture',
      text: picture.text,
      media: picture.media,
      thumbnail: picture.thumbnail,
      ...options,
    });
  }

  /**
   * Sends a video message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481918-5fa12074-aeeb-11e7-8287-830197d93b5b.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param video - The video of the message.
   * @param video.media - URL of the video (MP4, H264). Max size 50 MB. Only MP4 and H264 are supported.
   * @param video.size - Size of the video in bytes.
   * @param video.duration - Video duration in seconds; will be displayed to the receiver. Max 180 seconds.
   * @param video.thumbnail - URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#video-message
   *
   * @example
   *
   * ```js
   * await client.sendVideo(USER_ID, {
   *   media: 'http://www.images.com/video.mp4',
   *   size: 10000,
   *   thumbnail: 'http://www.images.com/thumb.jpg',
   *   duration: 10,
   * });
   * ```
   */
  sendVideo(
    receiver: string,
    video: ViberTypes.Video,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'video',
      media: video.media,
      size: video.size,
      thumbnail: video.thumbnail,
      duration: video.duration,
      ...options,
    });
  }

  /**
   * Sends a file message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481919-600f437e-aeeb-11e7-9f13-7269a055cb86.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param file - The file of the message.
   * @param file.media - URL of the file. Max size 50 MB. See [forbidden file formats](https://developers.viber.com/docs/api/rest-bot-api/#forbiddenFileFormats) for unsupported file types.
   * @param file.size - Size of the file in bytes.
   * @param file.fileName - Name of the file. File name should include extension. Max 256 characters (including file extension).
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#file-message
   *
   * @example
   *
   * ```js
   * await client.sendFile(USER_ID, {
   *   media: 'http://www.images.com/file.doc',
   *   size: 10000,
   *   fileName: 'name_of_file.doc',
   * });
   * ```
   */
  sendFile(
    receiver: string,
    file: ViberTypes.File,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'file',
      ...file,
      ...options,
    });
  }

  /**
   * Sends a contact message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481924-615ce8b2-aeeb-11e7-8425-2d3bfa115fc1.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param contact - The contact of the message.
   * @param contact.name - Name of the contact. Max 28 characters.
   * @param contact.phoneNumber - Phone number of the contact. Max 18 characters.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   *
   * @example
   *
   * ```js
   * await client.sendContact(USER_ID, {
   *   name: 'Itamar',
   *   phoneNumber: '+972511123123',
   * });
   * ```
   */
  sendContact(
    receiver: string,
    contact: ViberTypes.Contact,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'contact',
      contact,
      ...options,
    });
  }

  /**
   * Sends a location message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481923-61199a9e-aeeb-11e7-8a25-e3813eceb25b.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param location - The location of the message.
   * @param location.lat - Latitude (±90°) within valid ranges.
   * @param location.lon - Longitude (±180°) within valid ranges.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#location-message
   *
   * @example
   *
   * ```js
   * await client.sendLocation(USER_ID, {
   *   lat: '37.7898',
   *   lon: '-122.3942',
   * });
   * ```
   */
  sendLocation(
    receiver: string,
    location: ViberTypes.Location,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'location',
      location,
      ...options,
    });
  }

  /**
   * Sends an URL message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481921-6069f346-aeeb-11e7-97bf-83a17da0bc7a.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param url - URL. Max 2,000 characters.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#url-message
   *
   * @example
   *
   * ```js
   * await client.sendURL(USER_ID, 'http://developers.viber.com');
   * ```
   */
  sendURL(
    receiver: string,
    url: string,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'url',
      media: url,
      ...options,
    });
  }

  /**
   * Sends a sticker message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481922-60c2c444-aeeb-11e7-8fc9-bce2e5d06c42.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param stickerId - Unique Viber sticker ID. For examples visit the [sticker IDs](https://viber.github.io/docs/tools/sticker-ids/) page.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   *
   * @example
   *
   * ```js
   * await client.sendSticker(USER_ID, 46105);
   * ```
   */
  sendSticker(
    receiver: string,
    stickerId: number,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'sticker',
      stickerId,
      ...options,
    });
  }

  /**
   * Sends a carousel content message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481917-5f1b43b4-aeeb-11e7-8557-e25951d69b53.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param richMedia - The rich media of the message.
   * @param richMedia.buttonsGroupColumns - Number of columns per carousel content block. Default 6 columns. Possible values: 1 - 6.
   * @param richMedia.buttonsGroupRows - Number of rows per carousel content block. Default 7 rows. Possible values: 1 - 7.
   * @param richMedia.buttons - Array of buttons.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   *
   * @example
   *
   * ```js
   * await client.sendCarouselContent(USER_ID, {
   *   type: 'rich_media',
   *   buttonsGroupColumns: 6,
   *   buttonsGroupRows: 7,
   *   bgColor: '#FFFFFF',
   *   buttons: [
   *     {
   *       columns: 6,
   *       rows: 3,
   *       actionType: 'open-url',
   *       actionBody: 'https://www.google.com',
   *       image: 'http://html-test:8080/myweb/guy/assets/imageRMsmall2.png',
   *     },
   *     {
   *       columns: 6,
   *       rows: 2,
   *       text: '<font color=#323232><b>Headphones with Microphone, On-ear Wired earphones</b></font><font color=#777777><br>Sound Intone </font><font color=#6fc133>$17.99</font>',
   *       actionType: 'open-url',
   *       actionBody: 'https://www.google.com',
   *       textSize: 'medium',
   *       textVAlign: 'middle',
   *       textHAlign: 'left',
   *     },
   *     {
   *       columns: 6,
   *       rows: 1,
   *       actionType: 'reply',
   *       actionBody: 'https://www.google.com',
   *       text: '<font color=#ffffff>Buy</font>',
   *       textSize: 'large',
   *       textVAlign: 'middle',
   *       textHAlign: 'middle',
   *       image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
   *     },
   *     {
   *       columns: 6,
   *       rows: 1,
   *       actionType: 'reply',
   *       actionBody: 'https://www.google.com',
   *       text: '<font color=#8367db>MORE DETAILS</font>',
   *       textSize: 'small',
   *       textVAlign: 'middle',
   *       textHAlign: 'middle',
   *     },
   *     {
   *       columns: 6,
   *       rows: 3,
   *       actionType: 'open-url',
   *       actionBody: 'https://www.google.com',
   *       image: 'https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png',
   *     },
   *     {
   *       columns: 6,
   *       rows: 2,
   *       text: "<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
   *       actionType: 'open-url',
   *       actionBody: 'https://www.google.com',
   *       textSize: 'medium',
   *       textVAlign: 'middle',
   *       textHAlign: 'left',
   *     },
   *     {
   *       columns: 6,
   *       rows: 1,
   *       actionType: 'reply',
   *       actionBody: 'https://www.google.com',
   *       text: '<font color=#ffffff>Buy</font>',
   *       textSize: 'large',
   *       textVAlign: 'middle',
   *       textHAlign: 'middle',
   *       image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
   *     },
   *     {
   *       columns: 6,
   *       rows: 1,
   *       actionType: 'reply',
   *       actionBody: 'https://www.google.com',
   *       text: '<font color=#8367db>MORE DETAILS</font>',
   *       textSize: 'small',
   *       textVAlign: 'middle',
   *       textHAlign: 'middle',
   *     },
   *   ],
   * });
   * ```
   */
  sendCarouselContent(
    receiver: string,
    richMedia: ViberTypes.RichMedia,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.sendMessage(receiver, {
      type: 'rich_media',
      minApiVersion: 2,
      richMedia,
      ...options,
    });
  }

  /**
   * Broadcasts messages to the users.
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param message - Message and options to be sent.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#broadcast-message
   *
   * @example
   *
   * ```js
   * await client.broadcastMessage(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     type: 'text',
   *     text: 'Hello',
   *   }
   * );
   * ```
   */
  broadcastMessage(
    broadcastList: string[],
    message: ViberTypes.Message
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.callAPI('/broadcast_message', {
      broadcastList,
      sender: this.sender,
      ...transformMessageCase(message),
    });
  }

  /**
   * Broadcasts text messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481925-61e46008-aeeb-11e7-842f-79fee8066c6a.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param text - The text of the message.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#text-message
   *
   * @example
   *
   * ```js
   * await client.broadcastText(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   'Hello'
   * );
   * ```
   */
  broadcastText(
    broadcastList: string[],
    text: string,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'text',
      text,
      ...options,
    });
  }

  /**
   * Broadcasts picture messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481916-5ec6cdac-aeeb-11e7-878b-6c8c4211a760.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param picture - The picture of the message.
   * @param picture.text - Description of the photo. Can be an empty string if irrelevant. Max 120 characters.
   * @param picture.media - URL of the image (JPEG). Max size 1 MB. Only JPEG format is supported. Other image formats as well as animated GIFs can be sent as URL messages or file messages.
   * @param picture.thumbnail - URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   *
   * @example
   *
   * ```js
   * await client.broadcastPicture(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     text: 'Photo description',
   *     media: 'http://www.images.com/img.jpg',
   *     thumbnail: 'http://www.images.com/thumb.jpg',
   *   }
   * );
   * ```
   */
  broadcastPicture(
    broadcastList: string[],
    picture: ViberTypes.Picture,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'picture',
      text: picture.text,
      media: picture.media,
      thumbnail: picture.thumbnail,
      ...options,
    });
  }

  /**
   * Broadcasts video messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481918-5fa12074-aeeb-11e7-8287-830197d93b5b.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param video - The video of the message.
   * @param video.media - URL of the video (MP4, H264). Max size 50 MB. Only MP4 and H264 are supported.
   * @param video.size - Size of the video in bytes.
   * @param video.duration - Video duration in seconds; will be displayed to the receiver. Max 180 seconds.
   * @param video.thumbnail - URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#video-message
   *
   * @example
   *
   * ```js
   * await client.broadcastVideo(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     media: 'http://www.images.com/video.mp4',
   *     size: 10000,
   *     thumbnail: 'http://www.images.com/thumb.jpg',
   *     duration: 10,
   *   }
   * );
   * ```
   */
  broadcastVideo(
    broadcastList: string[],
    video: ViberTypes.Video,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'video',
      media: video.media,
      size: video.size,
      thumbnail: video.thumbnail,
      duration: video.duration,
      ...options,
    });
  }

  /**
   * Broadcasts file messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481919-600f437e-aeeb-11e7-9f13-7269a055cb86.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param file - The file of the message.
   * @param file.media - URL of the file. Max size 50 MB. See [forbidden file formats](https://developers.viber.com/docs/api/rest-bot-api/#forbiddenFileFormats) for unsupported file types.
   * @param file.size - Size of the file in bytes.
   * @param file.fileName - Name of the file. File name should include extension. Max 256 characters (including file extension).
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#file-message
   *
   * @example
   *
   * ```js
   * await client.broadcastFile(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     media: 'http://www.images.com/file.doc',
   *     size: 10000,
   *     fileName: 'name_of_file.doc',
   *   }
   * );
   * ```
   */
  broadcastFile(
    broadcastList: string[],
    file: ViberTypes.File,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'file',
      ...file,
      ...options,
    });
  }

  /**
   * Broadcasts contact messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481924-615ce8b2-aeeb-11e7-8425-2d3bfa115fc1.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param contact - The contact of the message.
   * @param contact.name - Name of the contact. Max 28 characters.
   * @param contact.phoneNumber - Phone number of the contact. Max 18 characters.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   *
   * @example
   *
   * ```js
   * await client.broadcastContact(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     name: 'Itamar',
   *     phoneNumber: '+972511123123',
   *   }
   * );
   * ```
   */
  broadcastContact(
    broadcastList: string[],
    contact: ViberTypes.Contact,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'contact',
      contact,
      ...options,
    });
  }

  /**
   * Broadcasts location messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481923-61199a9e-aeeb-11e7-8a25-e3813eceb25b.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param location - The location of the message.
   * @param location.lat - Latitude (±90°) within valid ranges.
   * @param location.lon - Longitude (±180°) within valid ranges.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#location-message
   *
   * @example
   *
   * ```js
   * await client.broadcastLocation(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     lat: '37.7898',
   *     lon: '-122.3942',
   *   }
   * );
   * ```
   */
  broadcastLocation(
    broadcastList: string[],
    location: ViberTypes.Location,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'location',
      location,
      ...options,
    });
  }

  /**
   * Broadcasts URL messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481921-6069f346-aeeb-11e7-97bf-83a17da0bc7a.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param url - URL. Max 2,000 characters.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#url-message
   *
   * @example
   *
   * ```js
   * await client.broadcastURL(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   'http://developers.viber.com'
   * );
   * ```
   */
  broadcastURL(
    broadcastList: string[],
    url: string,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'url',
      media: url,
      ...options,
    });
  }

  /**
   * Broadcasts sticker messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481922-60c2c444-aeeb-11e7-8fc9-bce2e5d06c42.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param stickerId - Unique Viber sticker ID. For examples visit the [sticker IDs](https://viber.github.io/docs/tools/sticker-ids/) page.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   *
   * @example
   *
   * ```js
   * await client.broadcastSticker(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   46105
   * );
   * ```
   */
  broadcastSticker(
    broadcastList: string[],
    stickerId: number,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'sticker',
      stickerId,
      ...options,
    });
  }

  /**
   * Broadcasts carousel content messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481917-5f1b43b4-aeeb-11e7-8557-e25951d69b53.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param richMedia - The rich media of the message.
   * @param richMedia.buttonsGroupColumns - Number of columns per carousel content block. Default 6 columns. Possible values: 1 - 6.
   * @param richMedia.buttonsGroupRows - Number of rows per carousel content block. Default 7 rows. Possible values: 1 - 7.
   * @param richMedia.buttons - Array of buttons.
   * @param options - Other optional parameters.
   * @returns Status and message token
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   *
   * @example
   *
   * ```js
   * await client.broadcastCarouselContent(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     type: 'rich_media',
   *     buttonsGroupColumns: 6,
   *     buttonsGroupRows: 7,
   *     bgColor: '#FFFFFF',
   *     buttons: [
   *       {
   *         columns: 6,
   *         rows: 3,
   *         actionType: 'open-url',
   *         actionBody: 'https://www.google.com',
   *         image: 'http://html-test:8080/myweb/guy/assets/imageRMsmall2.png',
   *       },
   *       {
   *         columns: 6,
   *         rows: 2,
   *         text: '<font color=#323232><b>Headphones with Microphone, On-ear Wired earphones</b></font><font color=#777777><br>Sound Intone </font><font color=#6fc133>$17.99</font>',
   *         actionType: 'open-url',
   *         actionBody: 'https://www.google.com',
   *         textSize: 'medium',
   *         textVAlign: 'middle',
   *         textHAlign: 'left',
   *       },
   *       {
   *         columns: 6,
   *         rows: 1,
   *         actionType: 'reply',
   *         actionBody: 'https://www.google.com',
   *         text: '<font color=#ffffff>Buy</font>',
   *         textSize: 'large',
   *         textVAlign: 'middle',
   *         textHAlign: 'middle',
   *         image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
   *       },
   *       {
   *         columns: 6,
   *         rows: 1,
   *         actionType: 'reply',
   *         actionBody: 'https://www.google.com',
   *         text: '<font color=#8367db>MORE DETAILS</font>',
   *         textSize: 'small',
   *         textVAlign: 'middle',
   *         textHAlign: 'middle',
   *       },
   *       {
   *         columns: 6,
   *         rows: 3,
   *         actionType: 'open-url',
   *         actionBody: 'https://www.google.com',
   *         image: 'https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png',
   *       },
   *       {
   *         columns: 6,
   *         rows: 2,
   *         text: "<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
   *         actionType: 'open-url',
   *         actionBody: 'https://www.google.com',
   *         textSize: 'medium',
   *         textVAlign: 'middle',
   *         textHAlign: 'left',
   *       },
   *       {
   *         columns: 6,
   *         rows: 1,
   *         actionType: 'reply',
   *         actionBody: 'https://www.google.com',
   *         text: '<font color=#ffffff>Buy</font>',
   *         textSize: 'large',
   *         textVAlign: 'middle',
   *         textHAlign: 'middle',
   *         image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
   *       },
   *       {
   *         columns: 6,
   *         rows: 1,
   *         actionType: 'reply',
   *         actionBody: 'https://www.google.com',
   *         text: '<font color=#8367db>MORE DETAILS</font>',
   *         textSize: 'small',
   *         textVAlign: 'middle',
   *         textHAlign: 'middle',
   *       },
   *     ],
   *   }
   * );
   * ```
   */
  broadcastCarouselContent(
    broadcastList: string[],
    richMedia: ViberTypes.RichMedia,
    options?: ViberTypes.MessageOptions
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.broadcastMessage(broadcastList, {
      type: 'rich_media',
      minApiVersion: 2,
      richMedia,
      ...options,
    });
  }

  /**
   * Fetches the account’s details as registered in ViberTypes.
   *
   * @returns The account’s details
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-account-info
   *
   * @example
   *
   * ```js
   * await client.getAccountInfo();
   * // {
   * //   status: 0,
   * //   statusMessage: 'ok',
   * //   id: 'pa:75346594275468546724',
   * //   name: 'account name',
   * //   uri: 'accountUri',
   * //   icon: 'http://example.com',
   * //   background: 'http://example.com',
   * //   category: 'category',
   * //   subcategory: 'sub category',
   * //   location: {
   * //     lon: 0.1,
   * //     lat: 0.2,
   * //   },
   * //   country: 'UK',
   * //   webhook: 'https://my.site.com',
   * //   eventTypes: ['delivered', 'seen'],
   * //   subscribersCount: 35,
   * //   members: [
   * //     {
   * //       id: '01234567890A=',
   * //       name: 'my name',
   * //       avatar: 'http://example.com',
   * //       role: 'admin',
   * //     },
   * //   ],
   * // }
   * ```
   */
  getAccountInfo(): Promise<
    ViberTypes.SucceededResponseData<ViberTypes.AccountInfo>
  > {
    return this.callAPI<ViberTypes.AccountInfo>('/get_account_info');
  }

  /**
   * Fetches the details of a specific Viber user based on his unique user ID.
   *
   * @param id - Unique Viber user id.
   * @returns Details of the Viber user.
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   *
   * @example
   *
   * ```js
   * await client.getUserDetails('01234567890A=');
   * // {
   * //   id: '01234567890A=',
   * //   name: 'John McClane',
   * //   avatar: 'http://avatar.example.com',
   * //   country: 'UK',
   * //   language: 'en',
   * //   primaryDeviceOs: 'android 7.1',
   * //   apiVersion: 1,
   * //   viberVersion: '6.5.0',
   * //   mcc: 1,
   * //   mnc: 1,
   * //   deviceType: 'iPhone9,4',
   * // };
   * ```
   */
  async getUserDetails(id: string): Promise<ViberTypes.UserDetails> {
    const { user } = await this.callAPI<{
      user: ViberTypes.UserDetails;
    }>('/get_user_details', { id });

    return user;
  }

  /**
   * Fetches the online status of a given subscribed account members.
   *
   * @param ids - Array of unique Viber user id. 100 ids per request.
   * @returns An array of online status.
   *
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-online
   *
   * @example
   *
   * ```js
   * await client.getOnlineStatus(['01234567890=', '01234567891=', '01234567893=']);
   * // [
   * //   {
   * //     id: '01234567890=',
   * //     onlineStatus: 0,
   * //     onlineStatusMessage: 'online',
   * //   },
   * //   {
   * //     id: '01234567891=',
   * //     onlineStatus: 1,
   * //     onlineStatusMessage: 'offline',
   * //     lastOnline: 1457764197627,
   * //   },
   * //   {
   * //     id: '01234567893=',
   * //     onlineStatus: 3,
   * //     onlineStatusMessage: 'tryLater',
   * //   },
   * // ];
   * ```
   */
  async getOnlineStatus(ids: string[]): Promise<ViberTypes.UserOnlineStatus[]> {
    const data = await this.callAPI<{
      users: ViberTypes.UserOnlineStatus[];
    }>('/get_online', { ids });

    return data.users;
  }
}
