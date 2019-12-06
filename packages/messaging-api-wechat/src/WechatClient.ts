import fs from 'fs';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  OnRequestFunction,
  camelcaseKeys,
  createRequestInterceptor,
  onRequest,
  snakecaseKeys,
} from 'messaging-api-common';

import * as Types from './WechatTypes';

function throwErrorIfAny(response: AxiosResponse): AxiosResponse | never {
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
  static connect(
    appIdOrClientConfig: string | Types.ClientConfig,
    appSecret: string
  ): WechatClient {
    return new WechatClient(appIdOrClientConfig, appSecret);
  }

  _axios: AxiosInstance;

  _appId: string;

  _appSecret: string;

  _onRequest: OnRequestFunction | undefined;

  _accessToken = '';

  _tokenExpiresAt = 0;

  constructor(
    appIdOrClientConfig: string | Types.ClientConfig,
    appSecret: string
  ) {
    let origin;
    if (appIdOrClientConfig && typeof appIdOrClientConfig === 'object') {
      const config = appIdOrClientConfig;

      this._appId = config.appId;
      this._appSecret = config.appSecret;
      this._onRequest = config.onRequest || onRequest;
      origin = config.origin;
    } else {
      this._appId = appIdOrClientConfig;
      this._appSecret = appSecret;
      this._onRequest = onRequest;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.weixin.qq.com'}/cgi-bin/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this._onRequest,
      })
    );
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  async _refreshToken(): Promise<void> {
    const { accessToken, expiresIn } = await this.getAccessToken();

    this._accessToken = accessToken;
    this._tokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  async _refreshTokenWhenExpired(): Promise<void> {
    if (Date.now() > this._tokenExpiresAt) {
      await this._refreshToken();
    }
  }

  /**
   * 获取 access_token
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   */
  getAccessToken(): Promise<Types.AccessToken> {
    return this._axios
      .get<
        { access_token: string; expires_in: number } | Types.FailedResponseData
      >(
        `/token?grant_type=client_credential&appid=${this._appId}&secret=${this._appSecret}`
      )
      .then(throwErrorIfAny)
      .then(
        res =>
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
   * 图片（image）- 2M，支持 PNG\JPEG\JPG\GIF 格式
   * 语音（voice）- 2M，播放长度不超过 60s，支持 AMR\MP3 格式
   * 视频（video）- 10MB，支持 MP4 格式
   * 缩略图（thumb）- 64KB，支持 JPG 格式
   */

  /**
   * 多媒体文件上传接口
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738726
   */
  async uploadMedia(
    type: Types.MediaType,
    media: Buffer | fs.ReadStream
  ): Promise<Types.UploadedMedia> {
    await this._refreshTokenWhenExpired();

    const form = new FormData();

    form.append('media', media);

    return this._axios
      .post<
        | { type: string; media_id: string; created_at: number }
        | Types.FailedResponseData
      >(`/media/upload?access_token=${this._accessToken}&type=${type}`, form, {
        headers: form.getHeaders(),
      })
      .then(throwErrorIfAny)
      .then(
        res =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * 下载多媒体文件接口
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738727
   */
  async getMedia(mediaId: string): Promise<Types.Media> {
    await this._refreshTokenWhenExpired();

    return this._axios
      .get<{ video_url: string } | Types.FailedResponseData>(
        `/media/get?access_token=${this._accessToken}&media_id=${mediaId}`
      )
      .then(throwErrorIfAny)
      .then(
        res =>
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
  ): Promise<Types.SucceededResponseData | never> {
    await this._refreshTokenWhenExpired();

    return this._axios
      .post<Types.ResponseData>(
        `/message/custom/send?access_token=${this._accessToken}`,
        snakecaseKeys(body, { deep: true })
      )
      .then(throwErrorIfAny)
      .then(
        res =>
          camelcaseKeys(res.data, {
            deep: true,
          }) as any
      );
  }

  /**
   * 发送文本消息
   */
  sendText(
    userId: string,
    text: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendImage(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendVoice(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendVideo(
    userId: string,
    video: Types.Video,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'video',
      video,
      ...options,
    });
  }

  /**
   * 发送音乐消息
   */
  sendMusic(
    userId: string,
    music: Types.Music,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendNews(
    userId: string,
    news: Types.News,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendMPNews(
    userId: string,
    mediaId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendMsgMenu(
    userId: string,
    msgMenu: Types.MsgMenu,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'msgmenu',
      msgmenu: msgMenu,
      ...options,
    });
  }

  /**
   * 发送卡券
   */
  sendWXCard(
    userId: string,
    cardId: string,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
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
   */
  sendMiniProgramPage(
    userId: string,
    miniProgramPage: Types.MiniProgramPage,
    options?: Types.SendMessageOptions
  ): Promise<Types.SucceededResponseData | never> {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'miniprogrampage',
      miniprogrampage: miniProgramPage,
      ...options,
    });
  }

  // TODO: implement typing

  // TODO: 客服帳號相關
}
