import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';
import url from 'url';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import appendQuery from 'append-query';
import axios, { AxiosInstance } from 'axios';
import get from 'lodash/get';
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import Messenger from './Messenger';
import {
  AccessTokenOptions,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  BatchItem,
  FileData,
  GreetingConfig,
  IceBreaker,
  InsightMetric,
  InsightOptions,
  MediaAttachmentPayload,
  MediaElement,
  MenuItem,
  Message,
  MessageTagResponse,
  MessagingFeatureReview,
  MessengerNLPConfig,
  MessengerProfile,
  MessengerSubscription,
  MutationSuccessResponse,
  PageInfo,
  PersistentMenu,
  Persona,
  ReceiptAttributes,
  Recipient,
  SendMessageSuccessResponse,
  SendOption,
  SendSenderActionResponse,
  SenderAction,
  TemplateAttachmentPayload,
  TemplateButton,
  TemplateElement,
  TokenInfo,
  UploadOption,
  User,
  UserID,
} from './MessengerTypes';

type ClientConfig = {
  accessToken: string;
  appId?: string;
  appSecret?: string;
  version?: string;
  origin?: string;
  onRequest?: OnRequestFunction;
  skipAppSecretProof?: boolean;
};

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

function handleError(err: AxiosError): void {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data.error', {});
    const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

export default class MessengerClient {
  static connect(
    accessTokenOrConfig: string | ClientConfig,
    version = '4.0'
  ): MessengerClient {
    return new MessengerClient(accessTokenOrConfig, version);
  }

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  _accessToken: string;

  _appId?: string;

  _appSecret?: string;

  _version: string;

  constructor(accessTokenOrConfig: string | ClientConfig, version = '4.0') {
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
      this._version = extractVersion(config.version || '4.0');
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
        (data: any) =>
          data && isPlainObject(data) ? snakecaseKeysDeep(data) : data,
      ],

      // `transformResponse` allows changes to the response data to be made before
      // it is passed to then/catch
      transformResponse: [
        (data: any) =>
          data && isPlainObject(data) ? camelcaseKeysDeep(data) : data,
      ],
    });

    // add appsecret_proof to request
    if (!skipAppSecretProof) {
      invariant(
        this._appSecret,
        'Must provide appSecret when skipAppSecretProof is false'
      );

      const appSecret = this._appSecret as string;

      this._axios.interceptors.request.use(config => {
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

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );
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
  }: AccessTokenOptions = {}): Promise<PageInfo> {
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
  }: AccessTokenOptions = {}): Promise<TokenInfo> {
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
  } = {}): Promise<MessengerSubscription[]> {
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
  } = {}): Promise<MessengerSubscription> {
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
      (subscriptions: MessengerSubscription[]) =>
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
  }: AccessTokenOptions = {}): Promise<MessagingFeatureReview[]> {
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
      accessToken: customAccessToken,
      fields = ['id', 'name', 'first_name', 'last_name', 'profile_pic'],
    }: { accessToken?: string; fields?: string[] } = {}
  ): Promise<User> {
    return this._axios
      .get(
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
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<MessengerProfile[]> {
    return this._axios
      .get(
        `/me/messenger_profile?fields=${fields.join(
          ','
        )}&access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data.data, handleError);
  }

  setMessengerProfile(
    profile: MessengerProfile,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .post(
        `/me/messenger_profile?access_token=${customAccessToken ||
          this._accessToken}`,
        profile
      )
      .then(res => res.data, handleError);
  }

  deleteMessengerProfile(
    fields: string[],
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this._axios
      .delete(
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
    options: AccessTokenOptions = {}
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
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['get_started'], options);
  }

  /**
   * Persistent Menu
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   */
  getPersistentMenu(
    options: AccessTokenOptions = {}
  ): Promise<PersistentMenu | null> {
    return this.getMessengerProfile(['persistent_menu'], options).then(res =>
      res[0] ? (res[0].persistentMenu as PersistentMenu) : null
    );
  }

  setPersistentMenu(
    menuItems: MenuItem[] | PersistentMenu,
    {
      composerInputDisabled = false,
      ...options
    }: {
      composerInputDisabled?: boolean;
      accessToken?: string;
    } = {}
  ): Promise<MutationSuccessResponse> {
    // menuItems is in type PersistentMenu
    if (
      menuItems.some((item: Record<string, any>) => item.locale === 'default')
    ) {
      return this.setMessengerProfile(
        {
          persistentMenu: menuItems as PersistentMenu,
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
            callToActions: menuItems as MenuItem[],
          },
        ],
      },
      options
    );
  }

  deletePersistentMenu(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['persistent_menu'], options);
  }

  /**
   * Greeting Text
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   */
  getGreeting(
    options: AccessTokenOptions = {}
  ): Promise<GreetingConfig[] | null> {
    return this.getMessengerProfile(['greeting'], options).then(res =>
      res[0] ? (res[0].greeting as GreetingConfig[]) : null
    );
  }

  setGreeting(
    greeting: string | GreetingConfig[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['greeting'], options);
  }

  /**
   * Ice Breakers
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/ice-breakers
   */
  getIceBreakers(
    options: AccessTokenOptions = {}
  ): Promise<IceBreaker[] | null> {
    return this.getMessengerProfile(['ice_breakers'], options).then(res =>
      res[0] ? (res[0].iceBreakers as IceBreaker[]) : null
    );
  }

  setIceBreakers(
    iceBreakers: IceBreaker[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        iceBreakers,
      },
      options
    );
  }

  deleteIceBreakers(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['ice_breakers'], options);
  }

  /**
   * Whitelisted Domains
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   */
  getWhitelistedDomains(
    options: AccessTokenOptions = {}
  ): Promise<string[] | null> {
    return this.getMessengerProfile(
      ['whitelisted_domains'],
      options
    ).then(res => (res[0] ? (res[0].whitelistedDomains as string[]) : null));
  }

  setWhitelistedDomains(
    whitelistedDomains: string[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        whitelistedDomains,
      },
      options
    );
  }

  deleteWhitelistedDomains(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['whitelisted_domains'], options);
  }

  /**
   * Account Linking URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   */
  getAccountLinkingURL(
    options: AccessTokenOptions = {}
  ): Promise<string | null> {
    return this.getMessengerProfile(
      ['account_linking_url'],
      options
    ).then(res => (res[0] ? (res[0] as string) : null));
  }

  setAccountLinkingURL(
    accountLinkingUrl: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        accountLinkingUrl,
      },
      options
    );
  }

  deleteAccountLinkingURL(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['account_linking_url'], options);
  }

  /**
   * Payment Settings
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/payment-settings
   */
  getPaymentSettings(
    options: AccessTokenOptions = {}
  ): Promise<{
    privacyUrl?: string;
    publicKey?: string;
    testUsers?: string[];
  } | null> {
    return this.getMessengerProfile(['payment_settings'], options).then(res =>
      res[0]
        ? (res[0] as {
            privacyUrl?: string;
            publicKey?: string;
            testUsers?: string[];
          })
        : null
    );
  }

  setPaymentPrivacyPolicyURL(
    privacyUrl: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        paymentSettings: {
          privacyUrl,
        },
      },

      options
    );
  }

  setPaymentPublicKey(
    publicKey: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        paymentSettings: {
          publicKey,
        },
      },
      options
    );
  }

  setPaymentTestUsers(
    testUsers: string[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        paymentSettings: {
          testUsers,
        },
      },
      options
    );
  }

  deletePaymentSettings(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['payment_settings'], options);
  }

  /**
   * Chat Extension Home URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/home-url
   */
  getHomeURL(
    options: AccessTokenOptions = {}
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
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
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
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['home_url'], options);
  }

  /**
   * Message tags
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags
   */
  getMessageTags({
    accessToken: customAccessToken,
  }: AccessTokenOptions = {}): Promise<MessageTagResponse> {
    return this._axios
      .get(
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
  sendRawBody(body: Record<string, any>): Promise<SendMessageSuccessResponse> {
    const { accessToken: customAccessToken } = body;

    return this._axios
      .post(
        `/me/messages?access_token=${customAccessToken || this._accessToken}`,
        body
      )
      .then(res => res.data, handleError);
  }

  sendMessage(
    idOrRecipient: UserID | Recipient,
    message: Message,
    options: SendOption = {}
  ): Promise<SendMessageSuccessResponse> {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;

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
    recipient: UserID | Recipient,
    formdata: FormData,
    options: SendOption = {}
  ) {
    const recipientObject =
      typeof recipient === 'string'
        ? {
            id: recipient,
          }
        : recipient;

    let messagingType = 'UPDATE';
    if (options.messagingType) {
      messagingType = options.messagingType;
    } else if (options.tag) {
      messagingType = 'MESSAGE_TAG';
    }

    formdata.append('messaging_type', messagingType);
    formdata.append(
      'recipient',
      JSON.stringify(snakecaseKeysDeep(recipientObject))
    );

    return this._axios
      .post(
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
    recipient: UserID | Recipient,
    attachment: Attachment,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createAttachment(attachment, options),
      options
    );
  }

  sendText(
    recipient: UserID | Recipient,
    text: string,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createText(text, options),
      options
    );
  }

  sendAudio(
    recipient: UserID | Recipient,
    audio: string | FileData | MediaAttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    if (Buffer.isBuffer(audio) || audio instanceof fs.ReadStream) {
      const message = Messenger.createAudioFormData(audio, options);
      return this.sendMessageFormData(recipient, message, options);
    }

    const message = Messenger.createAudio(audio, options);
    return this.sendMessage(recipient, message, options);
  }

  sendImage(
    recipient: UserID | Recipient,
    image: string | FileData | MediaAttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    if (Buffer.isBuffer(image) || image instanceof fs.ReadStream) {
      const message = Messenger.createImageFormData(image, options);
      return this.sendMessageFormData(recipient, message, options);
    }

    const message = Messenger.createImage(image, options);
    return this.sendMessage(recipient, message, options);
  }

  sendVideo(
    recipient: UserID | Recipient,
    video: string | FileData | MediaAttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    if (Buffer.isBuffer(video) || video instanceof fs.ReadStream) {
      const message = Messenger.createVideoFormData(video, options);
      return this.sendMessageFormData(recipient, message, options);
    }

    const message = Messenger.createVideo(video, options);
    return this.sendMessage(recipient, message, options);
  }

  sendFile(
    recipient: UserID | Recipient,
    file: string | FileData | MediaAttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    if (Buffer.isBuffer(file) || file instanceof fs.ReadStream) {
      const message = Messenger.createFileFormData(file, options);
      return this.sendMessageFormData(recipient, message, options);
    }

    const message = Messenger.createFile(file, options);
    return this.sendMessage(recipient, message, options);
  }

  /**
   * Message Templates
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/templates
   */
  sendTemplate(
    recipient: UserID | Recipient,
    payload: TemplateAttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createTemplate(payload, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/button
  sendButtonTemplate(
    recipient: UserID | Recipient,
    text: string,
    buttons: TemplateButton[],
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createButtonTemplate(text, buttons, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
  sendGenericTemplate(
    recipient: UserID | Recipient,
    elements: TemplateElement[],
    options: {
      imageAspectRatio?: 'horizontal' | 'square';
    } & SendOption = {}
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createGenericTemplate(elements, options),
      omit(options, ['imageAspectRatio'])
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt
  sendReceiptTemplate(
    recipient: UserID | Recipient,
    attrs: ReceiptAttributes,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createReceiptTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/media
  sendMediaTemplate(
    recipient: UserID | Recipient,
    elements: MediaElement[],
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createMediaTemplate(elements, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#boarding_pass
  sendAirlineBoardingPassTemplate(
    recipient: UserID | Recipient,
    attrs: AirlineBoardingPassAttributes,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createAirlineBoardingPassTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#check_in
  sendAirlineCheckinTemplate(
    recipient: UserID | Recipient,
    attrs: AirlineCheckinAttributes,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createAirlineCheckinTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#itinerary
  sendAirlineItineraryTemplate(
    recipient: UserID | Recipient,
    attrs: AirlineItineraryAttributes,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createAirlineItineraryTemplate(attrs, options),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#update
  sendAirlineUpdateTemplate(
    recipient: UserID | Recipient,
    attrs: AirlineUpdateAttributes,
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createAirlineUpdateTemplate(attrs, options),
      options
    );
  }

  /**
   * Typing
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
   */
  sendSenderAction(
    idOrRecipient: UserID | Recipient,
    action: SenderAction,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<SendSenderActionResponse> {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;
    return this.sendRawBody({
      recipient,
      senderAction: action,
      accessToken: customAccessToken,
    });
  }

  markSeen(
    recipient: UserID | Recipient,
    options: Record<string, any> = {}
  ): Promise<SendSenderActionResponse> {
    return this.sendSenderAction(recipient, 'mark_seen', options);
  }

  typingOn(
    recipient: UserID | Recipient,
    options: Record<string, any> = {}
  ): Promise<SendSenderActionResponse> {
    return this.sendSenderAction(recipient, 'typing_on', options);
  }

  typingOff(
    recipient: UserID | Recipient,
    options: Record<string, any> = {}
  ): Promise<SendSenderActionResponse> {
    return this.sendSenderAction(recipient, 'typing_off', options);
  }

  /**
   * Send Batch Request
   *
   * https://developers.facebook.com/docs/graph-api/making-multiple-requests
   */
  sendBatch(
    batch: BatchItem[],
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<SendMessageSuccessResponse[]> {
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
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#create_label
   */
  // FIXME: [type] return type
  createLabel(
    name: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#associate_label
   */
  // FIXME: [type] return type
  associateLabel(
    userId: UserID,
    labelId: number,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#associate_label
   */
  // FIXME: [type] return type
  dissociateLabel(
    userId: UserID,
    labelId: number,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
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
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_all_labels
   */
  // FIXME: [type] return type
  getAssociatedLabels(
    userId: UserID,
    options: { accessToken?: string; fields?: string[] } = {}
  ) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/${userId}/custom_labels?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving Label Details
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_label_details
   */
  // FIXME: [type] return type
  getLabelDetails(
    labelId: number,
    options: { accessToken?: string; fields?: string[] } = {}
  ) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/${labelId}?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving a List of All Labels
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_all_labels
   */
  // FIXME: [type] return type
  getLabelList(options: { accessToken?: string; fields?: string[] } = {}) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/me/custom_labels?fields=${fields}&access_token=${options.accessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Deleting a Label
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#delete_label
   */
  // FIXME: [type] return type
  deleteLabel(
    labelId: number,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
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
    attachment: string | FileData,
    options: UploadOption = {}
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

  // FIXME: [type] return type
  uploadAudio(attachment: string | FileData, options?: UploadOption) {
    return this.uploadAttachment('audio', attachment, options);
  }

  // FIXME: [type] return type
  uploadImage(attachment: string | FileData, options?: UploadOption) {
    return this.uploadAttachment('image', attachment, options);
  }

  // FIXME: [type] return type
  uploadVideo(attachment: string | FileData, options?: UploadOption) {
    return this.uploadAttachment('video', attachment, options);
  }

  // FIXME: [type] return type
  uploadFile(attachment: string | FileData, options?: UploadOption) {
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
  // FIXME: [type] return type
  passThreadControl(
    recipientId: string,
    targetAppId: number,
    metadata?: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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

  // FIXME: [type] return type
  passThreadControlToPageInbox(
    recipientId: string,
    metadata?: string,
    options: Record<string, any> = {}
  ) {
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
  // FIXME: [type] return type
  takeThreadControl(
    recipientId: string,
    metadata?: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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
  // FIXME: [type] return type
  requestThreadControl(
    recipientId: string,
    metadata?: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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
  // FIXME: [type] return type
  getSecondaryReceivers({
    accessToken: customAccessToken,
  }: AccessTokenOptions = {}) {
    return this._axios
      .get(
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
  // FIXME: [type] return type
  getThreadOwner(
    recipientId: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    warning(
      false,
      '`getThreadOwner` is currently in open beta, and is subject to change. See details in  https://developers.facebook.com/docs/messenger-platform/handover-protocol/get-thread-owner'
    );

    return this._axios
      .get(
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
  // FIXME: [type] return type
  getInsights(metrics: InsightMetric[], options: InsightOptions = {}) {
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

  // FIXME: [type] return type
  getBlockedConversations(options: Record<string, any> = {}) {
    return this.getInsights(
      ['page_messages_blocked_conversations_unique'],
      options
    ).then(result => result[0]);
  }

  // FIXME: [type] return type
  getReportedConversations(options: Record<string, any> = {}) {
    return this.getInsights(
      ['page_messages_reported_conversations_unique'],
      options
    ).then(result => result[0]);
  }

  // https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api?locale=en_US#metrics
  // This metrics replaces the page_messages_open_conversations_unique metric, which was deprecated on May 11, 2018.
  // FIXME: [type] return type
  getTotalMessagingConnections(options: Record<string, any> = {}) {
    return this.getInsights(
      ['page_messages_total_messaging_connections'],
      options
    ).then(result => result[0]);
  }

  // FIXME: [type] return type
  getNewConversations(options: Record<string, any> = {}) {
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
    config: MessengerNLPConfig = {},
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
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
  enableNLP(options: Record<string, any> = {}) {
    return this.setNLPConfigs({ nlpEnabled: true }, options);
  }

  // FIXME: [type] return type
  disableNLP(options: Record<string, any> = {}) {
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
    pageScopedUserId: UserID;
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
  // FIXME: [type] return type
  createPersona(
    persona: Persona,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
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
  // FIXME: [type] return type
  getPersona(
    personaId: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .get(
        `/${personaId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving All Available Personas
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#retrieve_all
   */
  // FIXME: [type] return type
  getPersonas(
    cursor?: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ): Promise<{
    data: {
      id: string;
      name: string;
      profilePictureUrl: string;
    }[];
    paging: { cursors: { before: string; after: string } };
  }> {
    return this._axios
      .get(
        `/me/personas?access_token=${customAccessToken || this._accessToken}${
          cursor ? `&after=${cursor}` : ''
        }`
      )
      .then(res => res.data, handleError);
  }

  async getAllPersonas({
    accessToken: customAccessToken,
  }: AccessTokenOptions = {}): Promise<Record<string, any>[]> {
    let allPersonas: Record<string, any>[] = [];
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
  // FIXME: [type] return type
  deletePersona(
    personaId: string,
    { accessToken: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
        `/${personaId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }
}
