/* @flow */

import fs from 'fs';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import axios from 'axios';

import type {
  AccessToken,
  MediaType,
  MiniProgramPage,
  Music,
  News,
  Video,
} from './WechatTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

function throwErrorIfAny(response) {
  const { errcode, errmsg } = response.data;
  if (!errcode || errcode === 0) return response;
  const msg = `WeChat API - ${errcode} ${errmsg}`;
  throw new AxiosError(msg, {
    response,
    config: response.config,
    request: response.request,
  });
}

type ClientConfig = {
  appId: string,
  appSecret: string,
  origin?: string,
};

export default class WechatClient {
  static connect(
    appIdOrClientConfig: string | ClientConfig,
    appSecret: string
  ): WechatClient {
    return new WechatClient(appIdOrClientConfig, appSecret);
  }

  _appId: string;

  _appSecret: string;

  _axios: Axios;

  _accessToken: string = '';

  _tokenExpiresAt: number = 0;

  constructor(appIdOrClientConfig: string | ClientConfig, appSecret: string) {
    let origin;
    if (appIdOrClientConfig && typeof appIdOrClientConfig === 'object') {
      const config = appIdOrClientConfig;

      this._appId = config.appId;
      this._appSecret = config.appSecret;
      origin = config.origin;
    } else {
      this._appId = appIdOrClientConfig;
      this._appSecret = appSecret;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://api.weixin.qq.com'}/cgi-bin/`,
      headers: {
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

  async _refreshToken() {
    const {
      access_token: accessToken,
      expires_in: expiresIn,
    } = await this.getAccessToken();

    this._accessToken = accessToken;
    this._tokenExpiresAt = Date.now() + expiresIn * 1000;
  }

  async _refreshTokenWhenExpired() {
    if (Date.now() > this._tokenExpiresAt) {
      await this._refreshToken();
    }
  }

  /**
   * 获取 access_token
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   */
  getAccessToken(): Promise<AccessToken> {
    return this._axios
      .get(
        `/token?grant_type=client_credential&appid=${this._appId}&secret=${
          this._appSecret
        }`
      )
      .then(res => res.data);
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
  async uploadMedia(type: MediaType, media: Buffer | fs.ReadStream) {
    await this._refreshTokenWhenExpired();

    const form = new FormData();

    form.append('media', media);

    return this._axios
      .post(
        `/media/upload?access_token=${this._accessToken}&type=image`,
        form,
        {
          headers: form.getHeaders(),
        }
      )
      .then(throwErrorIfAny)
      .then(res => res.data);
  }

  /**
   * 下载多媒体文件接口
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738727
   */
  async getMedia(mediaId: string) {
    await this._refreshTokenWhenExpired();

    return this._axios
      .get(`/media/get?access_token=${this._accessToken}&media_id=${mediaId}`)
      .then(throwErrorIfAny)
      .then(res => res.data);
  }

  /**
   * 发送消息-客服消息
   *
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140547
   */
  async sendRawBody(body: Object) {
    await this._refreshTokenWhenExpired();

    return this._axios
      .post(`/message/custom/send?access_token=${this._accessToken}`, body)
      .then(throwErrorIfAny)
      .then(res => res.data);
  }

  /**
   * 发送文本消息
   */
  sendText(userId: string, text: string, options: Object) {
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
  sendImage(userId: string, mediaId: string, options: Object) {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'image',
      image: {
        media_id: mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送语音消息
   */
  sendVoice(userId: string, mediaId: string, options: Object) {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'voice',
      voice: {
        media_id: mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送视频消息
   */
  sendVideo(userId: string, video: Video, options: Object) {
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
  sendMusic(userId: string, music: Music, options: Object) {
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
  sendNews(userId: string, news: News, options: Object) {
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
  sendMPNews(userId: string, mediaId: string, options: Object) {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'mpnews',
      mpnews: {
        media_id: mediaId,
      },
      ...options,
    });
  }

  /**
   * 发送卡券
   */
  sendWXCard(userId: string, cardId: string, options: Object) {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'wxcard',
      wxcard: {
        card_id: cardId,
      },
      ...options,
    });
  }

  /**
   * 发送小程序卡片（要求小程序与公众号已关联）
   */
  sendMiniProgramPage(
    userId: string,
    miniProgramPage: MiniProgramPage,
    options: Object
  ) {
    return this.sendRawBody({
      touser: userId,
      msgtype: 'miniprogrampage',
      miniprogrampage: miniProgramPage,
      ...options,
    });
  }
}
