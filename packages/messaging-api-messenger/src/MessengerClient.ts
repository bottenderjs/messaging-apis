import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';
import url from 'url';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import appendQuery from 'append-query';
import axios, { AxiosInstance, AxiosTransformer } from 'axios';
import get from 'lodash/get';
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import Messenger from './Messenger';
import * as Types from './MessengerTypes';

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

function handleError(err: AxiosError): never {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data.error', {});
    const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

export default class MessengerClient {
  static connect(
    accessTokenOrConfig: string | Types.ClientConfig,
    version = '6.0'
  ): MessengerClient {
    return new MessengerClient(accessTokenOrConfig, version);
  }

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  _accessToken: string;

  _appId?: string;

  _appSecret?: string;

  _version: string;

  constructor(
    accessTokenOrConfig: string | Types.ClientConfig,
    version = '6.0'
  ) {
    let origin;
    let skipAppSecretProof;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._accessToken = config.accessToken;
      invariant(
        !config.version || typeof config.version === 'string',
        'Type of `version` must be string.'
      );

      this._appId = config.appId;
      this._appSecret = config.appSecret;
      this._version = extractVersion(config.version || '6.0');
      this._onRequest = config.onRequest;
      origin = config.origin;

      if (typeof config.skipAppSecretProof === 'boolean') {
        skipAppSecretProof = config.skipAppSecretProof;
      } else {
        skipAppSecretProof = this._appSecret == null;
      }
    } else {
      this._accessToken = accessTokenOrConfig;
      invariant(
        typeof version === 'string',
        'Type of `version` must be string.'
      );

      this._version = extractVersion(version);

      skipAppSecretProof = true;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://graph.facebook.com'}/v${this._version}/`,
      headers: { 'Content-Type': 'application/json' },
      transformRequest: [
        // axios use any as type of the data in AxiosTransformer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any): any =>
          data && isPlainObject(data) ? snakecaseKeysDeep(data) : data,
        ...(axios.defaults.transformRequest as AxiosTransformer[]),
      ],

      // `transformResponse` allows changes to the response data to be made before
      // it is passed to then/catch
      transformResponse: [
        ...(axios.defaults.transformResponse as AxiosTransformer[]),
        // axios use any as type of the data in AxiosTransformer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any): any =>
          data && isPlainObject(data) ? camelcaseKeysDeep(data) : data,
      ],
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );

    // add appsecret_proof to request
    if (!skipAppSecretProof) {
      invariant(
        this._appSecret,
        'Must provide appSecret when skipAppSecretProof is false'
      );

      const appSecret = this._appSecret as string;

      this._axios.interceptors.request.use(config => {
        const isBatch = config.url === '/' && Array.isArray(config.data.batch);

        if (isBatch) {
          // eslint-disable-next-line no-param-reassign
          config.data.batch = config.data.batch.map((item: any) => {
            const urlParts = url.parse(item.relativeUrl, true);
            let accessToken = get(urlParts, 'query.access_token');
            if (!accessToken && item.body) {
              const entries = decodeURIComponent(item.body)
                .split('&')
                .map(pair => pair.split('='));

              const accessTokenEntry = entries.find(
                ([key]) => key === 'access_token'
              );
              if (accessTokenEntry) {
                accessToken = accessTokenEntry[1];
              }
            }

            if (accessToken) {
              const appSecretProof = crypto
                .createHmac('sha256', appSecret)
                .update(accessToken, 'utf8')
                .digest('hex');
              return {
                ...item,
                relativeUrl: appendQuery(item.relativeUrl, {
                  appsecret_proof: appSecretProof,
                }),
              };
            }

            return item;
          });
        }

        const urlParts = url.parse(config.url || '', true);
        const accessToken = get(
          urlParts,
          'query.access_token',
          this._accessToken
        );

        const appSecretProof = crypto
          .createHmac('sha256', appSecret)
          .update(accessToken, 'utf8')
          .digest('hex');

        // eslint-disable-next-line no-param-reassign
        config.url = appendQuery(config.url || '', {
          appsecret_proof: appSecretProof,
        });

        return config;
      });
    }
  }

  get version(): string {
    return this._version;
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get appSecret(): string | undefined {
    return this._appSecret;
  }

  /**
   * Get Page Info
   *
   * https://developers.facebook.com/docs/graph-api/using-graph-api
   * id, name
   */
  getPageInfo({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<Types.PageInfo> {
    return this._axios
      .get(`/me?access_token=${customAccessToken || this._accessToken}`)
      .then(res => res.data, handleError);
  }

  /**
   * Debug Token
   *
   * https://developers.facebook.com/docs/facebook-login/access-tokens/debugging-and-error-handling
   */
  debugToken({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<Types.TokenInfo> {
    invariant(this._appId, 'App ID is required to debug token');
    invariant(this._appSecret, 'App Secret is required to debug token');

    const accessToken = `${this._appId}|${this._appSecret}`;

    return this._axios
      .get(`/debug_token`, {
        params: {
          input_token: customAccessToken || this._accessToken,
          access_token: accessToken,
        },
      })
      .then(res => res.data.data, handleError);
  }

  /**
   * Create Subscription
   *
   * https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   */
  createSubscription({
    object = 'page',
    callbackUrl,
    fields = [
      'messages',
      'messaging_postbacks',
      'messaging_optins',
      'messaging_referrals',
      'messaging_handovers',
      'messaging_policy_enforcement',
    ],
    includeValues,
    verifyToken,
    accessToken: appAccessToken,
  }: {
    object?: 'user' | 'page' | 'permissions' | 'payments';
    callbackUrl: string;
    fields?: string[];
    includeValues?: boolean;
    verifyToken: string;
    accessToken: string;
  }): Promise<{ success: boolean }> {
    const appId = this._appId;

    invariant(appId, 'App ID is required to create subscription');
    invariant(
      this._appSecret || appAccessToken,
      'App Secret or App Token is required to create subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this._appSecret}`;

    return this._axios
      .post(`/${appId}/subscriptions?access_token=${accessToken}`, {
        object,
        callbackUrl,
        fields: fields.join(','),
        includeValues,
        verifyToken,
      })
      .then(res => res.data, handleError);
  }

  /**
   * Get Subscriptions
   *
   * https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   */
  getSubscriptions({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<Types.MessengerSubscription[]> {
    const appId = this._appId;
    invariant(appId, 'App ID is required to get subscriptions');
    invariant(
      this._appSecret || appAccessToken,
      'App Secret or App Token is required to get subscriptions'
    );

    const accessToken = appAccessToken || `${appId}|${this._appSecret}`;

    return this._axios
      .get(`/${appId}/subscriptions?access_token=${accessToken}`)
      .then(res => res.data.data, handleError);
  }

  /**
   * Extract page subscription from subscriptions
   *
   * https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   */
  getPageSubscription({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<Types.MessengerSubscription> {
    const appId = this._appId;
    invariant(appId, 'App ID is required to get subscription');
    invariant(
      this._appSecret || appAccessToken,
      'App Secret or App Token is required to get subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this._appSecret}`;

    return this.getSubscriptions({
      accessToken,
    }).then(
      (subscriptions: Types.MessengerSubscription[]) =>
        subscriptions.filter(
          subscription => subscription.object === 'page'
        )[0] || null
    );
  }

  /**
   *  Messaging Feature Review API
   *
   *  https://developers.facebook.com/docs/messenger-platform/reference/messaging-feature-review-api
   */
  getMessagingFeatureReview({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<Types.MessagingFeatureReview[]> {
    return this._axios
      .get(
        `/me/messaging_feature_review?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);
  }

  /**
   * Get User Profile
   *
   * https://www.quora.com/How-connect-Facebook-user-id-to-sender-id-in-the-Facebook-messenger-platform
   * first_name, last_name, profile_pic, locale, timezone, gender
   */
  getUserProfile(
    userId: string,
    {
      fields = ['id', 'name', 'first_name', 'last_name', 'profile_pic'],
      accessToken: customAccessToken,
    }: { fields?: Types.UserProfileField[]; accessToken?: string } = {}
  ): Promise<Types.User> {
    return this._axios
      .get<Types.User>(
        `/${userId}?fields=${fields.join(
          ','
        )}&access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Messenger Profile
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
   */
  getMessengerProfile(
    fields: string[],
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MessengerProfile[]> {
    return this._axios
      .get<{ data: Types.MessengerProfile[] }>(
        `/me/messenger_profile?fields=${fields.join(
          ','
        )}&access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data.data, handleError);
  }

  setMessengerProfile(
    profile: Types.MessengerProfile,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .post<Types.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${customAccessToken ||
          this._accessToken}`,
        profile
      )
      .then(res => res.data, handleError);
  }

  deleteMessengerProfile(
    fields: string[],
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .delete<Types.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          data: {
            fields,
          },
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Get Started Button
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button
   */
  getGetStarted(
    options: Types.AccessTokenOptions = {}
  ): Promise<{
    payload: string;
  } | null> {
    return this.getMessengerProfile(['get_started'], options).then(res =>
      res[0]
        ? (res[0].getStarted as {
            payload: string;
          })
        : null
    );
  }

  setGetStarted(
    payload: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        getStarted: {
          payload,
        },
      },
      options
    );
  }

  deleteGetStarted(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['get_started'], options);
  }

  /**
   * Persistent Menu
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   */
  getPersistentMenu(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.PersistentMenu | null> {
    return this.getMessengerProfile(['persistent_menu'], options).then(res =>
      res[0] ? (res[0].persistentMenu as Types.PersistentMenu) : null
    );
  }

  setPersistentMenu(
    menuItems: Types.MenuItem[] | Types.PersistentMenuItem[],
    {
      composerInputDisabled = false,
      ...options
    }: {
      composerInputDisabled?: boolean;
      accessToken?: string;
    } = {}
  ): Promise<Types.MutationSuccessResponse> {
    // locale is in type PersistentMenuItem
    if (
      menuItems.some(
        (item: Types.MenuItem | Types.PersistentMenuItem) =>
          'locale' in item && item.locale === 'default'
      )
    ) {
      return this.setMessengerProfile(
        {
          persistentMenu: menuItems as Types.PersistentMenu,
        },
        options
      );
    }

    // menuItems is in type MenuItem[]
    return this.setMessengerProfile(
      {
        persistentMenu: [
          {
            locale: 'default',
            composerInputDisabled,
            callToActions: menuItems as Types.MenuItem[],
          },
        ],
      },
      options
    );
  }

  deletePersistentMenu(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['persistent_menu'], options);
  }

  /**
   * User Level Persistent Menu
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/persistent-menu#user_level_menu
   */
  getUserPersistentMenu(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.PersistentMenu | null> {
    return this._axios
      .get(
        `/me/custom_user_settings?psid=${userId}&access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(
        res =>
          res.data.data[0]
            ? (res.data.data[0].userLevelPersistentMenu as Types.PersistentMenu)
            : null,
        handleError
      );
  }

  setUserPersistentMenu(
    userId: string,
    menuItems: Types.MenuItem[] | Types.PersistentMenuItem[],
    {
      composerInputDisabled = false,
      accessToken: customAccessToken,
    }: {
      composerInputDisabled?: boolean;
      accessToken?: string;
    } = {}
  ): Promise<Types.MutationSuccessResponse> {
    // locale is in type PersistentMenuItem
    if (
      menuItems.some(
        (item: Types.MenuItem | Types.PersistentMenuItem) =>
          'locale' in item && item.locale === 'default'
      )
    ) {
      return this._axios
        .post<Types.MutationSuccessResponse>(
          `/me/custom_user_settings?access_token=${customAccessToken ||
            this._accessToken}`,
          {
            psid: userId,
            persistentMenu: menuItems as Types.PersistentMenu,
          }
        )
        .then(res => res.data, handleError);
    }

    // menuItems is in type MenuItem[]
    return this._axios
      .post(
        `/me/custom_user_settings?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          psid: userId,
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled,
              callToActions: menuItems as Types.MenuItem[],
            },
          ],
        }
      )
      .then(res => res.data, handleError);
  }

  deleteUserPersistentMenu(
    userId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this._axios
      .delete(
        `/me/custom_user_settings?psid=${userId}&params=[%22persistent_menu%22]&access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Greeting Text
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   */
  getGreeting(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.GreetingConfig[] | null> {
    return this.getMessengerProfile(['greeting'], options).then(res =>
      res[0] ? (res[0].greeting as Types.GreetingConfig[]) : null
    );
  }

  setGreeting(
    greeting: string | Types.GreetingConfig[],
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    if (typeof greeting === 'string') {
      return this.setMessengerProfile(
        {
          greeting: [
            {
              locale: 'default',
              text: greeting,
            },
          ],
        },
        options
      );
    }

    return this.setMessengerProfile(
      {
        greeting,
      },
      options
    );
  }

  deleteGreeting(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['greeting'], options);
  }

  /**
   * Ice Breakers
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/ice-breakers
   */
  getIceBreakers(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.IceBreaker[] | null> {
    return this.getMessengerProfile(['ice_breakers'], options).then(res =>
      res[0] ? (res[0].iceBreakers as Types.IceBreaker[]) : null
    );
  }

  setIceBreakers(
    iceBreakers: Types.IceBreaker[],
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        iceBreakers,
      },
      options
    );
  }

  deleteIceBreakers(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['ice_breakers'], options);
  }

  /**
   * Whitelisted Domains
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   */
  getWhitelistedDomains(
    options: Types.AccessTokenOptions = {}
  ): Promise<string[] | null> {
    return this.getMessengerProfile(
      ['whitelisted_domains'],
      options
    ).then(res => (res[0] ? (res[0].whitelistedDomains as string[]) : null));
  }

  setWhitelistedDomains(
    whitelistedDomains: string[],
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        whitelistedDomains,
      },
      options
    );
  }

  deleteWhitelistedDomains(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['whitelisted_domains'], options);
  }

  /**
   * Account Linking URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   */
  getAccountLinkingURL(
    options: Types.AccessTokenOptions = {}
  ): Promise<string | null> {
    return this.getMessengerProfile(
      ['account_linking_url'],
      options
    ).then(res => (res[0] ? (res[0] as string) : null));
  }

  setAccountLinkingURL(
    accountLinkingUrl: string,
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        accountLinkingUrl,
      },
      options
    );
  }

  deleteAccountLinkingURL(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['account_linking_url'], options);
  }

  /**
   * Chat Extension Home URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/home-url
   */
  getHomeURL(
    options: Types.AccessTokenOptions = {}
  ): Promise<{
    url: string;
    webviewHeightRatio: 'tall';
    webviewShareButton?: 'hide' | 'show';
    inTest: boolean;
  } | null> {
    return this.getMessengerProfile(['home_url'], options).then(res =>
      res[0]
        ? (res[0] as {
            url: string;
            webviewHeightRatio: 'tall';
            webviewShareButton?: 'hide' | 'show';
            inTest: boolean;
          })
        : null
    );
  }

  setHomeURL(
    homeUrl: string,
    {
      webviewHeightRatio = 'tall',
      webviewShareButton,
      inTest,
    }: {
      webviewHeightRatio?: 'tall';
      webviewShareButton?: 'hide' | 'show';
      inTest: boolean;
    },
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        homeUrl: {
          url: homeUrl,
          webviewHeightRatio,
          inTest,
          webviewShareButton,
        },
      },
      options
    );
  }

  deleteHomeURL(
    options: Types.AccessTokenOptions = {}
  ): Promise<Types.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['home_url'], options);
  }

  /**
   * Message tags
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags
   */
  getMessageTags({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<Types.MessageTagResponse> {
    return this._axios
      .get<{ data: Types.MessageTagResponse }>(
        `/page_message_tags?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);
  }

  /**
   * Send API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/send-api
   */
  sendRawBody(
    body: Record<string, any>
  ): Promise<Types.SendMessageSuccessResponse> {
    const { accessToken: customAccessToken } = body;

    return this._axios
      .post<Types.SendMessageSuccessResponse>(
        `/me/messages?access_token=${customAccessToken || this._accessToken}`,
        body
      )
      .then(res => res.data, handleError);
  }

  sendMessage(
    psidOrRecipient: Types.PsidOrRecipient,
    message: Types.Message,
    options: Types.SendOption = {}
  ): Promise<Types.SendMessageSuccessResponse> {
    const recipient =
      typeof psidOrRecipient === 'string'
        ? {
            id: psidOrRecipient,
          }
        : psidOrRecipient;

    let messagingType = 'UPDATE';

    if (options.messagingType) {
      messagingType = options.messagingType;
    } else if (options.tag) {
      messagingType = 'MESSAGE_TAG';
    }

    return this.sendRawBody({
      messagingType,
      recipient,
      message: Messenger.createMessage(message, options),
      ...omit(options, 'quickReplies'),
    });
  }

  sendMessageFormData(
    psidOrRecipient: Types.PsidOrRecipient,
    formdata: FormData,
    options: Types.SendOption = {}
  ): Promise<Types.SendMessageSuccessResponse> {
    const recipient =
      typeof psidOrRecipient === 'string'
        ? {
            id: psidOrRecipient,
          }
        : psidOrRecipient;

    let messagingType = 'UPDATE';
    if (options.messagingType) {
      messagingType = options.messagingType;
    } else if (options.tag) {
      messagingType = 'MESSAGE_TAG';
    }

    formdata.append('messaging_type', messagingType);
    formdata.append('recipient', JSON.stringify(snakecaseKeysDeep(recipient)));

    return this._axios
      .post<Types.SendMessageSuccessResponse>(
        `/me/messages?access_token=${options.accessToken || this._accessToken}`,
        formdata,
        {
          headers: formdata.getHeaders(),
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Content Types
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages#content_types
   */
  sendAttachment(
    psidOrRecipient: Types.PsidOrRecipient,
    attachment: Types.Attachment,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAttachment(attachment, options),
      options
    );
  }

  sendText(
    psidOrRecipient: Types.PsidOrRecipient,
    text: string,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createText(text, options),
      options
    );
  }

  sendAudio(
    psidOrRecipient: Types.PsidOrRecipient,
    audio: string | Types.FileData | Types.MediaAttachmentPayload,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(audio) || audio instanceof fs.ReadStream) {
      const message = Messenger.createAudioFormData(audio, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createAudio(audio, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  sendImage(
    psidOrRecipient: Types.PsidOrRecipient,
    image: string | Types.FileData | Types.MediaAttachmentPayload,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(image) || image instanceof fs.ReadStream) {
      const message = Messenger.createImageFormData(image, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createImage(image, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  sendVideo(
    psidOrRecipient: Types.PsidOrRecipient,
    video: string | Types.FileData | Types.MediaAttachmentPayload,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(video) || video instanceof fs.ReadStream) {
      const message = Messenger.createVideoFormData(video, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createVideo(video, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  sendFile(
    psidOrRecipient: Types.PsidOrRecipient,
    file: string | Types.FileData | Types.MediaAttachmentPayload,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(file) || file instanceof fs.ReadStream) {
      const message = Messenger.createFileFormData(file, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createFile(file, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  /**
   * Message Templates
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/templates
   */
  sendTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    payload: Types.TemplateAttachmentPayload,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createTemplate(payload, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/button
  sendButtonTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    text: string,
    buttons: Types.TemplateButton[],
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createButtonTemplate(text, buttons, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
  sendGenericTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    elements: Types.TemplateElement[],
    options: {
      imageAspectRatio?: 'horizontal' | 'square';
    } & Types.SendOption = {}
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createGenericTemplate(elements, options),
      omit(options, ['imageAspectRatio'])
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt
  sendReceiptTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.ReceiptAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createReceiptTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/media
  sendMediaTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    elements: Types.MediaElement[],
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createMediaTemplate(elements, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#boarding_pass
  sendAirlineBoardingPassTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.AirlineBoardingPassAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineBoardingPassTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#check_in
  sendAirlineCheckinTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.AirlineCheckinAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineCheckinTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#itinerary
  sendAirlineItineraryTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.AirlineItineraryAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineItineraryTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#update
  sendAirlineUpdateTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.AirlineUpdateAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineUpdateTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/one-time-notification/#one-time-notif
  sendOneTimeNotifReqTemplate(
    psidOrRecipient: Types.PsidOrRecipient,
    attrs: Types.OneTimeNotifReqAttributes,
    options?: Types.SendOption
  ): Promise<Types.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createOneTimeNotifReqTemplate(attrs, options),
      options
    );
  }

  /**
   * Typing
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
   */
  sendSenderAction(
    psidOrRecipient: Types.PsidOrRecipient,
    senderAction: Types.SenderAction,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.SendSenderActionResponse> {
    const recipient =
      typeof psidOrRecipient === 'string'
        ? {
            id: psidOrRecipient,
          }
        : psidOrRecipient;
    return this.sendRawBody({
      recipient,
      senderAction,
      accessToken: customAccessToken,
    });
  }

  markSeen(
    psidOrRecipient: Types.PsidOrRecipient,
    options: Record<string, any> = {}
  ): Promise<Types.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'mark_seen', options);
  }

  typingOn(
    psidOrRecipient: Types.PsidOrRecipient,
    options: Record<string, any> = {}
  ): Promise<Types.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'typing_on', options);
  }

  typingOff(
    psidOrRecipient: Types.PsidOrRecipient,
    options: Record<string, any> = {}
  ): Promise<Types.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'typing_off', options);
  }

  /**
   * Send Batch Request
   *
   * https://developers.facebook.com/docs/graph-api/making-multiple-requests
   */
  sendBatch(
    batch: Types.BatchItem[],
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<Types.SendMessageSuccessResponse[]> {
    invariant(
      batch.length <= 50,
      'limit the number of requests which can be in a batch to 50'
    );

    const responseAccessPaths = batch.map(item => item.responseAccessPath);

    const bodyEncodedbatch = batch
      .map(item => omit(item, 'responseAccessPath'))
      .map(item => {
        if (item.body) {
          const body = snakecaseKeysDeep(item.body) as Record<string, any>;
          return {
            ...item,
            body: Object.keys(body)
              .map(key => {
                const val = body[key];
                return `${encodeURIComponent(key)}=${encodeURIComponent(
                  typeof val === 'object' ? JSON.stringify(val) : val
                )}`;
              })
              .join('&'),
          };
        }
        return item;
      });

    return this._axios
      .post('/', {
        accessToken: customAccessToken || this._accessToken,
        batch: bodyEncodedbatch,
      })
      .then(
        res =>
          res.data.map(
            (item: { code: number; body: string }, index: number) => {
              const responseAccessPath = responseAccessPaths[index];
              const datum = camelcaseKeysDeep(item) as Record<string, any>;
              if (responseAccessPath && datum.body) {
                return {
                  ...datum,
                  body: JSON.stringify(
                    get(
                      camelcaseKeysDeep(JSON.parse(datum.body)),
                      responseAccessPath
                    )
                  ),
                };
              }
              return datum;
            }
          ),
        handleError
      );
  }

  /**
   * Label API
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts
   */

  /**
   * Create Label
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#create_label
   */
  createLabel(
    name: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ id: string }> {
    return this._axios
      .post<{ id: string }>(
        `/me/custom_labels?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          name,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Associating a Label to a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#associate_label
   */
  associateLabel(
    userId: string,
    labelId: number,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .post<{ success: true }>(
        `/${labelId}/label?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          user: userId,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Removing a Label From a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#remove_label
   */
  dissociateLabel(
    userId: string,
    labelId: number,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .delete<{ success: true }>(
        `/${labelId}/label?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          data: { user: userId },
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving Labels Associated with a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#retrieving_labels_by_psid
   */
  getAssociatedLabels(
    userId: string,
    options: { accessToken?: string; fields?: string[] } = {}
  ): Promise<{
    data: { name: string; id: string }[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }> {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get<{
        data: { name: string; id: string }[];
        paging: {
          cursors: {
            before: string;
            after: string;
          };
        };
      }>(
        `/${userId}/custom_labels?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving Label Details
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#get_label_details
   */
  getLabelDetails(
    labelId: number,
    options: { accessToken?: string; fields?: string[] } = {}
  ): Promise<{ name: string; id: string }> {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get<{ name: string; id: string }>(
        `/${labelId}?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving a List of All Labels
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#get_all_labels
   */
  getLabelList(
    options: { accessToken?: string; fields?: string[] } = {}
  ): Promise<{
    data: { name: string; id: string }[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }> {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get<{
        data: { name: string; id: string }[];
        paging: {
          cursors: {
            before: string;
            after: string;
          };
        };
      }>(
        `/me/custom_labels?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Deleting a Label
   *
   * https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#delete_label
   */
  deleteLabel(
    labelId: number,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .delete<{ success: true }>(
        `/${labelId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Upload API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api
   */
  // FIXME: [type] return type
  uploadAttachment(
    type: 'audio' | 'image' | 'video' | 'file',
    attachment: string | Types.FileData,
    options: Types.UploadOption = {}
  ) {
    const args = [];

    const isReusable = options.isReusable || false;

    if (typeof attachment === 'string') {
      args.push({
        message: {
          attachment: {
            type,
            payload: {
              url: attachment,
              isReusable,
            },
          },
        },
      });
    } else {
      const form = new FormData();

      form.append(
        'message',
        JSON.stringify({
          attachment: {
            type,
            payload: {
              is_reusable: isReusable,
            },
          },
        })
      );

      form.append('filedata', attachment, omit(options, ['is_reusable']));

      args.push(form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity, // Facebook limit is 25MB, set a bigger value and let Facebook reject it
      });
    }

    return this._axios
      .post(
        `/me/message_attachments?access_token=${options.accessToken ||
          this._accessToken}`,
        ...args
      )
      .then(res => res.data, handleError);
  }

  // FIXME: use TypeScript overloading
  uploadAudio(
    attachment: string | Types.FileData,
    options?: Types.UploadOption
  ) {
    return this.uploadAttachment('audio', attachment, options);
  }

  // FIXME: use TypeScript overloading
  uploadImage(
    attachment: string | Types.FileData,
    options?: Types.UploadOption
  ) {
    return this.uploadAttachment('image', attachment, options);
  }

  // FIXME: use TypeScript overloading
  uploadVideo(
    attachment: string | Types.FileData,
    options?: Types.UploadOption
  ) {
    return this.uploadAttachment('video', attachment, options);
  }

  // FIXME: use TypeScript overloading
  uploadFile(
    attachment: string | Types.FileData,
    options?: Types.UploadOption
  ) {
    return this.uploadAttachment('file', attachment, options);
  }

  /**
   * Handover Protocol API
   *
   * https://developers.facebook.com/docs/messenger-platform/handover-protocol
   */

  /**
   * Pass Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/pass-thread-control
   */
  passThreadControl(
    recipientId: string,
    targetAppId: number,
    metadata?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .post<{ success: true }>(
        `/me/pass_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          targetAppId,
          metadata,
        }
      )
      .then(res => res.data, handleError);
  }

  passThreadControlToPageInbox(
    recipientId: string,
    metadata?: string,
    options: Record<string, any> = {}
  ): Promise<{ success: true }> {
    return this.passThreadControl(
      recipientId,
      263902037430900,
      metadata,
      options
    );
  }

  /**
   * Take Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/take-thread-control
   */
  takeThreadControl(
    recipientId: string,
    metadata?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .post<{ success: true }>(
        `/me/take_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          metadata,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Request Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/handover-protocol/request-thread-control/
   */
  requestThreadControl(
    recipientId: string,
    metadata?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .post<{ success: true }>(
        `/me/request_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          metadata,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Secondary Receivers List
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/secondary-receivers
   */
  getSecondaryReceivers({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<
    {
      id: string;
      name: string;
    }[]
  > {
    return this._axios
      .get<{
        data: {
          id: string;
          name: string;
        }[];
      }>(
        `/me/secondary_receivers?fields=id,name&access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);
  }

  /**
   * Getting the Thread Owner
   *
   * https://developers.facebook.com/docs/messenger-platform/handover-protocol/get-thread-owner
   */
  getThreadOwner(
    recipientId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{
    appId: string;
  }> {
    return this._axios
      .get<{
        data: [
          {
            threadOwner: {
              appId: string;
            };
          }
        ];
      }>(
        `/me/thread_owner?recipient=${recipientId}&access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data[0].threadOwner, handleError);
  }

  /**
   * Page Messaging Insights API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api
   */
  getInsights(
    metrics: Types.InsightMetric[],
    options: Types.InsightOptions = {}
  ) {
    return this._axios
      .get(
        `/me/insights/?${querystring.stringify({
          metric: metrics.join(','),
          access_token: options.accessToken || this._accessToken,
          ...options,
        })}`
      )
      .then(res => res.data.data, handleError);
  }

  getBlockedConversations(
    options: Types.InsightOptions
  ): Promise<{
    name: 'page_messages_blocked_conversations_unique';
    period: 'day';
    values: {
      value: number | object;
      endTime: string;
    }[];
  }> {
    return this.getInsights(
      ['page_messages_blocked_conversations_unique'],
      options
    ).then(result => result[0]);
  }

  getReportedConversations(
    options: Types.InsightOptions
  ): Promise<{
    name: 'page_messages_reported_conversations_unique';
    period: 'day';
    values: {
      value: number | object;
      endTime: string;
    }[];
  }> {
    return this.getInsights(
      ['page_messages_reported_conversations_unique'],
      options
    ).then(result => result[0]);
  }

  // https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api?locale=en_US#metrics
  // This metrics replaces the page_messages_open_conversations_unique metric, which was deprecated on May 11, 2018.
  getTotalMessagingConnections(
    options: Types.InsightOptions
  ): Promise<{
    name: 'page_messages_total_messaging_connections';
    period: 'day';
    values: {
      value: number | object;
      endTime: string;
    }[];
  }> {
    return this.getInsights(
      ['page_messages_total_messaging_connections'],
      options
    ).then(result => result[0]);
  }

  getNewConversations(
    options: Types.InsightOptions
  ): Promise<{
    name: 'page_messages_new_conversations_unique';
    period: 'day';
    values: {
      value: number | object;
      endTime: string;
    }[];
  }> {
    return this.getInsights(
      ['page_messages_new_conversations_unique'],
      options
    ).then(result => result[0]);
  }

  /**
   * Built-in NLP API
   *
   * https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   */
  // FIXME: [type] return type
  setNLPConfigs(
    config: Types.MessengerNLPConfig = {},
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<any> {
    return this._axios
      .post(
        `/me/nlp_configs?${querystring.stringify(
          snakecaseKeysDeep(config) as Record<string, any>
        )}`,
        {
          accessToken: customAccessToken || this._accessToken,
        }
      )
      .then(res => res.data, handleError);
  }

  // FIXME: [type] return type
  enableNLP(options: Types.AccessTokenOptions = {}): Promise<any> {
    return this.setNLPConfigs({ nlpEnabled: true }, options);
  }

  // FIXME: [type] return type
  disableNLP(options: Types.AccessTokenOptions = {}): Promise<any> {
    return this.setNLPConfigs({ nlpEnabled: false }, options);
  }

  /**
   * Logging Custom Events
   *
   * https://developers.facebook.com/docs/app-events/bots-for-messenger#logging-custom-events
   */
  // FIXME: [type] return type
  logCustomEvents({
    appId,
    pageId,
    pageScopedUserId,
    events,
  }: {
    appId: number;
    pageId: number;
    pageScopedUserId: string;
    events: Record<string, any>[];
  }) {
    return this._axios
      .post(`/${appId}/activities`, {
        event: 'CUSTOM_APP_EVENTS',
        customEvents: JSON.stringify(events),
        advertiserTrackingEnabled: 0,
        applicationTrackingEnabled: 0,
        extinfo: JSON.stringify(['mb1']),
        pageId,
        pageScopedUserId,
      })
      .then(res => res.data, handleError);
  }

  /**
   * https://developers.facebook.com/docs/messenger-platform/identity/id-matching#examples
   */
  // FIXME: [type] return type
  getUserField({
    field,
    userId,
    appSecret,
    app,
    page,
    accessToken: customAccessToken,
  }: {
    field: string;
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
    accessToken?: string;
  }) {
    const accessToken = customAccessToken || this._accessToken;

    // $appsecret_proof= hash_hmac('sha256', $access_token, $app_secret);
    const appsecretProof = crypto
      .createHmac('sha256', appSecret)
      .update(accessToken)
      .digest('hex');

    const appQueryString = app ? `&app=${app}` : '';
    const pageQueryString = page ? `&page=${page}` : '';

    return this._axios
      .get(
        `/${userId}/${field}?access_token=${accessToken}&appsecret_proof=${appsecretProof}${appQueryString}${pageQueryString}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Given a user ID for a bot in Messenger, retrieve the IDs for apps owned by the same business
   */
  // FIXME: [type] return type
  getIdsForApps({
    userId,
    appSecret,
    app,
    page,
    accessToken,
  }: {
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
    accessToken?: string;
  }) {
    return this.getUserField({
      field: 'ids_for_apps',
      userId,
      appSecret,
      app,
      page,
      accessToken,
    });
  }

  /**
   * Given a user ID for a Page (associated with a bot), retrieve the IDs for other Pages owned by the same business
   */
  // FIXME: [type] return type
  getIdsForPages({
    userId,
    appSecret,
    app,
    page,
    accessToken,
  }: {
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
    accessToken?: string;
  }) {
    return this.getUserField({
      field: 'ids_for_pages',
      userId,
      appSecret,
      app,
      page,
      accessToken,
    });
  }

  /**
   * Personas API
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas
   */

  /**
   * Creating a Persona
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#create
   */
  createPersona(
    persona: Types.Persona,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ id: string }> {
    return this._axios
      .post<{ id: string }>(
        `/me/personas?access_token=${customAccessToken || this._accessToken}`,
        persona
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving a Persona
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#get
   */
  getPersona(
    personaId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{
    id: string;
    name: string;
    profilePictureUrl: string;
  }> {
    return this._axios
      .get<{
        id: string;
        name: string;
        profilePictureUrl: string;
      }>(`/${personaId}?access_token=${customAccessToken || this._accessToken}`)
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving All Available Personas
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#retrieve_all
   */
  getPersonas(
    cursor?: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{
    data: {
      id: string;
      name: string;
      profilePictureUrl: string;
    }[];
    paging: { cursors: { before: string; after: string } };
  }> {
    return this._axios
      .get<{
        data: {
          id: string;
          name: string;
          profilePictureUrl: string;
        }[];
        paging: { cursors: { before: string; after: string } };
      }>(
        `/me/personas?access_token=${customAccessToken || this._accessToken}${
          cursor ? `&after=${cursor}` : ''
        }`
      )
      .then(res => res.data, handleError);
  }

  async getAllPersonas({
    accessToken: customAccessToken,
  }: Types.AccessTokenOptions = {}): Promise<
    {
      id: string;
      name: string;
      profilePictureUrl: string;
    }[]
  > {
    let allPersonas: {
      id: string;
      name: string;
      profilePictureUrl: string;
    }[] = [];
    let cursor;

    do {
      // eslint-disable-next-line no-await-in-loop
      const {
        data,
        paging,
      }: {
        data: {
          id: string;
          name: string;
          profilePictureUrl: string;
        }[];
        paging: { cursors: { before: string; after: string } };
        // eslint-disable-next-line no-await-in-loop
      } = await this.getPersonas(cursor, {
        accessToken: customAccessToken,
      });

      allPersonas = allPersonas.concat(data);
      cursor = paging ? paging.cursors.after : null;
    } while (cursor);

    return allPersonas;
  }

  /**
   * Deleting a Persona
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#remove
   */
  deletePersona(
    personaId: string,
    { accessToken: customAccessToken }: Types.AccessTokenOptions = {}
  ): Promise<{ success: true }> {
    return this._axios
      .delete<{ success: true }>(
        `/${personaId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }
}
