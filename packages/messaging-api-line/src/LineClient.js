/* @flow */
import axios from 'axios';
import AxiosError from 'axios-error';
import invariant from 'invariant';
import imageType from 'image-type';

import Line from './Line';
import type {
  SendType,
  ReplyToken,
  UserId,
  SendTarget,
  User,
  Message,
  Location,
  Template,
  TemplateAction,
  ImageMapAction,
  ColumnObject,
  ImageCarouselColumnObject,
  RichMenu,
  MutationSuccessResponse,
} from './LineTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

function handleError(err) {
  const { message, details } = err.response.data;
  let msg = `LINE API - ${message}`;
  if (details && details.length > 0) {
    details.forEach(detail => {
      msg += `\n- ${detail.property}: ${detail.message}`;
    });
  }
  throw new AxiosError(msg, err);
}

type ClientConfig = {
  accessToken: string,
  channelSecret: string,
  origin?: string,
};

export default class LineClient {
  static connect(
    accessTokenOrConfig: string | ClientConfig,
    channelSecret: string
  ): LineClient {
    return new LineClient(accessTokenOrConfig, channelSecret);
  }

  _accessToken: string;
  _channelSecret: string;
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
      origin = config.origin;
    } else {
      this._accessToken = accessTokenOrConfig;
      this._channelSecret = channelSecret;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.line.me'}/v2/bot/`,
      headers: {
        Authorization: `Bearer ${this._accessToken}`,
        'Content-Type': 'application/json',
      },
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
    } else if (type === 'multicast') {
      return this.multicast(((target: any): Array<UserId>), ...args);
    }
    return this.reply(((target: any): ReplyToken), ...args);
  }

  _sendText(
    type: SendType,
    target: SendTarget,
    text: string
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [Line.createText(text)]);
  }

  _sendImage(
    type: SendType,
    target: SendTarget,
    contentUrlOrImage: string | Object,
    previewUrl: ?string
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createImage(contentUrlOrImage, previewUrl),
    ]);
  }

  _sendVideo(
    type: SendType,
    target: SendTarget,
    contentUrlOrVideo: string | Object,
    previewUrl: string
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createVideo(contentUrlOrVideo, previewUrl),
    ]);
  }

  _sendAudio(
    type: SendType,
    target: SendTarget,
    contentUrlOrAudio: string | Object,
    duration: ?number
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createAudio(contentUrlOrAudio, duration),
    ]);
  }

  _sendLocation(
    type: SendType,
    target: SendTarget,
    { title, address, latitude, longitude }: Location
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createLocation({
        title,
        address,
        latitude,
        longitude,
      }),
    ]);
  }

  _sendSticker(
    type: SendType,
    target: SendTarget,
    packageIdOrSticker: string | Object,
    stickerId: ?string
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createSticker(packageIdOrSticker, stickerId),
    ]);
  }

  /**
   * Imagemap Message
   *
   * https://devdocs.line.me/en/#imagemap-message
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
      actions,
    }: {
      baseUrl: string,
      baseSize: {
        height: number,
        width: number,
      },
      baseHeight: number,
      baseWidth: number,
      actions: Array<ImageMapAction>,
    }
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      {
        type: 'imagemap',
        baseUrl,
        altText,
        baseSize: baseSize || {
          height: baseHeight,
          width: baseWidth,
        },
        actions,
      },
    ]);
  }

  /**
   * Template Messages
   *
   * https://devdocs.line.me/en/#template-messages
   */
  _sendTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    template: Template
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [Line.createTemplate(altText, template)]);
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
      actions,
    }: {
      thumbnailImageUrl?: string,
      imageAspectRatio?: 'rectangle' | 'square',
      imageSize?: 'cover' | 'contain',
      imageBackgroundColor?: string,
      title?: string,
      text: string,
      actions: Array<TemplateAction>,
    }
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createButtonTemplate(altText, {
        thumbnailImageUrl,
        imageAspectRatio,
        imageSize,
        imageBackgroundColor,
        title,
        text,
        actions,
      }),
    ]);
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
    }
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createConfirmTemplate(altText, {
        text,
        actions,
      }),
    ]);
  }

  _sendCarouselTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    columns: Array<ColumnObject>,
    {
      imageAspectRatio,
      imageSize,
    }: {
      imageAspectRatio?: 'rectangle' | 'square',
      imageSize?: 'cover' | 'contain',
    } = {}
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createCarouselTemplate(altText, columns, {
        imageAspectRatio,
        imageSize,
      }),
    ]);
  }

  _sendImageCarouselTemplate(
    type: SendType,
    target: SendTarget,
    altText: string,
    columns: Array<ImageCarouselColumnObject>
  ): Promise<MutationSuccessResponse> {
    return this._send(type, target, [
      Line.createImageCarouselTemplate(altText, columns),
    ]);
  }

  /**
   * Reply Message
   *
   * https://devdocs.line.me/en/#reply-message
   */
  replyRawBody(body: {
    replyToken: ReplyToken,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> {
    return this._axios
      .post('/message/reply', body)
      .then(res => res.data, handleError);
  }

  reply(
    replyToken: ReplyToken,
    messages: Array<Message>
  ): Promise<MutationSuccessResponse> {
    return this.replyRawBody({ replyToken, messages });
  }

  /**
   * Push Message
   *
   * https://devdocs.line.me/en/#push-message
   */
  pushRawBody(body: {
    to: string,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> {
    return this._axios
      .post('/message/push', body)
      .then(res => res.data, handleError);
  }

  push(to: string, messages: Array<Message>): Promise<MutationSuccessResponse> {
    return this.pushRawBody({ to, messages });
  }

  /**
   * Multicast
   *
   * https://devdocs.line.me/en/#multicast
   */
  multicastRawBody(body: {
    to: Array<UserId>,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> {
    return this._axios
      .post('/message/multicast', body)
      .then(res => res.data, handleError);
  }

  multicast(
    to: Array<UserId>,
    messages: Array<Message>
  ): Promise<MutationSuccessResponse> {
    return this.multicastRawBody({ to, messages });
  }

  /**
   * Content
   *
   * https://devdocs.line.me/en/#content
   */
  retrieveMessageContent(messageId: string): Promise<Buffer> {
    return this._axios
      .get(`/message/${messageId}/content`, { responseType: 'arraybuffer' })
      .then(res => Buffer.from(res.data), handleError);
  }

  /**
   * Get User Profile
   *
   * https://devdocs.line.me/en/#bot-api-get-profile
   * displayName, userId, pictureUrl, statusMessage
   */
  getUserProfile(userId: UserId): Promise<User> {
    return this._axios
      .get(`/profile/${userId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Get Group/Room Member Profile
   *
   * https://devdocs.line.me/en/#get-group-room-member-profile
   */
  getGroupMemberProfile(groupId: string, userId: UserId) {
    return this._axios
      .get(`/group/${groupId}/member/${userId}`)
      .then(res => res.data, handleError);
  }

  getRoomMemberProfile(roomId: string, userId: UserId) {
    return this._axios
      .get(`/room/${roomId}/member/${userId}`)
      .then(res => res.data, handleError);
  }

  /**
   * Get Group/Room Member IDs
   *
   * https://devdocs.line.me/en/#get-group-room-member-ids
   */
  getGroupMemberIds(groupId: string, start?: string) {
    return this._axios
      .get(`/group/${groupId}/members/ids${start ? `?start=${start}` : ''}`)
      .then(res => res.data, handleError);
  }

  async getAllGroupMemberIds(groupId: string) {
    let allMemberIds = [];
    let continuationToken;

    do {
      // eslint-disable-next-line no-await-in-loop
      const { memberIds, next } = await this.getGroupMemberIds(
        groupId,
        continuationToken
      );
      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  getRoomMemberIds(roomId: string, start?: string) {
    return this._axios
      .get(`/room/${roomId}/members/ids${start ? `?start=${start}` : ''}`)
      .then(res => res.data, handleError);
  }

  getAllRoomMemberIds = async (roomId: string) => {
    let allMemberIds = [];
    let continuationToken;

    do {
      // eslint-disable-next-line no-await-in-loop
      const { memberIds, next } = await this.getRoomMemberIds(
        roomId,
        continuationToken
      );
      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  };

  /**
   * Leave
   *
   * https://devdocs.line.me/en/#leave
   */
  leaveGroup(groupId: string): Promise<MutationSuccessResponse> {
    return this._axios
      .post(`/group/${groupId}/leave`)
      .then(res => res.data, handleError);
  }

  leaveRoom(roomId: string): Promise<MutationSuccessResponse> {
    return this._axios
      .post(`/room/${roomId}/leave`)
      .then(res => res.data, handleError);
  }

  /**
   * Rich Menu
   *
   * https://developers.line.me/en/docs/messaging-api/reference/#rich-menu
   */
  getRichMenuList() {
    return this._axios
      .get('/richmenu/list')
      .then(res => res.data.richmenus, handleError);
  }

  getRichMenu(richMenuId: string) {
    return this._axios
      .get(`/richmenu/${richMenuId}`)
      .then(res => res.data, handleError);
  }

  createRichMenu(richMenu: RichMenu) {
    return this._axios
      .post('/richmenu', richMenu)
      .then(res => res.data, handleError);
  }

  deleteRichMenu(richMenuId: string) {
    return this._axios
      .delete(`/richmenu/${richMenuId}`)
      .then(res => res.data, handleError);
  }

  getLinkedRichMenu(userId: string) {
    return this._axios
      .get(`/user/${userId}/richmenu`)
      .then(res => res.data, handleError);
  }

  linkRichMenu(userId: string, richMenuId: string) {
    return this._axios
      .post(`/user/${userId}/richmenu/${richMenuId}`)
      .then(res => res.data, handleError);
  }

  unlinkRichMenu(userId: string) {
    return this._axios
      .delete(`/user/${userId}/richmenu`)
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
    return this._axios
      .post(`/richmenu/${richMenuId}/content`, image, {
        headers: {
          'Content-Type': type.mime,
        },
      })
      .then(res => res.data, handleError);
  }

  downloadRichMenuImage(richMenuId: string) {
    return this._axios
      .get(`/richmenu/${richMenuId}/content`, { responseType: 'arraybuffer' })
      .then(res => Buffer.from(res.data), handleError);
  }
}

const sendTypes = ['reply', 'push', 'multicast'];

const messageTypes: Array<{ name: string, aliases?: Array<string> }> = [
  { name: 'Text' },
  { name: 'Image' },
  { name: 'Video' },
  { name: 'Audio' },
  { name: 'Location' },
  { name: 'Sticker' },
  { name: 'Imagemap' },
  { name: 'Template' },
  { name: 'ButtonTemplate', aliases: ['ButtonsTemplate'] },
  { name: 'ConfirmTemplate' },
  { name: 'CarouselTemplate' },
  { name: 'ImageCarouselTemplate' },
];

sendTypes.forEach(sendType => {
  messageTypes.forEach(({ name, aliases }) => {
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
