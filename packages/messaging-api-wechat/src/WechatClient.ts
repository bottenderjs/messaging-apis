import fs from 'fs';

import FormData from 'form-data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CamelCasedPropertiesDeep } from 'type-fest';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  onRequest,
  snakecaseKeysDeep,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as WechatTypes from './WechatTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { errcode, errmsg } = response.data;
  if (!errcode || errcode === 0) return response;
  const msg = `WeChat API - ${errcode} ${errmsg}`;
  throw new PrintableAxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

function wrapPrintableAxiosError(err: unknown) {
  return Promise.reject(
    axios.isAxiosError(err)
      ? new PrintableAxiosError(`WeChat API - ${err.message}`, err)
      : err
  );
}

export default class WechatClient {
  /**
   * The underlying axios instance.
   */
  public readonly axios: AxiosInstance;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * The app ID used by the client.
   */
  private appId: string;

  /**
   * The app secret used by the client.
   */
  private appSecret: string;

  /**
   * The current access token used by the client.
   */
  private accessToken = '';

  /**
   * The timestamp of the token expired time.
   */
  private tokenExpiresAt = 0;

  /**
   * The constructor of WechatClient.
   *
   * @param config - the config object
   * @example
   * ```js
   * const wechat = new WechatClient({
   *   appId: WECHAT_APP_ID,
   *   appSecret: WECHAT_APP_SECRET,
   * });
   * ```
   */
  constructor(config: WechatTypes.ClientConfig) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.onRequest = config.onRequest ?? onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin ?? 'https://api.weixin.qq.com'}/cgi-bin/`,
      headers: {
        'Content-Type': 'application/json',
      },
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

  /**
   * 获取 access_token
   *
   * @returns access token info
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   * @example
   * ```js
   * await wechat.getAccessToken();
   * // {
   * //   accessToken: "ACCESS_TOKEN",
   * //   expiresIn: 7200
   * // }
   * ```
   */
  public getAccessToken(): Promise<WechatTypes.AccessToken> {
    return this.axios
      .get<WechatTypes.AccessToken>('/token', {
        params: {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.appSecret,
        },
      })
      .then((res) => res.data);
  }

  /**
   * 临时素材
   *
   * 媒体文件保存时间为 3 天，即 3 天后 media_id 失效。
   *
   * 图片（image）- 2M，支持 PNG,JPEG,JPG,GIF 格式
   * 语音（voice）- 2M，播放长度不超过 60s，支持 AMR,MP3 格式
   * 视频（video）- 10MB，支持 MP4 格式
   * 缩略图（thumb）- 64KB，支持 JPG 格式
   */

  /**
   * 多媒体文件上传接口
   *
   * @param type - the media type to upload
   * @param media - buffer or stream of the media to upload
   * @returns the info of the uploaded media.
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738726
   * @example
   * ```js
   * const fs = require('fs');
   *
   * const buffer = await fs.promises.readFile('test.jpg');
   * await wechat.uploadMedia('image', buffer);
   * // {
   * //   type: 'image',
   * //   mediaId: 'MEDIA_ID',
   * //   createdAt: 123456789
   * // }
   * ```
   */
  public async uploadMedia(
    type: WechatTypes.MediaType,
    media: Buffer | fs.ReadStream
  ): Promise<WechatTypes.UploadedMedia> {
    await this.refreshTokenWhenExpired();

    const form = new FormData();
    form.append('media', media);

    return this.axios
      .post<
        CamelCasedPropertiesDeep<{
          type: string;
          media_id: string;
          created_at: number;
        }>
      >('/media/upload', form, {
        headers: form.getHeaders(),
        params: {
          access_token: this.accessToken,
          type,
        },
      })
      .then((res) => res.data);
  }

  /**
   * 下载多媒体文件接口
   *
   * @param mediaId - ID of the media to get
   * @returns the info of the media
   * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738727
   * @example
   * ```js
   * await wechat.getMedia(MEDIA_ID);
   * // {
   * //   videoUrl: "..."
   * // }
   * ```
   */
  public async getMedia(mediaId: string): Promise<WechatTypes.Media> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .get<WechatTypes.Media>('/media/get', {
        params: {
          access_token: this.accessToken,
          media_id: mediaId,
        },
      })
      .then((res) => res.data);
  }

  /**
   * 发送消息-客服消息
   *
   * @param options - message options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendMessage({
   *   touser: USER_ID,
   *   msgtype: 'text',
   *   text: {
   *     content: 'Hello!',
   *   },
   * });
   * ```
   */
  public async sendMessage(
    options: WechatTypes.MessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .post<WechatTypes.ResponseData>(
        '/message/custom/send',
        snakecaseKeysDeep(options),
        {
          params: {
            access_token: this.accessToken,
          },
        }
      )
      .then((res) => res.data);
  }

  /**
   * 发送文本消息
   *
   * @param userId - user ID of the recipient
   * @param text - text to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendText(USER_ID, 'Hello!');
   * ```
   */
  public sendText(
    userId: string,
    text: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'text',
      text: {
        content: text,
      },
      ...options,
    });
  }

  /**
   * 发送图片消息
   *
   * @param userId - user ID of the recipient
   * @param mediaId - ID of the media to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendImage(USER_ID, 'MEDIA_ID');
   * ```
   */
  public sendImage(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.public Message({
      touser: userId,
      msgtype: 'image',
      image: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送语音消息
   *
   * @param userId - user ID of the recipient
   * @param mediaId - ID of the media to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendVoice(USER_ID, 'MEDIA_ID');
   * ```
   */
  public sendVoice(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'voice',
      voice: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送视频消息
   *
   * @param userId - user ID of the recipient
   * @param video - info of the video to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   *
   * ```js
   * await wechat.sendVideo(USER_ID, {
   *   mediaId: 'MEDIA_ID',
   *   thumbMediaId: 'THUMB_MEDIA_ID',
   *   title: 'VIDEO_TITLE',
   *   description: 'VIDEO_DESCRIPTION',
   * });
   * ```
   */
  public sendVideo(
    userId: string,
    video: WechatTypes.Video,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'video',
      video,
      ...options,
    });
  }

  /**
   * 发送音乐消息
   *
   * @param userId - user ID of the recipient
   * @param news - data of the music to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendMusic(USER_ID, {
   *   musicurl: 'MUSIC_URL',
   *   hqmusicurl: 'HQ_MUSIC_URL',
   *   thumbMediaId: 'THUMB_MEDIA_ID',
   *   title: 'MUSIC_TITLE',
   *   description: 'MUSIC_DESCRIPTION',
   * });
   * ```
   */
  public sendMusic(
    userId: string,
    music: WechatTypes.Music,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'music',
      music,
      ...options,
    });
  }

  /**
   * 发送图文消息（点击跳转到外链）
   *
   * 图文消息条数限制在 8 条以内，注意，如果图文数超过 8，则将会无响应。
   *
   * @param userId - user ID of the recipient
   * @param news - data of the news to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendNews(USER_ID, {
   *   articles: [
   *     {
   *       title: 'Happy Day',
   *       description: 'Is Really A Happy Day',
   *       url: 'URL',
   *       picurl: 'PIC_URL',
   *     },
   *     {
   *       title: 'Happy Day',
   *       description: 'Is Really A Happy Day',
   *       url: 'URL',
   *       picurl: 'PIC_URL',
   *     },
   *   ],
   * });
   * ```
   */
  public sendNews(
    userId: string,
    news: WechatTypes.News,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'news',
      news,
      ...options,
    });
  }

  /**
   * 发送图文消息（点击跳转到图文消息页面）
   *
   * 图文消息条数限制在 8 条以内，注意，如果图文数超过 8，则将会无响应。
   *
   * @param userId - user ID of the recipient
   * @param mediaId - ID of the media to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendMPNews(USER_ID, 'MEDIA_ID');
   * ```
   */
  public sendMPNews(
    userId: string,
    mediaId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'mpnews',
      mpnews: {
        mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送菜单消息
   *
   * @param userId - user ID of the recipient
   * @param msgMenu - data of the msg menu to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendMsgMenu(USER_ID, {
   *   headContent: 'HEAD',
   *   list: [
   *     { id: '101', content: 'Yes' },
   *     { id: '102', content: 'No' },
   *   ],
   *   'tailContent': 'Tail',
   * });
   * ```
   */
  public sendMsgMenu(
    userId: string,
    msgMenu: WechatTypes.MsgMenu,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'msgmenu',
      msgmenu: msgMenu,
      ...options,
    });
  }

  /**
   * 发送卡券
   *
   * @param userId - user ID of the recipient
   * @param cardId - ID of the card to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendWXCard(USER_ID, '123dsdajkasd231jhksad');
   * ```
   */
  public sendWXCard(
    userId: string,
    cardId: string,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'wxcard',
      wxcard: {
        cardId,
      },
      ...options,
    });
  }

  /**
   * 发送小程序卡片（要求小程序与公众号已关联）
   *
   * @param userId - user ID of the recipient
   * @param miniProgramPage - Info of the mini program page to be sent
   * @param options - other options
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.sendMiniProgramPage(USER_ID, {
   *   title: 'title',
   *   appid: 'appid',
   *   pagepath: 'pagepath',
   *   thumbMediaId: 'thumb_media_id',
   * });
   * ```
   */
  public sendMiniProgramPage(
    userId: string,
    miniProgramPage: WechatTypes.MiniProgramPage,
    options?: WechatTypes.SendMessageOptions
  ): Promise<WechatTypes.SucceededResponseData> {
    return this.sendMessage({
      touser: userId,
      msgtype: 'miniprogrampage',
      miniprogrampage: miniProgramPage,
      ...options,
    });
  }

  /**
   * 客服输入状态
   *
   * @param userId - user ID of the recipient
   * @param command - "Typing" or "CancelTyping"
   * @returns error code and error message
   * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html#7
   * @example
   * ```js
   * await wechat.typing(USER_ID, 'Typing');
   * ```
   */
  public async typing(
    userId: string,
    command: WechatTypes.TypingCommand
  ): Promise<WechatTypes.SucceededResponseData> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .post<WechatTypes.ResponseData>(
        '/message/custom/typing',
        {
          touser: userId,
          command,
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      )
      .then((res) => res.data);
  }

  // TODO: 客服帳號相關

  private async refreshToken(): Promise<void> {
    const { accessToken, expiresIn } = await this.getAccessToken();

    this.accessToken = accessToken;
    this.tokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  private async refreshTokenWhenExpired(): Promise<void> {
    if (Date.now() > this.tokenExpiresAt) {
      await this.refreshToken();
    }
  }
}
