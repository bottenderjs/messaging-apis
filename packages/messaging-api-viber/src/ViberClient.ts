import axios, { AxiosInstance, AxiosResponse } from 'axios';
// import pick from 'lodash/pick';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  onRequest,
  pascalcaseKeysDeep,
  snakecaseKeysDeep,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as ViberTypes from './ViberTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { status, statusMessage } = response.data;
  if (status === 0) return response;
  const msg = `Viber API - ${status} ${statusMessage}`;
  throw new PrintableAxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

function wrapPrintableAxiosError(err: unknown) {
  return Promise.reject(
    axios.isAxiosError(err)
      ? new PrintableAxiosError(`Viber API - ${err.message}`, err)
      : err
  );
}

/**
 * @see https://developers.viber.com/docs/api/rest-bot-api/#viber-rest-api
 */
export default class ViberClient {
  /**
   * The underlying axios instance.
   */
  public readonly axios: AxiosInstance;

  /**
   * The access token used by the client.
   */
  private accessToken: string;

  /**
   * The sender used by the client.
   */
  private sender: ViberTypes.Sender;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * The constructor of ViberClient.
   *
   * @param config - the config object
   * @example
   * ```js
   * const viber = new ViberClient({
   *   accessToken: VIBER_AUTH_TOKEN,
   *   sender: {
   *     name: 'John McClane',
   *     avatar: 'http://avatar.example.com',
   *   },
   * });
   * ```
   */
  constructor(config: ViberTypes.ClientConfig) {
    this.accessToken = config.accessToken;
    this.sender = config.sender;
    this.onRequest = config.onRequest ?? onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin ?? 'https://chatapi.viber.com'}/pa/`,
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': this.accessToken,
      },
      transformRequest: [
        (data, headers) => {
          if (headers['Content-Type'] !== 'application/json' || !data) {
            return data;
          }

          const { keyboard, richMedia, ...rest } = data;

          // It only accepts "PascalCase" for keyboard and rich media
          return {
            ...snakecaseKeysDeep(rest),
            ...(keyboard
              ? { keyboard: pascalcaseKeysDeep(keyboard) }
              : undefined),
            ...(richMedia
              ? { rich_media: pascalcaseKeysDeep(richMedia) }
              : undefined),
          };
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
      createRequestInterceptor({ onRequest: this.onRequest })
    );

    this.axios.interceptors.response.use(
      throwErrorIfAny,
      wrapPrintableAxiosError
    );
  }

  /**
   * Webhooks
   *
   * @see https://viber.github.io/docs/api/rest-bot-api/#webhooks
   */

  /**
   * Sets a Webhook.
   *
   * @param url - Account webhook URL to receive callbacks & messages from users.
   * @param options - The optional parameters.
   * @returns status
   * @see https://developers.viber.com/docs/api/rest-bot-api/#setting-a-webhook
   * @example
   * ```js
   * await viber.setWebhook('https://4a16faff.ngrok.io/');
   *
   * // Or filter event types using optional parameter
   * await viber.setWebhook('https://4a16faff.ngrok.io/', {
   *   eventTypes: ['delivered', 'seen', 'conversation_started'],
   * });
   * ```
   */
  public setWebhook(
    url: string,
    options?: ViberTypes.SetWebhookOptions
  ): Promise<
    ViberTypes.SucceededResponseData<{
      eventTypes: ViberTypes.EventType[];
    }>
  > {
    return this.axios
      .post<
        ViberTypes.SucceededResponseData<{
          eventTypes: ViberTypes.EventType[];
        }>
      >('/set_webhook', {
        url,
        ...options,
      })
      .then((res) => res.data);
  }

  /**
   * Removes your webhook.
   *
   * @returns Status
   * @see https://developers.viber.com/docs/api/rest-bot-api/#removing-your-webhook
   * @example
   * ```js
   * await viber.removeWebhook();
   * ```
   */
  public removeWebhook(): Promise<
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
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#send-message
   * @example
   * ```js
   * await viber.sendMessage(USER_ID, {
   *   type: 'text',
   *   text: 'Hello',
   * });
   * ```
   */
  public sendMessage(
    receiver: string,
    message: ViberTypes.Message
  ): Promise<ViberTypes.SucceededResponseData<{ messageToken: number }>> {
    return this.axios
      .post('/send_message', {
        receiver,
        sender: this.sender,
        ...message,
      })
      .then((res) => res.data);
  }

  /**
   * Sends a text message to the user.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481925-61e46008-aeeb-11e7-842f-79fee8066c6a.jpg" width="300" />
   *
   * @param receiver - Unique Viber user id.
   * @param text - The text of the message.
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#text-message
   * @example
   * ```js
   * await viber.sendText(USER_ID, 'Hello');
   * ```
   */
  public sendText(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   * @example
   * ```js
   * await viber.sendPicture(USER_ID, {
   *   text: 'Photo description',
   *   media: 'http://www.images.com/img.jpg',
   *   thumbnail: 'http://www.images.com/thumb.jpg',
   * });
   * ```
   */
  public sendPicture(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#video-message
   * @example
   * ```js
   * await viber.sendVideo(USER_ID, {
   *   media: 'http://www.images.com/video.mp4',
   *   size: 10000,
   *   thumbnail: 'http://www.images.com/thumb.jpg',
   *   duration: 10,
   * });
   * ```
   */
  public sendVideo(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#file-message
   * @example
   * ```js
   * await viber.sendFile(USER_ID, {
   *   media: 'http://www.images.com/file.doc',
   *   size: 10000,
   *   fileName: 'name_of_file.doc',
   * });
   * ```
   */
  public sendFile(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   * @example
   * ```js
   * await viber.sendContact(USER_ID, {
   *   name: 'Itamar',
   *   phoneNumber: '+972511123123',
   * });
   * ```
   */
  public sendContact(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#location-message
   * @example
   * ```js
   * await viber.sendLocation(USER_ID, {
   *   lat: '37.7898',
   *   lon: '-122.3942',
   * });
   * ```
   */
  public sendLocation(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#url-message
   * @example
   * ```js
   * await viber.sendURL(USER_ID, 'http://developers.viber.com');
   * ```
   */
  public sendURL(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   * @example
   * ```js
   * await viber.sendSticker(USER_ID, 46105);
   * ```
   */
  public sendSticker(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   * @example
   * ```js
   * await viber.sendCarouselContent(USER_ID, {
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
  public sendCarouselContent(
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
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#broadcast-message
   * @example
   * ```js
   * await viber.broadcastMessage(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     type: 'text',
   *     text: 'Hello',
   *   }
   * );
   * ```
   */
  public broadcastMessage(
    broadcastList: string[],
    message: ViberTypes.Message
  ): Promise<ViberTypes.BroadcastResponseData> {
    return this.axios
      .post('/broadcast_message', {
        broadcastList,
        sender: this.sender,
        ...message,
      })
      .then((res) => res.data);
  }

  /**
   * Broadcasts text messages to the users.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/31481925-61e46008-aeeb-11e7-842f-79fee8066c6a.jpg" width="300" />
   *
   * @param broadcastList - This mandatory parameter defines the recipients for the message. Every user must be subscribed and have a valid user id. The maximum list length is 300 receivers.
   * @param text - The text of the message.
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#text-message
   * @example
   * ```js
   * await viber.broadcastText(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   'Hello'
   * );
   * ```
   */
  public broadcastText(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#picture-message
   * @example
   * ```js
   * await viber.broadcastPicture(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     text: 'Photo description',
   *     media: 'http://www.images.com/img.jpg',
   *     thumbnail: 'http://www.images.com/thumb.jpg',
   *   }
   * );
   * ```
   */
  public broadcastPicture(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#video-message
   * @example
   * ```js
   * await viber.broadcastVideo(
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
  public broadcastVideo(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#file-message
   * @example
   * ```js
   * await viber.broadcastFile(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     media: 'http://www.images.com/file.doc',
   *     size: 10000,
   *     fileName: 'name_of_file.doc',
   *   }
   * );
   * ```
   */
  public broadcastFile(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#contact-message
   * @example
   * ```js
   * await viber.broadcastContact(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     name: 'Itamar',
   *     phoneNumber: '+972511123123',
   *   }
   * );
   * ```
   */
  public broadcastContact(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#location-message
   * @example
   * ```js
   * await viber.broadcastLocation(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   {
   *     lat: '37.7898',
   *     lon: '-122.3942',
   *   }
   * );
   * ```
   */
  public broadcastLocation(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#url-message
   * @example
   * ```js
   * await viber.broadcastURL(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   'http://developers.viber.com'
   * );
   * ```
   */
  public broadcastURL(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#sticker-message
   * @example
   * ```js
   * await viber.broadcastSticker(
   *   ['pttm25kSGUo1919sBORWyA==', '2yBSIsbzs7sSrh4oLm2hdQ=='],
   *   46105
   * );
   * ```
   */
  public broadcastSticker(
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
   * @param options - other options
   * @returns status and message token
   * @see https://developers.viber.com/docs/api/rest-bot-api/#carousel-content-message
   * @example
   * ```js
   * await viber.broadcastCarouselContent(
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
  public broadcastCarouselContent(
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
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-account-info
   * @example
   * ```js
   * await viber.getAccountInfo();
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
  public getAccountInfo(): Promise<
    ViberTypes.SucceededResponseData<ViberTypes.AccountInfo>
  > {
    return this.axios
      .post<ViberTypes.SucceededResponseData<ViberTypes.AccountInfo>>(
        '/get_account_info',
        {}
      )
      .then((res) => res.data);
  }

  /**
   * Fetches the details of a specific Viber user based on his unique user ID.
   *
   * @param id - Unique Viber user id.
   * @returns Details of the Viber user.
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-user-details
   * @example
   * ```js
   * await viber.getUserDetails('01234567890A=');
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
  public async getUserDetails(id: string): Promise<ViberTypes.UserDetails> {
    const { user } = await this.axios
      .post<{
        user: ViberTypes.UserDetails;
      }>('/get_user_details', { id })
      .then((res) => res.data);

    return user;
  }

  /**
   * Fetches the online status of a given subscribed account members.
   *
   * @param ids - Array of unique Viber user id. 100 ids per request.
   * @returns An array of online status.
   * @see https://developers.viber.com/docs/api/rest-bot-api/#get-online
   * @example
   * ```js
   * await viber.getOnlineStatus(['01234567890=', '01234567891=', '01234567893=']);
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
  public async getOnlineStatus(
    ids: string[]
  ): Promise<ViberTypes.UserOnlineStatus[]> {
    const data = await this.axios
      .post<{
        users: ViberTypes.UserOnlineStatus[];
      }>('/get_online', { ids })
      .then((res) => res.data);

    return data.users;
  }
}
