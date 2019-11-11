import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';
import url from 'url';

import AxiosError from 'axios-error';
import FormData from 'form-data';
import appendQuery from 'append-query';
import axios, { AxiosInstance } from 'axios';
import get from 'lodash.get';
import invariant from 'invariant';
import omit from 'lodash.omit';
import urlJoin from 'url-join';
import warning from 'warning';
import { onRequest } from 'messaging-api-common';

import Messenger from './Messenger';
import {
  AccessTokenOptions,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  AudienceType,
  BatchItem,
  FileData,
  GreetingConfig,
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
  OpenGraphElement,
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
  onRequest?: Function;
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

  _onRequest: Function;

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
      this._onRequest = config.onRequest || onRequest;
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
      this._onRequest = onRequest;

      skipAppSecretProof = true;
    }

    this._axios = axios.create({
      baseURL: `${origin || 'https://graph.facebook.com'}/v${this._version}/`,
      headers: { 'Content-Type': 'application/json' },
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

    this._axios.interceptors.request.use(config => {
      this._onRequest({
        method: config.method,
        url: urlJoin(config.baseURL || '', config.url || '/'),
        headers: {
          ...config.headers.common,
          ...(config.method ? config.headers[config.method] : {}),
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
    access_token: customAccessToken,
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
    access_token: customAccessToken,
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
    app_id,
    object = 'page',
    callback_url,
    fields = [
      'messages',
      'messaging_postbacks',
      'messaging_optins',
      'messaging_referrals',
      'messaging_handovers',
      'messaging_policy_enforcement',
    ],
    include_values,
    verify_token,
    access_token: appAccessToken,
  }: {
    app_id?: string;
    object?: 'user' | 'page' | 'permissions' | 'payments';
    callback_url: string;
    fields?: string[];
    include_values?: boolean;
    verify_token: string;
    access_token: string;
  }): Promise<{ success: boolean }> {
    warning(
      !app_id,
      'Provide App ID in the function is deprecated. Provide it in `MessengerClient.connect({ appId, ... })` instead'
    );

    const appId = app_id || this._appId;

    invariant(appId, 'App ID is required to create subscription');
    invariant(
      this._appSecret || appAccessToken,
      'App Secret or App Token is required to create subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this._appSecret}`;

    return this._axios
      .post(`/${appId}/subscriptions?access_token=${accessToken}`, {
        object,
        callback_url,
        fields: fields.join(','),
        include_values,
        verify_token,
      })
      .then(res => res.data, handleError);
  }

  /**
   * Get Subscriptions
   *
   * https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   */
  getSubscriptions({
    app_id,
    access_token: appAccessToken,
  }: {
    app_id?: string;
    access_token?: string;
  } = {}): Promise<MessengerSubscription[]> {
    warning(
      !app_id,
      'Provide App ID in the function is deprecated. Provide it in `MessengerClient.connect({ appId, ... })` instead'
    );

    const appId = app_id || this._appId;
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
    app_id,
    access_token: appAccessToken,
  }: {
    app_id?: string;
    access_token?: string;
  } = {}): Promise<MessengerSubscription> {
    warning(
      !app_id,
      'Provide App ID in the function is deprecated. Provide it in `MessengerClient.connect({ appId, ... })` instead'
    );

    const appId = app_id || this._appId;
    invariant(appId, 'App ID is required to get subscription');
    invariant(
      this._appSecret || appAccessToken,
      'App Secret or App Token is required to get subscription'
    );

    const accessToken = appAccessToken || `${appId}|${this._appSecret}`;

    return this.getSubscriptions({
      app_id: appId,
      access_token: accessToken,
    }).then(
      subscriptions =>
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
    access_token: customAccessToken,
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
      access_token: customAccessToken,
      fields = ['id', 'name', 'first_name', 'last_name', 'profile_pic'],
    }: { access_token?: string; fields?: string[] } = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
        ? (res[0].get_started as {
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
        get_started: {
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
      res[0] ? (res[0].persistent_menu as PersistentMenu) : null
    );
  }

  setPersistentMenu(
    menuItems: MenuItem[] | PersistentMenu,
    {
      composer_input_disabled: composerInputDisabled = false,
      ...options
    }: {
      composer_input_disabled?: boolean;
      access_token?: string;
    } = {}
  ): Promise<MutationSuccessResponse> {
    // menuItems is in type PersistentMenu
    if (
      menuItems.some((item: Record<string, any>) => item.locale === 'default')
    ) {
      return this.setMessengerProfile(
        {
          persistent_menu: menuItems as PersistentMenu,
        },
        options
      );
    }

    // menuItems is in type MenuItem[]
    return this.setMessengerProfile(
      {
        persistent_menu: [
          {
            locale: 'default',
            composer_input_disabled: composerInputDisabled,
            call_to_actions: menuItems as MenuItem[],
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
    ).then(res => (res[0] ? (res[0].whitelisted_domains as string[]) : null));
  }

  setWhitelistedDomains(
    domains: string[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        whitelisted_domains: domains,
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
    linkingURL: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        account_linking_url: linkingURL,
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
    privacy_url?: string;
    public_key?: string;
    test_users?: string[];
  } | null> {
    return this.getMessengerProfile(['payment_settings'], options).then(res =>
      res[0]
        ? (res[0] as {
            privacy_url?: string;
            public_key?: string;
            test_users?: string[];
          })
        : null
    );
  }

  setPaymentPrivacyPolicyURL(
    privacyURL: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        payment_settings: {
          privacy_url: privacyURL,
        },
      },

      options
    );
  }

  setPaymentPublicKey(
    key: string,
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        payment_settings: {
          public_key: key,
        },
      },

      options
    );
  }

  setPaymentTestUsers(
    users: string[],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        payment_settings: {
          test_users: users,
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
   * Target Audience
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/target-audience
   */
  getTargetAudience(
    options: AccessTokenOptions = {}
  ): Promise<{
    audience_type: AudienceType;
    countries?: {
      whitelist?: string[];
      blacklist?: string[];
    };
  } | null> {
    return this.getMessengerProfile(['target_audience'], options).then(res =>
      res[0]
        ? (res[0] as {
            audience_type: AudienceType;
            countries?: {
              whitelist?: string[];
              blacklist?: string[];
            };
          })
        : null
    );
  }

  setTargetAudience(
    type: AudienceType,
    whitelist: string[] = [],
    blacklist: string[] = [],
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        target_audience: {
          audience_type: type,
          countries: {
            whitelist,
            blacklist,
          },
        },
      },
      options
    );
  }

  deleteTargetAudience(
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.deleteMessengerProfile(['target_audience'], options);
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
    webview_height_ratio: 'tall';
    webview_share_button?: 'hide' | 'show';
    in_test: boolean;
  } | null> {
    return this.getMessengerProfile(['home_url'], options).then(res =>
      res[0]
        ? (res[0] as {
            url: string;
            webview_height_ratio: 'tall';
            webview_share_button?: 'hide' | 'show';
            in_test: boolean;
          })
        : null
    );
  }

  setHomeURL(
    homeURL: string,
    {
      webview_share_button,
      in_test,
    }: {
      webview_share_button?: 'hide' | 'show';
      in_test: boolean;
    },
    options: AccessTokenOptions = {}
  ): Promise<MutationSuccessResponse> {
    return this.setMessengerProfile(
      {
        home_url: {
          url: homeURL,
          webview_height_ratio: 'tall',
          in_test,
          webview_share_button,
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
    access_token: customAccessToken,
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
    const { access_token: customAccessToken } = body;

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

    let messageType = 'UPDATE';

    if (options.messaging_type) {
      messageType = options.messaging_type;
    } else if (options.tag) {
      messageType = 'MESSAGE_TAG';
    }

    return this.sendRawBody({
      messaging_type: messageType,
      recipient,
      message: Messenger.createMessage(message, options),
      ...omit(options, 'quick_replies'),
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

    let messageType = 'UPDATE';
    if (options.messaging_type) {
      messageType = options.messaging_type;
    } else if (options.tag) {
      messageType = 'MESSAGE_TAG';
    }

    formdata.append('messaging_type', messageType);
    formdata.append('recipient', JSON.stringify(recipientObject));

    return this._axios
      .post(
        `/me/messages?access_token=${options.access_token ||
          this._accessToken}`,
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
    {
      image_aspect_ratio = 'horizontal',
      ...options
    }: {
      image_aspect_ratio?: 'horizontal' | 'square';
    } & SendOption = {}
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createGenericTemplate(elements, {
        ...options,
        image_aspect_ratio,
      }),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/list
  sendListTemplate(
    recipient: UserID | Recipient,
    elements: TemplateElement[],
    buttons: TemplateButton[],
    {
      top_element_style = 'large',
      ...options
    }: {
      top_element_style?: 'large' | 'compact';
    } & SendOption = {}
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createListTemplate(elements, buttons, {
        ...options,
        top_element_style,
      }),
      options
    );
  }

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/open-graph
  sendOpenGraphTemplate(
    recipient: UserID | Recipient,
    elements: OpenGraphElement[],
    options?: SendOption
  ): Promise<SendMessageSuccessResponse> {
    return this.sendMessage(
      recipient,
      Messenger.createOpenGraphTemplate(elements, options),
      options
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ): Promise<SendSenderActionResponse> {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;
    return this.sendRawBody({
      recipient,
      sender_action: action,
      access_token: customAccessToken,
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ): Promise<SendMessageSuccessResponse[]> {
    invariant(
      batch.length <= 50,
      'limit the number of requests which can be in a batch to 50'
    );

    const responseAccessPaths = batch.map(item => item.responseAccessPath);

    const bodyEncodedbatch = batch.map(item => {
      if (item.body) {
        const { body } = item;
        return {
          ...omit(item, 'responseAccessPath'),
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
      return omit(item, 'responseAccessPath');
    });

    return this._axios
      .post('/', {
        access_token: customAccessToken || this._accessToken,
        batch: bodyEncodedbatch,
      })
      .then(
        res =>
          res.data.map(
            (datum: { code: number; body: string }, index: number) => {
              const responseAccessPath = responseAccessPaths[index];
              if (responseAccessPath && datum.body) {
                return {
                  ...datum,
                  body: JSON.stringify(
                    get(JSON.parse(datum.body), responseAccessPath)
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
   * Broadcast API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/broadcast-api
   */

  /**
   * Create Message Creative
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages#creative
   */
  // FIXME: [type] return type
  createMessageCreative(
    messages: Record<string, any>[] = [],
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    warning(false, 'createMessageCreative: Broadcast API is deprecated.');

    return this._axios
      .post(
        `/me/message_creatives?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          messages,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Send Broadcast Message
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages#sending
   */
  // FIXME: [type] return type
  sendBroadcastMessage(
    messageCreativeId: number,
    options: Record<string, any> = {}
  ) {
    warning(false, 'sendBroadcastMessage: Broadcast API is deprecated.');

    return this._axios
      .post(
        `/me/broadcast_messages?access_token=${options.access_token ||
          this._accessToken}`,
        {
          message_creative_id: messageCreativeId,
          ...options,
        }
      )
      .then(res => res.data, handleError);
  }

  // FIXME: [type] return type
  cancelBroadcast(broadcastId: number, options: Record<string, any> = {}) {
    warning(false, 'cancelBroadcast: Broadcast API is deprecated.');

    return this._axios
      .post(
        `/${broadcastId}?access_token=${options.access_token ||
          this._accessToken}`,
        {
          operation: 'cancel',
        }
      )
      .then(res => res.data, handleError);
  }

  // FIXME: [type] return type
  getBroadcast(broadcastId: number, options: Record<string, any> = {}) {
    warning(false, 'getBroadcast: Broadcast API is deprecated.');

    return this._axios
      .get(
        `/${broadcastId}?fields=scheduled_time,status&access_token=${options.access_token ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Send Sponsored Message
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages#message
   */
  // FIXME: [type] return type
  sendSponsoredMessage(adAccountId: string, message: Record<string, any>) {
    return this._axios
      .post(
        `/act_${adAccountId}/sponsored_message_ads?access_token=${this._accessToken}`,
        message
      )
      .then(res => res.data, handleError);
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    options: { access_token?: string; fields?: string[] } = {}
  ) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/${userId}/custom_labels?fields=${fields}&access_token=${options.access_token ||
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
    options: { access_token?: string; fields?: string[] } = {}
  ) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/${labelId}?fields=${fields}&access_token=${options.access_token ||
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
  getLabelList(options: { access_token?: string; fields?: string[] } = {}) {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/me/custom_labels?fields=${fields}&access_token=${options.access_token ||
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
        `/${labelId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Starting a Reach Estimation
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach#start
   */
  // FIXME: [type] return type
  startReachEstimation(
    customLabelId: number,
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    warning(false, 'startReachEstimation: Broadcast API is deprecated.');

    return this._axios
      .post(
        `/me/broadcast_reach_estimations?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          custom_label_id: customLabelId,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * Retrieving a Reach Estimate
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach#get
   */
  // FIXME: [type] return type
  getReachEstimate(
    reachEstimationId: number,
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    warning(false, 'getReachEstimate: Broadcast API is deprecated.');

    return this._axios
      .get(
        `/${reachEstimationId}?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Broadcast Metrics
   *
   * Once a broadcast has been delivered, you can find out the total number of people it reached.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/#metrics
   */
  // FIXME: [type] return type
  getBroadcastMessagesSent(
    broadcastId: number,
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    warning(false, 'getBroadcastMessagesSent: Broadcast API is deprecated.');

    return this._axios
      .post(
        `/${broadcastId}/insights/messages_sent?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);
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

    const isReusable = options.is_reusable || false;

    if (typeof attachment === 'string') {
      args.push({
        message: {
          attachment: {
            type,
            payload: {
              url: attachment,
              is_reusable: isReusable,
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
        `/me/message_attachments?access_token=${options.access_token ||
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
   * Messenger Code API
   *
   * https://developers.facebook.com/docs/messenger-platform/discovery/messenger-codes
   */
  // FIXME: [type] return type
  generateMessengerCode(options: Record<string, any> = {}) {
    warning(false, 'generateMessengerCode: Messenger Code is deprecated.');

    return this._axios
      .post(
        `/me/messenger_codes?access_token=${options.access_token ||
          this._accessToken}`,
        {
          type: 'standard',
          ...options,
        }
      )
      .then(res => res.data, handleError);
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(
        `/me/pass_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          target_app_id: targetAppId,
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    access_token: customAccessToken,
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
      .then(res => res.data.data[0].thread_owner, handleError);
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
          access_token: options.access_token || this._accessToken,
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

  // FIXME: [type] return type
  getOpenConversations(options: Record<string, any> = {}) {
    // The metrics used here was replaced by the metrics used in getTotalMessagingConnections()
    warning(
      false,
      'getOpenConversations() was deprecated, please use getTotalMessagingConnections() now.'
    );

    return this.getTotalMessagingConnections(options);
  }

  // FIXME: [type] return type
  getTotalMessagingConnections(options: Record<string, any> = {}) {
    // https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api?locale=en_US#metrics
    // This metrics replaces the page_messages_open_conversations_unique metric, which was deprecated on May 11, 2018.

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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .post(`/me/nlp_configs?${querystring.stringify(config)}`, {
        access_token: customAccessToken || this._accessToken,
      })
      .then(res => res.data, handleError);
  }

  // FIXME: [type] return type
  enableNLP(options: Record<string, any> = {}) {
    return this.setNLPConfigs({ nlp_enabled: true }, options);
  }

  // FIXME: [type] return type
  disableNLP(options: Record<string, any> = {}) {
    return this.setNLPConfigs({ nlp_enabled: false }, options);
  }

  /**
   * Logging Custom Events
   *
   * https://developers.facebook.com/docs/app-events/bots-for-messenger#logging-custom-events
   */
  // FIXME: [type] return type
  logCustomEvents({
    app_id,
    page_id,
    page_scoped_user_id,
    events,
    access_token: customAccessToken,
  }: {
    app_id: number;
    page_id: number;
    page_scoped_user_id: UserID;
    events: Record<string, any>[];
    access_token?: string;
  }) {
    return this._axios
      .post(
        `/${app_id}/activities?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify(events),
          advertiser_tracking_enabled: 0,
          application_tracking_enabled: 0,
          extinfo: JSON.stringify(['mb1']),
          page_id,
          page_scoped_user_id,
        }
      )
      .then(res => res.data, handleError);
  }

  /**
   * https://developers.facebook.com/docs/messenger-platform/identity/id-matching#examples
   */
  // FIXME: [type] return type
  getUserField({
    field,
    user_id,
    app_secret,
    app,
    page,
    access_token: customAccessToken,
  }: {
    field: string;
    user_id: string;
    app_secret: string;
    app?: string;
    page?: string;
    access_token?: string;
  }) {
    const accessToken = customAccessToken || this._accessToken;

    // $appsecret_proof= hash_hmac('sha256', $access_token, $app_secret);
    const appsecretProof = crypto
      .createHmac('sha256', app_secret)
      .update(accessToken)
      .digest('hex');

    const appQueryString = app ? `&app=${app}` : '';
    const pageQueryString = page ? `&page=${page}` : '';

    return this._axios
      .get(
        `/${user_id}/${field}?access_token=${accessToken}&appsecret_proof=${appsecretProof}${appQueryString}${pageQueryString}`
      )
      .then(res => res.data, handleError);
  }

  /**
   * Given a user ID for a bot in Messenger, retrieve the IDs for apps owned by the same business
   */
  // FIXME: [type] return type
  getIdsForApps({
    user_id,
    app_secret,
    app,
    page,
    access_token,
  }: {
    user_id: string;
    app_secret: string;
    app?: string;
    page?: string;
    access_token?: string;
  }) {
    return this.getUserField({
      field: 'ids_for_apps',
      user_id,
      app_secret,
      app,
      page,
      access_token,
    });
  }

  /**
   * Given a user ID for a Page (associated with a bot), retrieve the IDs for other Pages owned by the same business
   */
  // FIXME: [type] return type
  getIdsForPages({
    user_id,
    app_secret,
    app,
    page,
    access_token,
  }: {
    user_id: string;
    app_secret: string;
    app?: string;
    page?: string;
    access_token?: string;
  }) {
    return this.getUserField({
      field: 'ids_for_pages',
      user_id,
      app_secret,
      app,
      page,
      access_token,
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ): Promise<{
    data: {
      id: string;
      name: string;
      profile_picture_url: string;
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
    access_token: customAccessToken,
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
          profile_picture_url: string;
        }[];
        paging: { cursors: { before: string; after: string } };
        // eslint-disable-next-line no-await-in-loop
      } = await this.getPersonas(cursor, {
        access_token: customAccessToken,
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
    { access_token: customAccessToken }: AccessTokenOptions = {}
  ) {
    return this._axios
      .delete(
        `/${personaId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
  }
}
