import querystring from 'querystring';
import { Readable } from 'stream';

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import imageType from 'image-type';
import invariant from 'invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  createRequestInterceptor,
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
  /**
   * @deprecated Use `new LineClient(...)` instead.
   */
  static connect(
    accessTokenOrConfig: string | Types.ClientConfig,
    channelSecret?: string
  ): LineClient {
    warning(
      false,
      '`LineClient.connect(...)` is deprecated. Use `new LineClient(...)` instead.'
    );
    return new LineClient(accessTokenOrConfig, channelSecret);
  }

  _channelSecret: string;

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  _dataAxios: AxiosInstance;

  _accessToken: string;

  constructor(
    accessTokenOrConfig: string | Types.ClientConfig,
    channelSecret?: string
  ) {
    let origin;
    let dataOrigin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._accessToken = config.accessToken;
      this._channelSecret = config.channelSecret;
      this._onRequest = config.onRequest;
      origin = config.origin;
      dataOrigin = config.dataOrigin;
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

    this._dataAxios = axios.create({
      baseURL: `${dataOrigin || 'https://api-data.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this._dataAxios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get dataAxios(): AxiosInstance {
    return this._dataAxios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Reply Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
   */
  replyRawBody(body: {
    replyToken: string;
    messages: Types.Message[];
  }): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post('/v2/bot/message/reply', body)
      .then(res => res.data, handleError);
  }

  reply(
    replyToken: string,
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages });
  }

  replyMessages(
    replyToken: string,
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, messages);
  }

  replyText(
    replyToken: string,
    text: string,
    options?: Types.MessageOptions & { emojis?: Types.Emoji[] }
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createText(text, options)]);
  }

  replyImage(
    replyToken: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createImage(image, options)]);
  }

  replyVideo(
    replyToken: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createVideo(video, options)]);
  }

  replyAudio(
    replyToken: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createAudio(audio, options)]);
  }

  replyLocation(
    replyToken: string,
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createLocation(location, options)]);
  }

  replySticker(
    replyToken: string,
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [Line.createSticker(sticker, options)]);
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
    return this.reply(replyToken, [
      Line.createImagemap(altText, imagemap, options),
    ]);
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
    return this.reply(replyToken, [Line.createFlex(altText, flex, options)]);
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
    return this.reply(replyToken, [
      Line.createTemplate(altText, template, options),
    ]);
  }

  replyButtonTemplate(
    replyToken: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
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
    return this.reply(replyToken, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
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
    return this.reply(replyToken, [
      Line.createCarouselTemplate(altText, columns, {
        imageAspectRatio,
        imageSize,
        ...options,
      }),
    ]);
  }

  replyImageCarouselTemplate(
    replyToken: string,
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.reply(replyToken, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Push Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-push-message
   */
  pushRawBody(body: {
    to: string;
    messages: Types.Message[];
  }): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post('/v2/bot/message/push', body)
      .then(res => res.data, handleError);
  }

  push(
    to: string,
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.pushRawBody({ to, messages });
  }

  pushMessages(
    to: string,
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, messages);
  }

  pushText(
    to: string,
    text: string,
    options?: Types.MessageOptions & { emojis?: Types.Emoji[] }
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createText(text, options)]);
  }

  pushImage(
    to: string,
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createImage(image, options)]);
  }

  pushVideo(
    to: string,
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createVideo(video, options)]);
  }

  pushAudio(
    to: string,
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createAudio(audio, options)]);
  }

  pushLocation(
    to: string,
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createLocation(location, options)]);
  }

  pushSticker(
    to: string,
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [Line.createSticker(sticker, options)]);
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
    return this.push(to, [Line.createImagemap(altText, imagemap, options)]);
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
    return this.push(to, [Line.createFlex(altText, flex, options)]);
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
    return this.push(to, [Line.createTemplate(altText, template, options)]);
  }

  pushButtonTemplate(
    to: string,
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
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
    return this.push(to, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
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
    return this.push(to, [
      Line.createCarouselTemplate(altText, columns, {
        imageAspectRatio,
        imageSize,
        ...options,
      }),
    ]);
  }

  pushImageCarouselTemplate(
    to: string,
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.push(to, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Multicast
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages
   */
  multicastRawBody(body: {
    to: string[];
    messages: Types.Message[];
  }): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post('/v2/bot/message/multicast', body)
      .then(res => res.data, handleError);
  }

  multicast(
    to: string[],
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages });
  }

  multicastMessages(
    to: string[],
    messages: Types.Message[]
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, messages);
  }

  multicastText(
    to: string[],
    text: string,
    options?: Types.MessageOptions & { emojis?: Types.Emoji[] }
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createText(text, options)]);
  }

  multicastImage(
    to: string[],
    image: {
      originalContentUrl: string;
      previewImageUrl?: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createImage(image, options)]);
  }

  multicastVideo(
    to: string[],
    video: {
      originalContentUrl: string;
      previewImageUrl: string;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createVideo(video, options)]);
  }

  multicastAudio(
    to: string[],
    audio: {
      originalContentUrl: string;
      duration: number;
    },
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createAudio(audio, options)]);
  }

  multicastLocation(
    to: string[],
    location: Types.Location,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createLocation(location, options)]);
  }

  multicastSticker(
    to: string[],
    sticker: Omit<Types.StickerMessage, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [Line.createSticker(sticker, options)]);
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
    return this.multicast(to, [
      Line.createImagemap(altText, imagemap, options),
    ]);
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
    return this.multicast(to, [Line.createFlex(altText, flex, options)]);
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
    return this.multicast(to, [
      Line.createTemplate(altText, template, options),
    ]);
  }

  multicastButtonTemplate(
    to: string[],
    altText: string,
    buttonTemplate: Omit<Types.ButtonsTemplate, 'type'>,
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createButtonTemplate(altText, buttonTemplate, options),
    ]);
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
    return this.multicast(to, [
      Line.createConfirmTemplate(altText, confirmTemplate, options),
    ]);
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
    return this.multicast(to, [
      Line.createCarouselTemplate(altText, columns, {
        imageAspectRatio,
        imageSize,
        ...options,
      }),
    ]);
  }

  multicastImageCarouselTemplate(
    to: string[],
    altText: string,
    columns: Types.ImageCarouselColumnObject[],
    options?: Types.MessageOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.multicast(to, [
      Line.createImageCarouselTemplate(altText, columns, options),
    ]);
  }

  /**
   * Content
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-content
   */
  getMessageContent(messageId: string): Promise<Buffer> {
    return this._dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'arraybuffer',
      })
      .then(res => res.data, handleError);
  }

  getMessageContentStream(messageId: string): Promise<Readable> {
    return this._dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'stream',
      })
      .then(res => res.data, handleError);
  }

  retrieveMessageContent(messageId: string) {
    warning(
      false,
      '`retrieveMessageContent` is deprecated. Use `getMessageContent` instead.'
    );
    return this.getMessageContent(messageId);
  }

  /**
   * Get User Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-profile
   * displayName, userId, pictureUrl, statusMessage
   */
  getUserProfile(userId: string): Promise<Types.User> {
    return this._axios
      .get(`/v2/bot/profile/${userId}`)
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
  getGroupMemberProfile(groupId: string, userId: string) {
    return this._axios
      .get(`/v2/bot/group/${groupId}/member/${userId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Get Room Member Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-room-member-profile
   */
  getRoomMemberProfile(roomId: string, userId: string) {
    return this._axios
      .get(`/v2/bot/room/${roomId}/member/${userId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Get Group Member IDs
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-user-ids
   */
  getGroupMemberIds(
    groupId: string,
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`
      )
      .then(res => res.data, handleError);
  }

  async getAllGroupMemberIds(groupId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getGroupMemberIds(
        groupId,
        continuationToken
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
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`
      )
      .then(res => res.data, handleError);
  }

  async getAllRoomMemberIds(roomId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getRoomMemberIds(
        roomId,
        continuationToken
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
  leaveGroup(groupId: string): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(`/v2/bot/group/${groupId}/leave`, null)
      .then(res => res.data, handleError);
  }

  /**
   * Leave Room
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#leave-room
   */
  leaveRoom(roomId: string): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post(`/v2/bot/room/${roomId}/leave`, null)
      .then(res => res.data, handleError);
  }

  /**
   * Rich Menu
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#rich-menu
   */
  getRichMenuList() {
    return this._axios
      .get('/v2/bot/richmenu/list')
      .then(res => res.data.richmenus, handleError);
  }

  getRichMenu(richMenuId: string) {
    return this._axios
      .get(`/v2/bot/richmenu/${richMenuId}`)
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  createRichMenu(richMenu: Types.RichMenu) {
    return this._axios
      .post('/v2/bot/richmenu', richMenu)
      .then(res => res.data, handleError);
  }

  deleteRichMenu(richMenuId: string) {
    return this._axios
      .delete(`/v2/bot/richmenu/${richMenuId}`)
      .then(res => res.data, handleError);
  }

  getLinkedRichMenu(userId: string) {
    return this._axios
      .get(`/v2/bot/user/${userId}/richmenu`)
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  linkRichMenu(userId: string, richMenuId: string) {
    return this._axios
      .post(`/v2/bot/user/${userId}/richmenu/${richMenuId}`, null)
      .then(res => res.data, handleError);
  }

  unlinkRichMenu(userId: string) {
    return this._axios
      .delete(`/v2/bot/user/${userId}/richmenu`)
      .then(res => res.data, handleError);
  }

  getDefaultRichMenu() {
    return this._axios
      .get(`/v2/bot/user/all/richmenu`)
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  setDefaultRichMenu(richMenuId: string) {
    return this._axios
      .post(`/v2/bot/user/all/richmenu/${richMenuId}`, null)
      .then(res => res.data, handleError);
  }

  deleteDefaultRichMenu() {
    return this._axios
      .delete(`/v2/bot/user/all/richmenu`)
      .then(res => res.data, handleError);
  }

  /**
   * - Images must have one of the following resolutions: 2500x1686, 2500x843.
   * - You cannot replace an image attached to a rich menu.
   *   To update your rich menu image, create a new rich menu object and upload another image.
   */
  uploadRichMenuImage(richMenuId: string, image: Buffer) {
    const type = imageType(image);
    invariant(
      type && (type.mime === 'image/jpeg' || type.mime === 'image/png'),
      'Image must be `image/jpeg` or `image/png`'
    );

    return this._dataAxios
      .post(`/v2/bot/richmenu/${richMenuId}/content`, image, {
        headers: {
          'Content-Type': (type as { mime: string }).mime,
        },
      })
      .then(res => res.data, handleError);
  }

  downloadRichMenuImage(richMenuId: string) {
    return this._dataAxios
      .get(`/v2/bot/richmenu/${richMenuId}/content`, {
        responseType: 'arraybuffer',
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

  issueLinkToken(userId: string): Promise<{ linkToken: string }> {
    warning(
      false,
      '`issueLinkToken` is deprecated. Use `getLinkToken` instead. Note: It returns a string instead of an object.'
    );
    return this._axios
      .post<{ linkToken: string }>(`/v2/bot/user/${userId}/linkToken`, null)
      .then(res => res.data, handleError);
  }

  getLinkToken(userId: string): Promise<string> {
    return this._axios
      .post<{ linkToken: string }>(`/v2/bot/user/${userId}/linkToken`, null)
      .then(res => res.data.linkToken, handleError);
  }

  /**
   * LINE Front-end Framework (LIFF)
   *
   * https://developers.line.me/en/docs/liff/reference/#add-liff-app
   */
  getLiffAppList(): Promise<{
    liffId: string;
    view: Types.LiffView;
  }> {
    return this._axios
      .get('/liff/v1/apps')
      .then(res => res.data.apps, handleError);
  }

  createLiffApp(view: Types.LiffView): Promise<{ liffId: string }> {
    return this._axios
      .post('/liff/v1/apps', view)
      .then(res => res.data, handleError);
  }

  updateLiffApp(liffId: string, view: Types.LiffView): Promise<void> {
    return this._axios
      .put(`/liff/v1/apps/${liffId}/view`, view)
      .then(res => res.data, handleError);
  }

  deleteLiffApp(liffId: string): Promise<void> {
    return this._axios
      .delete(`/liff/v1/apps/${liffId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Get number of messages sent
   *
   */

  // https://developers.line.biz/en/reference/messaging-api/#get-quota
  getTargetLimitForAdditionalMessages(): Promise<
    Types.TargetLimitForAdditionalMessages
  > {
    return this._axios
      .get<Types.TargetLimitForAdditionalMessages>('/v2/bot/message/quota')
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-consumption
  getNumberOfMessagesSentThisMonth(): Promise<
    Types.NumberOfMessagesSentThisMonth
  > {
    return this._axios
      .get<Types.NumberOfMessagesSentThisMonth>(
        '/v2/bot/message/quota/consumption'
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages
  getNumberOfSentReplyMessages(
    date: string
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/reply',
        {
          params: {
            date,
          },
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages
  getNumberOfSentPushMessages(
    date: string
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/push',
        {
          params: {
            date,
          },
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages
  getNumberOfSentMulticastMessages(
    date: string
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/multicast',
        {
          params: {
            date,
          },
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages
  getNumberOfSentBroadcastMessages(
    date: string
  ): Promise<Types.NumberOfMessagesSentResponse> {
    return this._axios
      .get<Types.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/broadcast',
        {
          params: {
            date,
          },
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
    date: string
  ): Promise<Types.NumberOfMessageDeliveriesResponse> {
    return this._axios
      .get<Types.NumberOfMessageDeliveriesResponse>(
        '/v2/bot/insight/message/delivery',
        {
          params: {
            date,
          },
        }
      )
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-number-of-followers
  getNumberOfFollowers(date: string): Promise<Types.NumberOfFollowersResponse> {
    return this._axios
      .get<Types.NumberOfFollowersResponse>('/v2/bot/insight/followers', {
        params: {
          date,
        },
      })
      .then(res => res.data, handleError);
  }

  // https://developers.line.biz/en/reference/messaging-api/#get-demographic
  getFriendDemographics(): Promise<Types.FriendDemographics> {
    return this._axios
      .get<Types.FriendDemographics>('/v2/bot/insight/demographic')
      .then(res => res.data, handleError);
  }

  /**
   * Narrowcast Message
   *
   * https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message
   */
  narrowcastRawBody(body: {
    messages: Types.Message[];
    recipient?: Types.RecipientObject;
    filter?: { demographic: Types.DemographicFilterObject };
    limit?: {
      max: number;
    };
  }): Promise<Types.MutationSuccessResponse> {
    return this._axios.post('/v2/bot/message/narrowcast', body).then(res => {
      return {
        requestId: res.headers['x-line-request-id'],
        ...res.data,
      };
    }, handleError);
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
    return this.narrowcastRawBody({
      messages,
      recipient: options?.recipient,
      filter,
      limit,
    });
  }

  narrowcastMessages(
    messages: Types.Message[],
    options?: Types.NarrowcastOptions
  ): Promise<Types.MutationSuccessResponse> {
    return this.narrowcast(messages, options);
  }

  getNarrowcastProgress(
    requestId: string
  ): Promise<Types.NarrowcastProgressResponse> {
    return this._axios
      .get(`/v2/bot/message/progress/narrowcast?requestId=${requestId}`)
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
    return this._axios
      .post('/v2/bot/audienceGroup/upload', {
        description,
        isIfaAudience,
        audiences,
        ...options,
      })
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
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .put('/v2/bot/audienceGroup/upload', {
        audienceGroupId,
        audiences,
        ...options,
      })
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
    return this._axios
      .post('/v2/bot/audienceGroup/click', {
        description,
        requestId,
        ...options,
      })
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
    requestId: string
  ): Promise<Types.ImpAudienceGroup> {
    return this._axios
      .post('/v2/bot/audienceGroup/imp', {
        description,
        requestId,
      })
      .then(res => res.data, handleError);
  }

  /**
   * Renames an existing audience.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#set-description-audience-group
   */
  setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: number
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .put(`/v2/bot/audienceGroup/${audienceGroupId}/updateDescription`, {
        description,
      })
      .then(res => res.data, handleError);
  }

  /**
   * Deletes an audience.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#delete-audience-group
   */
  deleteAudienceGroup(
    audienceGroupId: number
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .delete(`/v2/bot/audienceGroup/${audienceGroupId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Gets audience data.
   *
   * - https://developers.line.biz/en/reference/messaging-api/#get-audience-group
   */
  getAudienceGroup(
    audienceGroupId: number
  ): Promise<Types.AudienceGroupWithJob> {
    return this._axios
      .get(`/v2/bot/audienceGroup/${audienceGroupId}`)
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
    const query = querystring.stringify({
      page: 1,
      ...options,
    });
    return this._axios
      .get(`/v2/bot/audienceGroup/list?${query}`)
      .then(res => res.data, handleError);
  }

  /**
   * オーディエンスの権限レベルを取得します。
   *
   * - https://developers.line.biz/en/reference/messaging-api/#get-authority-level
   */
  getAudienceGroupAuthorityLevel(): Promise<Types.AudienceGroupAuthorityLevel> {
    return this._axios
      .get(`/v2/bot/audienceGroup/authorityLevel`)
      .then(res => res.data, handleError);
  }

  /**
   * 同じチャネルで作成された、すべてのオーディエンスの権限レベルを変更します。
   *
   * - https://developers.line.biz/en/reference/messaging-api/#change-authority-level
   */
  changeAudienceGroupAuthorityLevel(
    authorityLevel: 'PUBLIC' | 'PRIVATE'
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .put(`/v2/bot/audienceGroup/authorityLevel`, {
        authorityLevel,
      })
      .then(res => res.data, handleError);
  }
}
