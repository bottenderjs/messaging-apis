import querystring from 'querystring';

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import difference from 'lodash/difference';
import imageType from 'image-type';
import invariant from 'invariant';
import pick from 'lodash/pick';
import warning from 'warning';
import {
  OnRequestFunction,
  createRequestInterceptor,
  snakecase,
} from 'messaging-api-common';

import Line from './Line';
import * as Types from './LineTypes';

function handleError(err: {
  message: string;
  response: {
    data: {
      message: string;
      details: {
        property: string;
        message: string;
      }[];
    };
  };
}): never {
  if (err.response && err.response.data) {
    const { message, details } = err.response.data;
    let msg = `LINE API - ${message}`;
    if (details && details.length > 0) {
      details.forEach(detail => {
        msg += `\n- ${detail.property}: ${detail.message}`;
      });
    }
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

export default class LineClient {
  static connect(
    accessTokenOrConfig: string | Types.ClientConfig,
    channelSecret?: string
  ): LineClient {
    return new LineClient(accessTokenOrConfig, channelSecret);
  }

  _channelSecret: string;

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  _accessToken: string;

  constructor(
    accessTokenOrConfig: string | Types.ClientConfig,
    channelSecret?: string
  ) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._accessToken = config.accessToken;
      this._channelSecret = config.channelSecret;
      this._onRequest = config.onRequest;
      origin = config.origin;
    } else {
      this._accessToken = accessTokenOrConfig;
      this._channelSecret = channelSecret as string;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  _optionWithoutKeys(option: any, removeKeys: string[]): Record<string, any> {
    let keys = Object.keys(option);
    keys = difference(keys, removeKeys);
    keys = difference(
      keys,
      removeKeys.map(key => snakecase(key))
    );
    return pick(option, keys);
  }

  /**
   * Reply Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
   */
  replyRawBody(
    body: {
      replyToken: string;
      messages: Types.Message[];
    },
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/reply',
        body,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  reply(
    replyToken: string,
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages }, options);
  }

  replyMessages(
    replyToken: string,
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, messages, options);
  }

  replyText(
    replyToken: string,
    text: string,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createText(text, options)], options);
  }

  replyImage(
    replyToken: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createImage(image, options)], options);
  }

  replyVideo(
    replyToken: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createVideo(video, options)], options);
  }

  replyAudio(
    replyToken: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createAudio(audio, options)], options);
  }

  replyLocation(
    replyToken: string,
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createLocation(location, options)],
      options
    );
  }

  replySticker(
    replyToken: string,
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createSticker(sticker, options)],
      options
    );
  }

  /**
   * Imagemap Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#imagemap-message
   */
  replyImagemap(
    replyToken: string,
    altText: string,
    imagemap: Omit<Types.ImagemapMessage, 'type' | 'altText'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createImagemap(altText, imagemap, options)],
      options
    );
  }

  /**
   * Flex Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#flex-message
   */
  replyFlex(
    replyToken: string,
    altText: string,
    flex: Types.FlexContainer,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createFlex(altText, flex, options)],
      options
    );
  }

  /**
   * Template Messages
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#template-messages
   */
  replyTemplate(
    replyToken: string,
    altText: string,
    template: Types.Template,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  replyButtonTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  replyButtonsTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.replyButtonTemplate(
      replyToken,
      altText,
      buttonTemplate,
      options
    );
  }

  replyConfirmTemplate(
    replyToken: string,
    altText: string,
    confirmTemplate: Omit<Types.ConfirmTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  replyCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: Types.ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & Types.MessageOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [
        Line.createCarouselTemplate(altText, columns, {
          imageAspectRatio,
          imageSize,
          ...options,
        }),
      ],
      options
    );
  }

  replyImageCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createImageCarouselTemplate(altText, columns, options)],
      options
    );
  }

  /**
   * Push Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-push-message
   */
  pushRawBody(
    body: {
      to: string;
      messages: Types.Message[];
    },
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/push',
        body,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  push(
    to: string,
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.pushRawBody({ to, messages }, options);
  }

  pushMessages(
    to: string,
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, messages, options);
  }

  pushText(
    to: string,
    text: string,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createText(text, options)], options);
  }

  pushImage(
    to: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createImage(image, options)], options);
  }

  pushVideo(
    to: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createVideo(video, options)], options);
  }

  pushAudio(
    to: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createAudio(audio, options)], options);
  }

  pushLocation(
    to: string,
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createLocation(location, options)], options);
  }

  pushSticker(
    to: string,
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createSticker(sticker, options)], options);
  }

  /**
   * Imagemap Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#imagemap-message
   */
  pushImagemap(
    to: string,
    altText: string,
    imagemap: Omit<Types.ImagemapMessage, 'type' | 'altText'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createImagemap(altText, imagemap, options)],
      options
    );
  }

  /**
   * Flex Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#flex-message
   */
  pushFlex(
    to: string,
    altText: string,
    flex: Types.FlexContainer,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createFlex(altText, flex, options)], options);
  }

  /**
   * Template Messages
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#template-messages
   */
  pushTemplate(
    to: string,
    altText: string,
    template: Types.Template,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  pushButtonTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  pushButtonsTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.pushButtonTemplate(to, altText, buttonTemplate, options);
  }

  pushConfirmTemplate(
    to: string,
    altText: string,
    confirmTemplate: Omit<Types.ConfirmTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  pushCarouselTemplate(
    to: string,
    altText: string,
    columns: Types.ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & Types.MessageOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [
        Line.createCarouselTemplate(altText, columns, {
          imageAspectRatio,
          imageSize,
          ...options,
        }),
      ],
      options
    );
  }

  pushImageCarouselTemplate(
    to: string,
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createImageCarouselTemplate(altText, columns, options)],
      options
    );
  }

  /**
   * Multicast
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages
   */
  multicastRawBody(
    body: {
      to: string[];
      messages: Types.Message[];
    },
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/multicast',
        body,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  multicast(
    to: string[],
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages }, options);
  }

  multicastMessages(
    to: string[],
    messages: Types.Message[],
    options?: Record<string, any>
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, messages, options);
  }

  multicastText(
    to: string[],
    text: string,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createText(text, options)], options);
  }

  multicastImage(
    to: string[],
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createImage(image, options)], options);
  }

  multicastVideo(
    to: string[],
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createVideo(video, options)], options);
  }

  multicastAudio(
    to: string[],
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createAudio(audio, options)], options);
  }

  multicastLocation(
    to: string[],
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createLocation(location, options)],
      options
    );
  }

  multicastSticker(
    to: string[],
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createSticker(sticker, options)], options);
  }

  /**
   * Imagemap Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#imagemap-message
   */
  multicastImagemap(
    to: string[],
    altText: string,
    imagemap: Omit<Types.ImagemapMessage, 'type' | 'altText'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createImagemap(altText, imagemap, options)],
      options
    );
  }

  /**
   * Flex Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#flex-message
   */
  multicastFlex(
    to: string[],
    altText: string,
    flex: Types.FlexContainer,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createFlex(altText, flex, options)],
      options
    );
  }

  /**
   * Template Messages
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#template-messages
   */
  multicastTemplate(
    to: string[],
    altText: string,
    template: Types.Template,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  multicastButtonTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  multicastButtonsTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicastButtonTemplate(to, altText, buttonTemplate, options);
  }

  multicastConfirmTemplate(
    to: string[],
    altText: string,
    confirmTemplate: Omit<Types.ConfirmTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  multicastCarouselTemplate(
    to: string[],
    altText: string,
    columns: Types.ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & Types.MessageOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [
        Line.createCarouselTemplate(altText, columns, {
          imageAspectRatio,
          imageSize,
          ...options,
        }),
      ],
      options
    );
  }

  multicastImageCarouselTemplate(
    to: string[],
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createImageCarouselTemplate(altText, columns, options)],
      options
    );
  }

  /**
   * Content
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-content
   */
  getMessageContent(
    messageId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Buffer> {
    return this._axios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'arraybuffer',
        ...(customAccessToken
          ? { headers: { Authorization: `Bearer ${customAccessToken}` } }
          : undefined),
      })
      .then(res => res.data, handleError);
  }

  retrieveMessageContent(
    messageId: string,
    options?: Types.AccessTokenOptions
  ) {
    warning(
      false,
      '`retrieveMessageContent` is deprecated. Use `getMessageContent` instead.'
    );
    return this.getMessageContent(messageId, options);
  }

  /**
   * Get User Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-profile
   * displayName, userId, pictureUrl, statusMessage
   */
  getUserProfile(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.User> {
    return this._axios
      .get(
        `/v2/bot/profile/${userId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Get Group Member Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-profile
   */
  getGroupMemberProfile(
    groupId: string,
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/member/${userId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Get Room Member Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-profile
   */
  getRoomMemberProfile(
    roomId: string,
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/member/${userId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Get Group Member IDs
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-user-ids
   */
  getGroupMemberIds(
    groupId: string,
    start?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  async getAllGroupMemberIds(
    groupId: string,
    options: Record<string, any> = {}
  ): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getGroupMemberIds(
        groupId,
        continuationToken,
        options
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Get Room Member IDs
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-user-ids
   */
  getRoomMemberIds(
    roomId: string,
    start?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  async getAllRoomMemberIds(
    roomId: string,
    options: Record<string, any> = {}
  ): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getRoomMemberIds(
        roomId,
        continuationToken,
        options
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Leave Group
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#leave-group
   */
  leaveGroup(
    groupId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        `/v2/bot/group/${groupId}/leave`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Leave Room
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#leave-room
   */
  leaveRoom(
    roomId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        `/v2/bot/room/${roomId}/leave`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Rich Menu
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#rich-menu
   */
  getRichMenuList({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}) {
    return this._axios
      .get(
        '/v2/bot/richmenu/list',
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data.richmenus, handleError);
  }

  getRichMenu(
    richMenuId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/richmenu/${richMenuId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  createRichMenu(
    richMenu: Types.RichMenu,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
        '/v2/bot/richmenu',
        richMenu,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  deleteRichMenu(
    richMenuId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
        `/v2/bot/richmenu/${richMenuId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  getLinkedRichMenu(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/user/${userId}/richmenu`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  linkRichMenu(
    userId: string,
    richMenuId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
        `/v2/bot/user/${userId}/richmenu/${richMenuId}`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  unlinkRichMenu(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
        `/v2/bot/user/${userId}/richmenu`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  getDefaultRichMenu({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}) {
    return this._axios
      .get(
        `/v2/bot/user/all/richmenu`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  setDefaultRichMenu(
    richMenuId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
        `/v2/bot/user/all/richmenu/${richMenuId}`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  deleteDefaultRichMenu({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}) {
    return this._axios
      .delete(
        `/v2/bot/user/all/richmenu`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * - Images must have one of the following resolutions: 2500x1686, 2500x843.
   * - You cannot replace an image attached to a rich menu.
   *   To update your rich menu image, create a new rich menu object and upload another image.
   */
  uploadRichMenuImage(
    richMenuId: string,
    image: Buffer,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    const type = imageType(image);
    invariant(
      type && (type.mime === 'image/jpeg' || type.mime === 'image/png'),
      'Image must be `image/jpeg` or `image/png`'
    );

    return this._axios
      .post(`/v2/bot/richmenu/${richMenuId}/content`, image, {
        headers: {
          'Content-Type': (type as { mime: string }).mime,
          ...(customAccessToken && {
            Authorization: `Bearer ${customAccessToken}`,
          }),
        },
      })
      .then(res => res.data, handleError);
  }

  downloadRichMenuImage(
    richMenuId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ) {
    return this._axios
      .get(`/v2/bot/richmenu/${richMenuId}/content`, {
        responseType: 'arraybuffer',
        headers: {
          ...(customAccessToken && {
            Authorization: `Bearer ${customAccessToken}`,
          }),
        },
      })
      .then(res => Buffer.from(res.data))
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Account link
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#account-link
   */

  issueLinkToken(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ linkToken: string }> {
    warning(
      false,
      '`issueLinkToken` is deprecated. Use `getLinkToken` instead. Note: It returns a string instead of an object.'
    );
    return this._axios
      .post<{ linkToken: string }>(
        `/v2/bot/user/${userId}/linkToken`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  getLinkToken(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<string> {
    return this._axios
      .post<{ linkToken: string }>(
        `/v2/bot/user/${userId}/linkToken`,
        null,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data.linkToken, handleError);
  }

  /**
   * LINE Front-end Framework (LIFF)
   *
   * https://developers.line.me/en/docs/liff/reference/#add-liff-app
   */
  getLiffAppList({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<{
    liffId: string;
    view: Types.LiffView;
  }> {
    return this._axios
      .get(
        '/liff/v1/apps',
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data.apps, handleError);
  }

  createLiffApp(
    view: Types.LiffView,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ liffId: string }> {
    return this._axios
      .post(
        '/liff/v1/apps',
        view,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  updateLiffApp(
    liffId: string,
    view: Types.LiffView,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<void> {
    return this._axios
      .put(
        `/liff/v1/apps/${liffId}/view`,
        view,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  deleteLiffApp(
    liffId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<void> {
    return this._axios
      .delete(
        `/liff/v1/apps/${liffId}`,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Get number of messages sent
   *
   */

  // https://developers.line.biz/en/reference/messaging-api/#get-quota
  getTargetLimitForAdditionalMessages({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<
    Types.TargetLimitForAdditionalMessages
  > {
    return this._axios
      .get<Types.TargetLimitForAdditionalMessages>(
        '/v2/bot/message/quota',
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-consumption
  getNumberOfMessagesSentThisMonth({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<
    Types.NumberOfMessagesSentThisMonth
  > {
    return this._axios
      .get<Types.NumberOfMessagesSentThisMonth>(
        '/v2/bot/message/quota/consumption',
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages
  getNumberOfSentReplyMessages(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/reply',
        {
          params: {
            date,
          },
          ...(customAccessToken
            ? {
                headers: { Authorization: `Bearer ${customAccessToken}` },
              }
            : {}),
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages
  getNumberOfSentPushMessages(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/push',
        {
          params: {
            date,
          },
          ...(customAccessToken
            ? {
                headers: { Authorization: `Bearer ${customAccessToken}` },
              }
            : {}),
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages
  getNumberOfSentMulticastMessages(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/multicast',
        {
          params: {
            date,
          },
          ...(customAccessToken
            ? {
                headers: { Authorization: `Bearer ${customAccessToken}` },
              }
            : {}),
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages
  getNumberOfSentBroadcastMessages(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/broadcast',
        {
          params: {
            date,
          },
          ...(customAccessToken
            ? {
                headers: { Authorization: `Bearer ${customAccessToken}` },
              }
            : {}),
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Insight
   *
   */

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-delivery-messages
  getNumberOfMessageDeliveries(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfMessageDeliveriesResponse> {
    return this._axios
      .get<Types.NumberOfMessageDeliveriesResponse>(
        '/v2/bot/insight/message/delivery',
        {
          params: {
            date,
          },
          ...(customAccessToken
            ? {
                headers: { Authorization: `Bearer ${customAccessToken}` },
              }
            : {}),
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-followers
  getNumberOfFollowers(
    date: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NumberOfFollowersResponse> {
    return this._axios
      .get<Types.NumberOfFollowersResponse>('/v2/bot/insight/followers', {
        params: {
          date,
        },
        ...(customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}),
      })
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-demographic
  getFriendDemographics({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<Types.FriendDemographics> {
    return this._axios
      .get<Types.FriendDemographics>(
        '/v2/bot/insight/demographic',
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Narrowcast Message
   *
   * https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message
   */
  narrowcastRawBody(
    body: {
      messages: Types.Message[];
      recipient?: Types.RecipientObject;
      filter?: { demographic: Types.DemographicFilterObject };
      limit?: {
        max: number;
      };
    },
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/narrowcast',
        body,
        customAccessToken
          ? {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  narrowcast(
    messages: Types.Message[],
    options?: Types.NarrowcastOptions
  ): Promise<Types.MutationSuccessResponse> {
    const filter = options?.demographic
      ? {
          demographic: options.demographic,
        }
      : undefined;
    const limit = options?.max
      ? {
          max: options?.max,
        }
      : undefined;
    return this.narrowcastRawBody(
      {
        messages,
        recipient: options?.recipient,
        filter,
        limit,
      },
      { accessToken: options?.accessToken }
    );
  }

  narrowcastMessages(
    messages: Types.Message[],
    options?: Types.NarrowcastOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.narrowcast(messages, options);
  }

  getNarrowcastProgress(
    requestId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.NarrowcastProgressResponse> {
    return this._axios
      .get(`/v2/bot/message/progress/narrowcast?requestId=${requestId}`, {
        ...(customAccessToken
          ? { headers: { Authorization: `Bearer ${customAccessToken}` } }
          : undefined),
      })
      .then(res => res.data, handleError);
  }

  /**
   * Audience
   *
   */

  // https://developers.line.biz/en/reference/messaging-api/#create-upload-audience-group
  createUploadAudienceGroup(
    description: string,
    isIfaAudience: boolean,
    audiences: Types.Audience[],
    options: Types.CreateUploadAudienceGroupOptions = {}
  ): Promise<Types.UploadAudienceGroup> {
    const bodyOptions = this._optionWithoutKeys(options, ['accessToken']);
    return this._axios
      .post(
        '/v2/bot/audienceGroup/upload',
        {
          description,
          isIfaAudience,
          audiences,
          ...bodyOptions,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Adds new user IDs or IFAs to an audience for uploading user IDs.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#update-upload-audience-group
   */
  updateUploadAudienceGroup(
    audienceGroupId: number,
    audiences: Types.Audience[],
    options: Types.UpdateUploadAudienceGroupOptions = {}
  ): Promise<Types.UploadAudienceGroup> {
    const bodyOptions = this._optionWithoutKeys(options, ['accessToken']);
    return this._axios
      .put(
        '/v2/bot/audienceGroup/upload',
        {
          audienceGroupId,
          audiences,
          ...bodyOptions,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Creates an audience for click-based retargeting. You can create up to 1,000 audiences.
   * A click-based retargeting audience is a collection of users who have clicked a URL contained in a broadcast or narrowcast message.
   * Use a request ID to identify the message. The message is sent to any user who has clicked at least one link.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#create-click-audience-group
   */
  createClickAudienceGroup(
    description: string,
    requestId: string,
    options: Types.CreateClickAudienceGroupOptions = {}
  ): Promise<Types.ClickAudienceGroup> {
    const bodyOptions = this._optionWithoutKeys(options, ['accessToken']);
    return this._axios
      .post(
        '/v2/bot/audienceGroup/click',
        {
          description,
          requestId,
          ...bodyOptions,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Creates an audience for impression-based retargeting. You can create up to 1,000 audiences.
   * An impression-based retargeting audience is a collection of users who have viewed a broadcast or narrowcast message.
   * Use a request ID to specify the message. The audience will include any user who has viewed at least one message bubble.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#create-imp-audience-group
   */
  createImpAudienceGroup(
    description: string,
    requestId: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.ImpAudienceGroup> {
    return this._axios
      .post(
        '/v2/bot/audienceGroup/imp',
        {
          description,
          requestId,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Renames an existing audience.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#set-description-audience-group
   */
  setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .put(
        `/v2/bot/audienceGroup/${audienceGroupId}/updateDescription`,
        {
          description,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Deletes an audience.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#delete-audience-group
   */
  deleteAudienceGroup(
    audienceGroupId: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .delete(
        `/v2/bot/audienceGroup/${audienceGroupId}`,
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Gets audience data.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#get-audience-group
   */
  getAudienceGroup(
    audienceGroupId: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.AudienceGroupWithJob> {
    return this._axios
      .get(
        `/v2/bot/audienceGroup/${audienceGroupId}`,
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * Gets data for more than one audience.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#get-audience-groups
   */
  getAudienceGroups(
    options: Types.GetAudienceGroupsOptions = {}
  ): Promise<Types.AudienceGroups> {
    const bodyOptions = this._optionWithoutKeys(options, ['accessToken']);
    bodyOptions.page = bodyOptions.page || 1;
    const query = querystring.stringify(bodyOptions);
    return this._axios
      .get(
        `/v2/bot/audienceGroup/list?${query}`,
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * オーディエンスの権限レベルを取得します。
   *
   * - https://developers.line.biz/en/reference/messaging-api/#get-authority-level
   */
  getAudienceGroupAuthorityLevel(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.AudienceGroupAuthorityLevel> {
    return this._axios
      .get(
        `/v2/bot/audienceGroup/authorityLevel`,
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }

  /**
   * 同じチャネルで作成された、すべてのオーディエンスの権限レベルを変更します。
   *
   * - https://developers.line.biz/en/reference/messaging-api/#change-authority-level
   */
  changeAudienceGroupAuthorityLevel(
    authorityLevel: 'PUBLIC' | 'PRIVATE',
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .put(
        `/v2/bot/audienceGroup/authorityLevel`,
        {
          authorityLevel,
        },
        options?.accessToken
          ? {
              headers: { Authorization: `Bearer ${options?.accessToken}` },
            }
          : {}
      )
      .then(res => res.data, handleError);
  }
}
