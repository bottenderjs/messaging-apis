import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import imageType from 'image-type';
import invariant from 'invariant';
import omit from 'lodash.omit';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import Line from './Line';
import {
  ButtonsTemplate,
  ColumnObject,
  ConfirmTemplate,
  FlexContainer,
  ImageCarouselColumnObject,
  ImagemapMessage,
  LiffView,
  Location,
  Message,
  MessageOptions,
  MutationSuccessResponse,
  RichMenu,
  StickerMessage,
  Template,
  User,
} from './LineTypes';

type ClientConfig = {
  accessToken: string;
  channelSecret: string;
  origin?: string;
  onRequest?: Function;
};

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
    accessTokenOrConfig: string | ClientConfig,
    channelSecret?: string
  ): LineClient {
    return new LineClient(accessTokenOrConfig, channelSecret);
  }

  _channelSecret: string;

  _onRequest: Function;

  _axios: AxiosInstance;

  _accessToken: string;

  constructor(
    accessTokenOrConfig: string | ClientConfig,
    channelSecret?: string
  ) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._accessToken = config.accessToken;
      this._channelSecret = config.channelSecret;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._accessToken = accessTokenOrConfig;
      this._channelSecret = channelSecret as string;
      this._onRequest = onRequest;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
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
    return this._accessToken;
  }

  /**
   * Reply Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
   */
  replyRawBody(
    body: {
      replyToken: string;
      messages: Message[];
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/reply',
        body,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  reply(
    replyToken: string,
    messages: Message[],
    options: Record<string, any> = {}
  ): Promise<MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages }, options);
  }

  replyMessages(
    replyToken: string,
    messages: Message[],
    options: Record<string, any> = {}
  ): Promise<MutationSuccessResponse> {
    return this.reply(replyToken, messages, options);
  }

  replyText(
    replyToken: string,
    text: string,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createText(text, options)], options);
  }

  replyImage(
    replyToken: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createImage(image, options)], options);
  }

  replyVideo(
    replyToken: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options: MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createVideo(video, options)], options);
  }

  replyAudio(
    replyToken: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options: MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createAudio(audio, options)], options);
  }

  replyLocation(
    replyToken: string,
    location: Location,
    options: MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createLocation(location, options)],
      options
    );
  }

  replySticker(
    replyToken: string,
    sticker: Omit<StickerMessage, 'type'>,
    options: MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    imagemap: Omit<ImagemapMessage, 'type' | 'altText'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    flex: FlexContainer,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    template: Template,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  replyButtonTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  replyButtonsTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    confirmTemplate: Omit<ConfirmTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.reply(
      replyToken,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  replyCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    columns: ImageCarouselColumnObject[],
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
      messages: Message[];
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/push',
        body,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  push(
    to: string,
    messages: Message[],
    options: Record<string, any>
  ): Promise<MutationSuccessResponse> {
    return this.pushRawBody({ to, messages }, options);
  }

  pushMessages(
    to: string,
    messages: Message[],
    options: Record<string, any>
  ): Promise<MutationSuccessResponse> {
    return this.push(to, messages, options);
  }

  pushText(
    to: string,
    text: string,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(to, [Line.createText(text, options)], options);
  }

  pushImage(
    to: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(to, [Line.createImage(image, options)], options);
  }

  pushVideo(
    to: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(to, [Line.createVideo(video, options)], options);
  }

  pushAudio(
    to: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(to, [Line.createAudio(audio, options)], options);
  }

  pushLocation(
    to: string,
    location: Location,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(to, [Line.createLocation(location, options)], options);
  }

  pushSticker(
    to: string,
    sticker: Omit<StickerMessage, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    imagemap: Omit<ImagemapMessage, 'type' | 'altText'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    flex: FlexContainer,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    template: Template,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  pushButtonTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  pushButtonsTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.pushButtonTemplate(to, altText, buttonTemplate, options);
  }

  pushConfirmTemplate(
    to: string,
    altText: string,
    confirmTemplate: Omit<ConfirmTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.push(
      to,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  pushCarouselTemplate(
    to: string,
    altText: string,
    columns: ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    columns: ImageCarouselColumnObject[],
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
      messages: Message[];
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/multicast',
        body,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  multicast(
    to: string[],
    messages: Message[],
    options: Record<string, any>
  ): Promise<MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages }, options);
  }

  multicastMessages(
    to: string[],
    messages: Message[],
    options: Record<string, any>
  ): Promise<MutationSuccessResponse> {
    return this.multicast(to, messages, options);
  }

  multicastText(
    to: string[],
    text: string,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(to, [Line.createText(text, options)], options);
  }

  multicastImage(
    to: string[],
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(to, [Line.createImage(image, options)], options);
  }

  multicastVideo(
    to: string[],
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(to, [Line.createVideo(video, options)], options);
  }

  multicastAudio(
    to: string[],
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(to, [Line.createAudio(audio, options)], options);
  }

  multicastLocation(
    to: string[],
    location: Location,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createLocation(location, options)],
      options
    );
  }

  multicastSticker(
    to: string[],
    sticker: Omit<StickerMessage, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    imagemap: Omit<ImagemapMessage, 'type' | 'altText'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    flex: FlexContainer,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
    template: Template,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createTemplate(altText, template, options)],
      options
    );
  }

  multicastButtonTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createButtonTemplate(altText, buttonTemplate, options)],
      options
    );
  }

  multicastButtonsTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<ButtonsTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicastButtonTemplate(to, altText, buttonTemplate, options);
  }

  multicastConfirmTemplate(
    to: string[],
    altText: string,
    confirmTemplate: Omit<ConfirmTemplate, 'type'>,
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this.multicast(
      to,
      [Line.createConfirmTemplate(altText, confirmTemplate, options)],
      options
    );
  }

  multicastCarouselTemplate(
    to: string[],
    altText: string,
    columns: ColumnObject[],
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square';
      imageSize?: 'cover' | 'contain';
    } & MessageOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    columns: ImageCarouselColumnObject[],
    options: MessageOptions
  ): Promise<MutationSuccessResponse> {
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
  retrieveMessageContent(
    messageId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
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

  /**
   * Get User Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-profile
   * displayName, userId, pictureUrl, statusMessage
   */
  getUserProfile(
    userId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<User> {
    return this._axios
      .get(
        `/v2/bot/profile/${userId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/member/${userId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/member/${userId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        `/v2/bot/group/${groupId}/leave`,
        null,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        `/v2/bot/room/${roomId}/leave`,
        null,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
  }: { accessToken?: string } = {}) {
    return this._axios
      .get(
        '/v2/bot/richmenu/list',
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data.richmenus, handleError);
  }

  getRichMenu(
    richMenuId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/richmenu/${richMenuId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    richMenu: RichMenu,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .post(
        '/v2/bot/richmenu',
        richMenu,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  deleteRichMenu(
    richMenuId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .delete(
        `/v2/bot/richmenu/${richMenuId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  getLinkedRichMenu(
    userId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/user/${userId}/richmenu`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .post(
        `/v2/bot/user/${userId}/richmenu/${richMenuId}`,
        null,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  unlinkRichMenu(
    userId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .delete(
        `/v2/bot/user/${userId}/richmenu`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  getDefaultRichMenu({
    accessToken: customAccessToken,
  }: { accessToken?: string } = {}) {
    return this._axios
      .get(
        `/v2/bot/user/all/richmenu`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .post(
        `/v2/bot/user/all/richmenu/${richMenuId}`,
        null,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  deleteDefaultRichMenu({
    accessToken: customAccessToken,
  }: { accessToken?: string } = {}) {
    return this._axios
      .delete(
        `/v2/bot/user/all/richmenu`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
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
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<{ issueToken: string }> {
    return this._axios
      .post(
        `/v2/bot/user/${userId}/linkToken`,
        null,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  /**
   * LINE Front-end Framework (LIFF)
   *
   * https://developers.line.me/en/docs/liff/reference/#add-liff-app
   */
  getLiffAppList({
    accessToken: customAccessToken,
  }: { accessToken?: string } = {}): Promise<{
    liffId: string;
    view: LiffView;
  }> {
    return this._axios
      .get(
        '/liff/v1/apps',
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data.apps, handleError);
  }

  createLiffApp(
    view: LiffView,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<{ liffId: string }> {
    return this._axios
      .post(
        '/liff/v1/apps',
        view,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  updateLiffApp(
    liffId: string,
    view: LiffView,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<void> {
    return this._axios
      .put(
        `/liff/v1/apps/${liffId}/view`,
        view,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }

  deleteLiffApp(
    liffId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<void> {
    return this._axios
      .delete(
        `/liff/v1/apps/${liffId}`,
        customAccessToken === undefined
          ? undefined
          : {
              headers: { Authorization: `Bearer ${customAccessToken}` },
            }
      )
      .then(res => res.data, handleError);
  }
}
