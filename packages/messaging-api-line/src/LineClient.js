/* @flow */
import AxiosError from 'axios-error';
import axios from 'axios';
import debug from 'debug';
import imageType from 'image-type';
import invariant from 'invariant';
import omit from 'lodash.omit';
import urlJoin from 'url-join';

import Line from './Line';
import {
  type ColumnObject,
  type FlexContainer,
  type ImageCarouselColumnObject,
  type ImageMapAction,
  type ImageMapVideo,
  type LiffView,
  type Location,
  type Message,
  type MessageOptions,
  type MutationSuccessResponse,
  type ReplyToken,
  type RichMenu,
  type SendTarget,
  type SendType,
  type Template,
  type TemplateAction,
  type User,
  type UserId,
} from './LineTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type ClientConfig = {
  accessToken: string,
  channelSecret: string,
  origin?: string,
  onRequest?: Function,
};

function handleError(err) {
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

const debugRequest = debug('messaging-api-line');

function onRequest({ method, url, body }) {
  debugRequest(`${method} ${url}`);
  if (body) {
    debugRequest('Outgoing request body:');
    debugRequest(JSON.stringify(body, null, 2));
  }
}

export default class LineClient {
  static connect(
    accessTokenOrConfig: string | ClientConfig,
    channelSecret: string
  ): LineClient {
    return new LineClient(accessTokenOrConfig, channelSecret);
  }

  _accessToken: string;

  _channelSecret: string;

  _onRequest: Function;

  _axios: Axios;

  constructor(
    accessTokenOrConfig: string | ClientConfig,
    channelSecret: string
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
      this._channelSecret = channelSecret;
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
        url: urlJoin(config.baseURL, config.url),
        headers: {
          ...config.headers.common,
          ...config.headers[config.method],
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

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  _send(
    type: SendType,
    target: SendTarget,
    ...args: Array<any>
  ): Promise<MutationSuccessResponse> {
    if (type === 'push') {
      return this.push(((target: any): UserId), ...args);
    }
    if (type === 'multicast') {
      return this.multicast(((target: any): Array<UserId>), ...args);
    }
    return this.reply(((target: any): ReplyToken), ...args);
  }

  _sendText(
    type: SendType,
    target: SendTarget,
    text: string,
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createText(text, options || {})],
      options
    );
  }

  _sendImage(
    type: SendType,
    target: SendTarget,
    contentUrlOrImage: string | Object,
    previewUrlOrOptions?: string | MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createImage(contentUrlOrImage, previewUrlOrOptions)],
      typeof previewUrlOrOptions === 'string' ? undefined : previewUrlOrOptions
    );
  }

  _sendVideo(
    type: SendType,
    target: SendTarget,
    contentUrlOrVideo: string | Object,
    previewUrlOrOptions?: string | MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createVideo(contentUrlOrVideo, previewUrlOrOptions || {})],
      typeof previewUrlOrOptions === 'string' ? undefined : previewUrlOrOptions
    );
  }

  _sendAudio(
    type: SendType,
    target: SendTarget,
    contentUrlOrAudio: string | Object,
    durationOrOptions?: number | MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createAudio(contentUrlOrAudio, durationOrOptions || {})],
      typeof durationOrOptions === 'number' ? undefined : durationOrOptions
    );
  }

  _sendLocation(
    type: SendType,
    target: SendTarget,
    { title, address, latitude, longitude }: Location,
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [
        Line.createLocation(
          {
            title,
            address,
            latitude,
            longitude,
          },
          options || {}
        ),
      ],
      options
    );
  }

  _sendSticker(
    type: SendType,
    target: SendTarget,
    packageIdOrSticker: string | Object,
    stickerIdOrOptions?: string | MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createSticker(packageIdOrSticker, stickerIdOrOptions || {})],
      typeof stickerIdOrOptions === 'string' ? undefined : stickerIdOrOptions
    );
  }

  /**
   * Imagemap Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#imagemap-message
   */
  _sendImagemap(
    type: SendType,
    target: SendTarget,
    altText: string,
    {
      baseUrl,
      baseSize,
      baseHeight,
      baseWidth,
      video,
      actions,
    }: {
      baseUrl: string,
      baseSize: {
        height: number,
        width: number,
      },
      baseHeight: number,
      baseWidth: number,
      video?: ImageMapVideo,
      actions: Array<ImageMapAction>,
    },
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [
        Line.createImagemap(
          altText,
          {
            baseUrl,
            baseSize,
            baseHeight,
            baseWidth,
            video,
            actions,
          },
          options || {}
        ),
      ],
      options
    );
  }

  /**
   * Flex Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#flex-message
   */
  _sendFlex(
    type: SendType,
    target: SendTarget,
    altText: string,
    contents: FlexContainer,
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createFlex(altText, contents, options || {})],
      options
    );
  }

  /**
   * Template Messages
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#template-messages
   */
  _sendTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    template: Template,
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createTemplate(altText, template, options || {})],
      options
    );
  }

  _sendButtonTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    {
      thumbnailImageUrl,
      imageAspectRatio,
      imageSize,
      imageBackgroundColor,
      title,
      text,
      defaultAction,
      actions,
    }: {
      thumbnailImageUrl?: string,
      imageAspectRatio?: 'rectangle' | 'square',
      imageSize?: 'cover' | 'contain',
      imageBackgroundColor?: string,
      title?: string,
      text: string,
      defaultAction?: TemplateAction,
      actions: Array<TemplateAction>,
    },
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [
        Line.createButtonTemplate(
          altText,
          {
            thumbnailImageUrl,
            imageAspectRatio,
            imageSize,
            imageBackgroundColor,
            title,
            text,
            defaultAction,
            actions,
          },
          options || {}
        ),
      ],
      options
    );
  }

  _sendConfirmTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    {
      text,
      actions,
    }: {
      text: string,
      actions: Array<TemplateAction>,
    },
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [
        Line.createConfirmTemplate(
          altText,
          {
            text,
            actions,
          },
          options || {}
        ),
      ],
      options
    );
  }

  _sendCarouselTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    columns: Array<ColumnObject>,
    {
      imageAspectRatio,
      imageSize,
      ...options
    }: {
      imageAspectRatio?: 'rectangle' | 'square',
      imageSize?: 'cover' | 'contain',
      options?: MessageOptions,
    } = {}
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
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

  _sendImageCarouselTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    columns: Array<ImageCarouselColumnObject>,
    options?: MessageOptions
  ): Promise<MutationSuccessResponse> {
    return this._send(
      type,
      target,
      [Line.createImageCarouselTemplate(altText, columns, options || {})],
      options
    );
  }

  /**
   * Reply Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-reply-message
   */
  replyRawBody(
    body: {
      replyToken: ReplyToken,
      messages: Array<Message>,
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/reply',
        body,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }

  reply(
    replyToken: ReplyToken,
    messages: Array<Message>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages }, options);
  }

  /**
   * Push Message
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-push-message
   */
  pushRawBody(
    body: {
      to: string,
      messages: Array<Message>,
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/push',
        body,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }

  push(
    to: string,
    messages: Array<Message>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> {
    return this.pushRawBody({ to, messages }, options);
  }

  /**
   * Multicast
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#send-multicast-messages
   */
  multicastRawBody(
    body: {
      to: Array<UserId>,
      messages: Array<Message>,
    },
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        '/v2/bot/message/multicast',
        body,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }

  multicast(
    to: Array<UserId>,
    messages: Array<Message>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages }, options);
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
    userId: UserId,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ): Promise<User> {
    return this._axios
      .get(
        `/v2/bot/profile/${userId}`,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        handleError(err);
      });
  }

  /**
   * Get Group Member Profile
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#get-group-member-profile
   */
  getGroupMemberProfile(
    groupId: string,
    userId: UserId,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/member/${userId}`,
        customAccessToken && {
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
    userId: UserId,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/member/${userId}`,
        customAccessToken && {
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
  ): Promise<{ memberIds: Array<string>, next?: ?string }> {
    return this._axios
      .get(
        `/v2/bot/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }

  async getAllGroupMemberIds(
    groupId: string,
    options?: Object = {}
  ): Promise<Array<string>> {
    let allMemberIds: Array<string> = [];
    let continuationToken;

    do {
      // eslint-disable-next-line no-await-in-loop
      const { memberIds, next } = await this.getGroupMemberIds(
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
  ): Promise<{ memberIds: Array<string>, next?: ?string }> {
    return this._axios
      .get(
        `/v2/bot/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`,
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }

  async getAllRoomMemberIds(
    roomId: string,
    options?: Object = {}
  ): Promise<Array<string>> {
    let allMemberIds: Array<string> = [];
    let continuationToken;

    do {
      // eslint-disable-next-line no-await-in-loop
      const { memberIds, next } = await this.getRoomMemberIds(
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
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        handleError(err);
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
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        handleError(err);
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
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        handleError(err);
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
        customAccessToken && {
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
        customAccessToken && {
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
        headers: customAccessToken
          ? {
              'Content-Type': type.mime,
              Authorization: `Bearer ${customAccessToken}`,
            }
          : {
              'Content-Type': type.mime,
            },
      })
      .then(res => res.data, handleError);
  }

  downloadRichMenuImage(
    richMenuId: string,
    { accessToken: customAccessToken }: { accessToken?: string } = {}
  ) {
    return this._axios
      .get(
        `/v2/bot/richmenu/${richMenuId}/content`,
        customAccessToken
          ? {
              responseType: 'arraybuffer',
              headers: {
                Authorization: `Bearer ${customAccessToken}`,
              },
            }
          : {
              responseType: 'arraybuffer',
            }
      )
      .then(res => Buffer.from(res.data))
      .catch(err => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        handleError(err);
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
        customAccessToken && {
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
    liffId: string,
    view: LiffView,
  }> {
    return this._axios
      .get(
        '/liff/v1/apps',
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
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
        customAccessToken && {
          headers: { Authorization: `Bearer ${customAccessToken}` },
        }
      )
      .then(res => res.data, handleError);
  }
}

const sendTypes = ['reply', 'push', 'multicast'];

const messageTypes: Array<{
  name: string,
  aliases?: Array<string>,
}> = [
  { name: 'Text' },
  { name: 'Image' },
  { name: 'Video' },
  { name: 'Audio' },
  { name: 'Location' },
  { name: 'Sticker' },
  { name: 'Imagemap' },
  { name: 'Flex' },
  { name: 'Template' },
  { name: 'ButtonTemplate', aliases: ['ButtonsTemplate'] },
  { name: 'ConfirmTemplate' },
  { name: 'CarouselTemplate' },
  { name: 'ImageCarouselTemplate' },
];

messageTypes.forEach(({ name, aliases }) => {
  sendTypes.forEach(sendType => {
    [name].concat(aliases || []).forEach(type => {
      Object.defineProperty(LineClient.prototype, `${sendType}${type}`, {
        enumerable: false,
        configurable: true,
        writable: true,
        value(target: SendTarget, ...args) {
          return this[`_send${name}`](sendType, target, ...args);
        },
      });
    });
  });
});
