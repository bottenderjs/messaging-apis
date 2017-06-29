/* @flow */
import crypto from 'crypto';

import axios from 'axios';

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
  MutationSuccessResponse,
} from './LINETypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

export default class LINEClient {
  static connect = (accessToken: string, channelSecret: string): LINEClient =>
    new LINEClient(accessToken, channelSecret);

  _channelSecret: string;
  _http: Axios;

  constructor(accessToken: string, channelSecret: string) {
    this._channelSecret = channelSecret;
    this._http = axios.create({
      baseURL: 'https://api.line.me/v2/bot/',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  getHTTPClient: () => Axios = () => this._http;

  /**
   * Get User Profile
   *
   * https://devdocs.line.me/en/#bot-api-get-profile
   * displayName, userId, pictureUrl, statusMessage
   */
  getUserProfile = (userId: UserId): Promise<User> =>
    this._http.get(`/profile/${userId}`).then(res => res.data);

  _sendText = (type: SendType, target: SendTarget, text: string) =>
    this[type](target, [{ type: 'text', text }]);

  _sendImage = (
    type: SendType,
    target: SendTarget,
    contentUrl: string,
    previewUrl: ?string
  ) =>
    this[type](target, [
      {
        type: 'image',
        originalContentUrl: contentUrl,
        previewImageUrl: previewUrl || contentUrl,
      },
    ]);

  _sendVideo = (
    type: SendType,
    target: SendTarget,
    contentUrl: string,
    previewUrl: string
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'video',
        originalContentUrl: contentUrl,
        previewImageUrl: previewUrl,
      },
    ]);

  _sendAudio = (
    type: SendType,
    target: SendTarget,
    contentUrl: string,
    duration: number
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'audio',
        originalContentUrl: contentUrl,
        duration,
      },
    ]);

  _sendLocation = (
    type: SendType,
    target: SendTarget,
    { title, address, latitude, longitude }: Location
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'location',
        title,
        address,
        latitude,
        longitude,
      },
    ]);

  _sendSticker = (
    type: SendType,
    target: SendTarget,
    packageId: string,
    stickerId: string
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'sticker',
        packageId,
        stickerId,
      },
    ]);

  /**
     * Imagemap Message
     *
     * https://devdocs.line.me/en/#imagemap-message
     */
  _sendImagemap = (
    type: SendType,
    target: SendTarget,
    altText: string,
    {
      baseUrl,
      baseHeight,
      baseWidth,
      actions,
    }: {
      baseUrl: string,
      baseHeight: number,
      baseWidth: number,
      actions: Array<ImageMapAction>,
    }
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'imagemap',
        baseUrl,
        altText,
        baseSize: {
          height: baseHeight,
          width: baseWidth,
        },
        actions,
      },
    ]);

  /**
     * Template Messages
     *
     * https://devdocs.line.me/en/#template-messages
     */
  _sendTemplate = (
    type: SendType,
    target: SendTarget,
    altText: string,
    template: Template
  ): Promise<MutationSuccessResponse> =>
    this[type](target, [
      {
        type: 'template',
        altText,
        template,
      },
    ]);

  _sendButtonTemplate = (
    type: SendType,
    target: SendTarget,
    altText: string,
    {
      thumbnailImageUrl,
      title,
      text,
      actions,
    }: {
      thumbnailImageUrl?: string,
      title?: string,
      text: string,
      actions: Array<TemplateAction>,
    }
  ): Promise<MutationSuccessResponse> =>
    this._sendTemplate(type, target, altText, {
      type: 'buttons',
      thumbnailImageUrl,
      title,
      text,
      actions,
    });

  _sendConfirmTemplate = (
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
  ): Promise<MutationSuccessResponse> =>
    this._sendTemplate(type, target, altText, {
      type: 'confirm',
      text,
      actions,
    });

  _sendCarouselTemplate = (
    type: SendType,
    target: SendTarget,
    altText: string,
    columns: Array<ColumnObject>
  ): Promise<MutationSuccessResponse> =>
    this._sendTemplate(type, target, altText, {
      type: 'carousel',
      columns,
    });

  /**
   * Reply Message
   *
   * https://devdocs.line.me/en/#reply-message
   */
  replyRawBody = (body: {
    replyToken: ReplyToken,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> =>
    this._http.post('/message/reply', body).then(res => res.data);

  reply = (
    replyToken: ReplyToken,
    messages: Array<Message>
  ): Promise<MutationSuccessResponse> =>
    this.replyRawBody({ replyToken, messages });

  replyText = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendText('reply', replyToken, ...args);

  replyImage = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendImage('reply', replyToken, ...args);

  replyVideo = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendVideo('reply', replyToken, ...args);

  replyAudio = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendAudio('reply', replyToken, ...args);

  replyLocation = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendLocation('reply', replyToken, ...args);

  replySticker = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendSticker('reply', replyToken, ...args);

  replyImagemap = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendImagemap('reply', replyToken, ...args);

  replyTemplate = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendTemplate('reply', replyToken, ...args);

  replyButtonTemplate = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendButtonTemplate('reply', replyToken, ...args);

  replyConfirmTemplate = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendConfirmTemplate('reply', replyToken, ...args);

  replyCarouselTemplate = (
    replyToken: ReplyToken,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendCarouselTemplate('reply', replyToken, ...args);

  /**
   * Push Message
   *
   * https://devdocs.line.me/en/#push-message
   */
  pushRawBody = (body: {
    to: string,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> =>
    this._http.post('/message/push', body).then(res => res.data);

  push = (
    to: string,
    messages: Array<Message>
  ): Promise<MutationSuccessResponse> => this.pushRawBody({ to, messages });

  pushText = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendText('push', to, ...args);

  pushImage = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendImage('push', to, ...args);

  pushVideo = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendVideo('push', to, ...args);

  pushAudio = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendAudio('push', to, ...args);

  pushLocation = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendLocation('push', to, ...args);

  pushSticker = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendSticker('push', to, ...args);

  pushImagemap = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendImagemap('push', to, ...args);

  pushTemplate = (to: string, ...args): Promise<MutationSuccessResponse> =>
    this._sendTemplate('push', to, ...args);

  pushButtonTemplate = (
    to: string,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendButtonTemplate('push', to, ...args);

  pushConfirmTemplate = (
    to: string,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendConfirmTemplate('push', to, ...args);

  pushCarouselTemplate = (
    to: string,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendCarouselTemplate('push', to, ...args);

  /**
   * Multicast
   *
   * https://devdocs.line.me/en/#multicast
   */
  multicastRawBody = (body: {
    to: Array<UserId>,
    messages: Array<Message>,
  }): Promise<MutationSuccessResponse> =>
    this._http.post('/message/multicast', body).then(res => res.data);

  multicast = (
    to: Array<UserId>,
    messages: Array<Message>
  ): Promise<MutationSuccessResponse> =>
    this.multicastRawBody({ to, messages });

  multicastText = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendText('multicast', to, ...args);

  multicastImage = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendImage('multicast', to, ...args);

  multicastVideo = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendVideo('multicast', to, ...args);

  multicastAudio = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendAudio('multicast', to, ...args);

  multicastLocation = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendLocation('multicast', to, ...args);

  multicastSticker = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendSticker('multicast', to, ...args);

  multicastImagemap = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendImagemap('multicast', to, ...args);

  multicastTemplate = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendTemplate('multicast', to, ...args);

  multicastButtonTemplate = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendButtonTemplate('multicast', to, ...args);

  multicastConfirmTemplate = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendConfirmTemplate('multicast', to, ...args);

  multicastCarouselTemplate = (
    to: Array<UserId>,
    ...args
  ): Promise<MutationSuccessResponse> =>
    this._sendCarouselTemplate('multicast', to, ...args);

  /**
   * Leave
   *
   * https://devdocs.line.me/en/#leave
   */
  leaveGroup = (groupId: string): Promise<MutationSuccessResponse> =>
    this._http.post(`/group/${groupId}/leave`).then(res => res.data);

  leaveRoom = (roomId: string): Promise<MutationSuccessResponse> =>
    this._http.post(`/room/${roomId}/leave`).then(res => res.data);

  /**
   * Signature Validation
   *
   * https://devdocs.line.me/en/#webhooks
   */
  isValidSignature = (rawBody: string, signature: string): boolean =>
    signature ===
    crypto
      .createHmac('sha256', this._channelSecret)
      .update(rawBody, 'utf8')
      .digest('base64');

  /**
   * Content
   *
   * https://devdocs.line.me/en/#content
   */
  retrieveMessageContent = (messageId: string) =>
    this._http.get(`message/${messageId}/content`).then(res => res.data);
}
