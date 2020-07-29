import fs from 'fs';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import invariant from 'ts-invariant';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeys,
  createRequestInterceptor,
  onRequest,
  snakecaseKeys,
} from 'messaging-api-common';

import * as Types from './WechatTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse {
  const { errcode, errmsg } = response.data;
  if (!errcode || errcode === 0) return response;
  const msg = `WeChat API - ${errcode} ${errmsg}`;
  throw new AxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

export default class WechatClient {
  /**
   * @deprecated Use `new WechatClient(...)` instead.
   */
  static connect(config: Types.ClientConfig): WechatClient {
    warning(
      false,
      '`WechatClient.connect(...)` is deprecated. Use `new WechatClient(...)` instead.'
    );
    return new WechatClient(config);
  }

  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The current access token used by the client.
   */
  accessToken = '';

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
   * The timestamp of the token expired time.
   */
  private tokenExpiresAt = 0;

  /**
   *
   * @param config -
   *
   * @example
   */
  constructor(config: Types.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `WechatClient: do not allow constructing client with ${config} string. Use object instead.`
    );
    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.onRequest = config.onRequest || onRequest;
    const { origin } = config;

    this.axios = axios.create({
      baseURL: `${origin || 'https://api.weixin.qq.com'}/cgi-bin/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this.onRequest,
      })
    );
  }

  /**
   * 获取 access_token
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   */
  getAccessToken(): Promise<Types.AccessToken> {
    return this.axios
      .get<
        { access_token: string; expires_in: number } | Types.FailedResponseData
      >(
        `/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
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
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738726
   *
   * @example
   */
  async uploadMedia(
    type: Types.MediaType,
    media: Buffer | fs.ReadStream
  ): Promise<Types.UploadedMedia> {
    await this.refreshTokenWhenExpired();

    const form = new FormData();

    form.append('media', media);

    return this.axios
      .post<
        | { type: string; media_id: string; created_at: number }
        | Types.FailedResponseData
      >(`/media/upload?access_token=${this.accessToken}&type=${type}`, form, {
        headers: form.getHeaders(),
      })
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * 下载多媒体文件接口
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738727
   *
   * @param mediaId -
   *
   * @example
   */
  async getMedia(mediaId: string): Promise<Types.Media> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .get<{ video_url: string } | Types.FailedResponseData>(
        `/media/get?access_token=${this.accessToken}&media_id=${mediaId}`
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * 发送消息-客服消息
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140547
   */
  async sendRawBody(
    body: {
      touser: string;
    } & Types.SendMessageOptions &
      (
        | {
            msgtype: 'text';
            text: {
              content: string;
            };
          }
        | {
            msgtype: 'image';
            image: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'voice';
            voice: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'video';
            video: Types.Video;
          }
        | {
            msgtype: 'music';
            music: Types.Music;
          }
        | {
            msgtype: 'news';
            news: Types.News;
          }
        | {
            msgtype: 'mpnews';
            mpnews: {
              mediaId: string;
            };
          }
        | {
            msgtype: 'msgmenu';
            msgmenu: Types.MsgMenu;
          }
        | {
            msgtype: 'wxcard';
            wxcard: {
              cardId: string;
            };
          }
        | {
            msgtype: 'miniprogrampage';
            miniprogrampage: Types.MiniProgramPage;
          }
      )
  ): Promise<Types.SucceededResponseData> {
    await this.refreshTokenWhenExpired();

    return this.axios
      .post<Types.ResponseData>(
        `/message/custom/send?access_token=${this.accessToken}`,
        snakecaseKeys(body, { deep: true })
      )
      .then(throwErrorIfAny)
      .then(
        (res) =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * 发送文本消息
   *
   * @param userId -
   * @param text -
   * @param options -
   *
   * @example
   */
  sendText(
    userId: string,
    text: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param mediaId -
   * @param options -
   *
   * @example
   */
  sendImage(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param mediaId -
   * @param options -
   *
   * @example
   */
  sendVoice(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param video -
   * @param options -
   *
   * @example
   */
  sendVideo(
    userId: string,
    video: Types.Video,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'video',
      video,
      ...options,
    });
  }

  /**
   * 发送音乐消息
   *
   * @param userId -
   * @param music -
   * @param options -
   *
   * @example
   */
  sendMusic(
    userId: string,
    music: Types.Music,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param news -
   * @param options -
   *
   * @example
   */
  sendNews(
    userId: string,
    news: Types.News,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param mediaId -
   * @param options -
   *
   * @example
   */
  sendMPNews(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param msgMenu -
   * @param options -
   *
   * @example
   */
  sendMsgMenu(
    userId: string,
    msgMenu: Types.MsgMenu,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'msgmenu',
      msgmenu: msgMenu,
      ...options,
    });
  }

  /**
   * 发送卡券
   *
   * @param userId -
   * @param cardId -
   * @param options -
   *
   * @example
   */
  sendWXCard(
    userId: string,
    cardId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
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
   * @param userId -
   * @param miniProgramPage -
   * @param options -
   *
   * @example
   * ```js
   * client.sendMiniProgramPage(USER_ID, {
   *   title: 'title',
   *   appid: 'appid',
   *   pagepath: 'pagepath',
   *   thumbMediaId: 'thumb_media_id',
   * });
   * ```
   */
  sendMiniProgramPage(
    userId: string,
    miniProgramPage: Types.MiniProgramPage,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'miniprogrampage',
      miniprogrampage: miniProgramPage,
      ...options,
    });
  }

  // TODO: implement typing

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
