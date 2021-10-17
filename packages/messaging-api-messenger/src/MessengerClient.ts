import crypto from 'crypto';
import fs from 'fs';
import querystring from 'querystring';
import url from 'url';

import FormData from 'form-data';
import appendQuery from 'append-query';
import axios, { AxiosError, AxiosInstance, AxiosTransformer } from 'axios';
import get from 'lodash/get';
import invariant from 'ts-invariant';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as Messenger from './Messenger';
import * as MessengerTypes from './MessengerTypes';

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

function handleError(
  err: AxiosError<{
    error: {
      code: number;
      type: string;
      message: string;
    };
  }>
): never {
  if (err.response && err.response.data) {
    const error = get(err, 'response.data.error');
    if (error) {
      const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
      throw new PrintableAxiosError(msg, err);
    }
  }
  throw new PrintableAxiosError(err.message, err);
}

export default class MessengerClient {
  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The version of the Facebook Graph API.
   */
  readonly version: string;

  /**
   * The access token used by the client.
   */
  readonly accessToken: string;

  /**
   * The app secret used by the client.
   */
  readonly appSecret?: string;

  /**
   * The app ID used by the client.
   */
  readonly appId?: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  constructor(config: MessengerTypes.ClientConfig) {
    invariant(
      typeof config !== 'string',
      `MessengerClient: do not allow constructing client with ${config} string. Use object instead.`
    );

    this.accessToken = config.accessToken;
    invariant(
      !config.version || typeof config.version === 'string',
      'Type of `version` must be string.'
    );

    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.version = extractVersion(config.version ?? '6.0');
    this.onRequest = config.onRequest;
    const { origin } = config;

    let skipAppSecretProof;
    if (typeof config.skipAppSecretProof === 'boolean') {
      skipAppSecretProof = config.skipAppSecretProof;
    } else {
      skipAppSecretProof = this.appSecret == null;
    }

    this.axios = axios.create({
      baseURL: `${origin ?? 'https://graph.facebook.com'}/v${this.version}/`,
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

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );

    // add appsecret_proof to request
    if (!skipAppSecretProof) {
      invariant(
        this.appSecret,
        'Must provide appSecret when skipAppSecretProof is false'
      );

      const appSecret = this.appSecret as string;

      this.axios.interceptors.request.use((requestConfig) => {
        const isBatch =
          requestConfig.url === '/' && Array.isArray(requestConfig.data.batch);

        if (isBatch) {
          // eslint-disable-next-line no-param-reassign
          requestConfig.data.batch = requestConfig.data.batch.map(
            (item: any) => {
              const urlParts = url.parse(item.relativeUrl, true);
              let accessToken = get(urlParts, 'query.access_token');
              if (!accessToken && item.body) {
                const entries = decodeURIComponent(item.body)
                  .split('&')
                  .map((pair) => pair.split('='));

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
            }
          );
        }

        const urlParts = url.parse(requestConfig.url ?? '', true);
        const accessToken = get(
          urlParts,
          'query.access_token',
          this.accessToken
        );

        const appSecretProof = crypto
          .createHmac('sha256', appSecret)
          .update(accessToken, 'utf8')
          .digest('hex');

        // eslint-disable-next-line no-param-reassign
        requestConfig.url = appendQuery(requestConfig.url ?? '', {
          appsecret_proof: appSecretProof,
        });

        return requestConfig;
      });
    }
  }

  /**
   * Gets page info using Graph API.
   *
   * @returns Page info
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/page/
   *
   * @example
   *
   * ```js
   * await client.getPageInfo();
   * // {
   * //   name: 'Bot Demo',
   * //   id: '1895382890692546',
   * // }
   * ```
   */
  getPageInfo({
    fields,
  }: { fields?: string[] } = {}): Promise<MessengerTypes.PageInfo> {
    return this.axios
      .get('/me', {
        params: {
          access_token: this.accessToken,
          fields: fields ? fields.join(',') : undefined,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets token information.
   *
   * @returns Token information
   *
   * @see https://developers.facebook.com/docs/facebook-login/access-tokens/debugging-and-error-handling
   *
   * @example
   *
   * ```js
   * await client.debugToken();
   * // {
   * //   appId: '000000000000000',
   * //   application: 'Social Cafe',
   * //   expiresAt: 1352419328,
   * //   isValid: true,
   * //   issuedAt: 1347235328,
   * //   scopes: ['email', 'user_location'],
   * //   userId: 1207059,
   * // }
   * ```
   */
  debugToken(): Promise<MessengerTypes.TokenInfo> {
    invariant(this.appId, 'App ID is required to debug token');
    invariant(this.appSecret, 'App Secret is required to debug token');

    const accessToken = `${this.appId}|${this.appSecret}`;

    return this.axios
      .get(`/debug_token`, {
        params: {
          input_token: this.accessToken,
          access_token: accessToken,
        },
      })
      .then((res) => res.data.data, handleError);
  }

  /**
   * Create new Webhooks subscriptions.
   *
   * @param subscription - Subscription parameters.
   * @param subscription.accessToken - App access token.
   * @param subscription.callbackUrl - The URL to receive the POST request when an update is triggered, and a GET request when attempting this publish operation.
   * @param subscription.verifyToken - An arbitrary string that can be used to confirm to your server that the request is valid.
   * @param subscription.fields - One or more of the set of valid fields in this object to subscribe to. Default Fields: `messages`, `messaging_postbacks`, `messaging_optins`, `messaging_referrals`, `messaging_handovers` and `messaging_policy_enforcement`.
   * @param subscription.object - Indicates the object type that this subscription applies to. Defaults to `page`.
   * @param subscription.includeValues - Indicates if change notifications should include the new values.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.createSubscription({
   *   accessToken: APP_ACCESS_TOKEN,
   *   callbackUrl: 'https://mycallback.com',
   *   fields: ['messages', 'messaging_postbacks', 'messaging_referrals'],
   *   verifyToken: VERIFY_TOKEN,
   * });
   *
   * // Or provide app id and app secret instead of app access token:
   * client.createSubscription({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   *   callbackUrl: 'https://mycallback.com',
   *   fields: ['messages', 'messaging_postbacks', 'messaging_referrals'],
   *   verifyToken: VERIFY_TOKEN,
   * });
   * ```
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
    const { appId } = this;

    invariant(appId, 'App ID is required to create subscription');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to create subscription'
    );

    const accessToken = appAccessToken ?? `${appId}|${this.appSecret}`;

    return this.axios
      .post(`/${appId}/subscriptions?access_token=${accessToken}`, {
        object,
        callbackUrl,
        fields: fields.join(','),
        includeValues,
        verifyToken,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the current Webhook subscriptions set up on your app.
   *
   * @param options - The other parameters.
   * @param options.accessToken - App access token.
   * @returns An array of subscriptions.
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.getSubscriptions({
   *   accessToken: APP_ACCESS_TOKEN,
   * });
   * // [{
   * //   object: 'page',
   * //   callbackUrl: 'https://www.example.com/callback'
   * //   fields: ['messages', 'messaging_postbacks', 'messaging_optins'],
   * //   active: true,
   * // }]
   *
   * // Or provide app id and app secret instead of app access token:
   * await client.getSubscriptions({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   * });
   * ```
   */
  getSubscriptions({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<MessengerTypes.MessengerSubscription[]> {
    const { appId } = this;
    invariant(appId, 'App ID is required to get subscriptions');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to get subscriptions'
    );

    const accessToken = appAccessToken ?? `${appId}|${this.appSecret}`;

    return this.axios
      .get(`/${appId}/subscriptions?access_token=${accessToken}`)
      .then((res) => res.data.data, handleError);
  }

  /**
   * Get the current page subscription set up on your app.
   *
   * @param options - The other parameters.
   * @param options.accessToken - App access token.
   * @returns The current page subscription
   *
   * @see https://developers.facebook.com/docs/graph-api/reference/app/subscriptions
   *
   * @example
   *
   * ```js
   * await client.getPageSubscription({
   *   accessToken: APP_ACCESS_TOKEN,
   * });
   *
   * // Or provide app id and app secret instead of app access token:
   * await client.getPageSubscription({
   *   accessToken: `${APP_ID}|${APP_SECRET}`,
   * });
   * ```
   */
  getPageSubscription({
    accessToken: appAccessToken,
  }: {
    accessToken?: string;
  } = {}): Promise<MessengerTypes.MessengerSubscription> {
    const { appId } = this;
    invariant(appId, 'App ID is required to get subscription');
    invariant(
      this.appSecret || appAccessToken,
      'App Secret or App Token is required to get subscription'
    );

    const accessToken = appAccessToken ?? `${appId}|${this.appSecret}`;

    return this.getSubscriptions({
      accessToken,
    }).then(
      (subscriptions: MessengerTypes.MessengerSubscription[]) =>
        subscriptions.filter(
          (subscription) => subscription.object === 'page'
        )[0] ?? null
    );
  }

  /**
   * Programmatically check the feature submission status of page-level platform features
   *
   * @returns An array of all submitted feature submission requests. If no request has been submitted, the array will be empty.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-feature-review-api
   *
   * @example
   *
   * ```js
   * await client.getMessagingFeatureReview();
   * // [{
   * //   "feature": "subscription_messaging",
   * //   "status": "<pending|rejected|approved|limited>"
   * // }]
   */
  getMessagingFeatureReview(): Promise<
    MessengerTypes.MessagingFeatureReview[]
  > {
    return this.axios
      .get<{ data: MessengerTypes.MessagingFeatureReview[] }>(
        `/me/messaging_feature_review?access_token=${this.accessToken}`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Retrieves a person's profile.
   *
   * @param userId - Facebook page-scoped user ID.
   * @param options - Other optional parameters.
   * @param options.fields - Value must be among `id`, `name`, `first_name`, `last_name`, `profile_pic`, `locale`, `timezone` and `gender`, default with `id`, `name`, `first_name`, `last_name` and `profile_pic`.
   * @returns Profile of the user.
   *
   * @see https://www.quora.com/How-connect-Facebook-user-id-to-sender-id-in-the-Facebook-messenger-platform
   *
   * @example
   *
   * ```js
   * await client.getUserProfile(USER_ID);
   * // {
   * //   id: '5566'
   * //   firstName: 'Johnathan',
   * //   lastName: 'Jackson',
   * //   profilePic: 'https://example.com/pic.png',
   * // }
   * ```
   */
  getUserProfile(
    userId: string,
    {
      fields = ['id', 'name', 'first_name', 'last_name', 'profile_pic'],
    }: { fields?: MessengerTypes.UserProfileField[] } = {}
  ): Promise<MessengerTypes.User> {
    return this.axios
      .get<MessengerTypes.User>(
        `/${userId}?fields=${fields.join(',')}&access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the current value of one or more Messenger Profile properties by name.
   *
   * @param fields - An array of Messenger profile properties to retrieve. Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `ice_breakers` and `whitelisted_domains`.
   * @returns The current value of the requested properties
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
   *
   * @example
   *
   * ```js
   * await client.getMessengerProfile(['get_started', 'persistent_menu']);
   * // [
   * //   {
   * //     getStarted: {
   * //       payload: 'GET_STARTED',
   * //     },
   * //   },
   * //   {
   * //     persistentMenu: [
   * //       {
   * //         locale: 'default',
   * //         composerInputDisabled: true,
   * //         callToActions: [
   * //           {
   * //             type: 'postback',
   * //             title: 'Restart Conversation',
   * //             payload: 'RESTART',
   * //           },
   * //         ],
   * //       },
   * //     ],
   * //   },
   * // ]
   * ```
   */
  getMessengerProfile(
    fields: string[]
  ): Promise<MessengerTypes.MessengerProfile[]> {
    return this.axios
      .get<{ data: MessengerTypes.MessengerProfile[] }>(
        `/me/messenger_profile?fields=${fields.join(',')}&access_token=${
          this.accessToken
        }`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Sets the values of one or more Messenger Profile properties. Only properties set in the request body will be overwritten.
   *
   * @param profile - [Profile](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#profile_properties) object.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#post
   *
   * @example
   *
   * ```js
   * await client.setMessengerProfile({
   *   getStarted: {
   *     payload: 'GET_STARTED',
   *   },
   *   persistentMenu: [
   *     {
   *       locale: 'default',
   *       composerInputDisabled: true,
   *       callToActions: [
   *         {
   *           type: 'postback',
   *           title: 'Restart Conversation',
   *           payload: 'RESTART',
   *         },
   *       ],
   *     },
   *   ],
   * });
   * ```
   */
  setMessengerProfile(
    profile: MessengerTypes.MessengerProfile
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.axios
      .post<MessengerTypes.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${this.accessToken}`,
        profile
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes one or more Messenger Profile properties. Only properties specified in the fields array will be deleted.
   *
   * @param fields - An array of Messenger profile properties to delete. Value must be among `account_linking_url`, `persistent_menu`, `get_started`, `greeting`, `ice_breakers` and `whitelisted_domains`.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api#delete
   *
   * @example
   *
   * ```js
   * await client.deleteMessengerProfile(['get_started', 'persistent_menu']);
   * ```
   */
  deleteMessengerProfile(
    fields: string[]
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.axios
      .delete<MessengerTypes.MutationSuccessResponse>(
        `/me/messenger_profile?access_token=${this.accessToken}`,
        {
          data: {
            fields,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the current value of get started button.
   *
   * @returns Config of get started button
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button
   *
   * @example
   *
   * ```js
   * await client.getGetStarted();
   * // {
   * //   payload: 'GET_STARTED',
   * // }
   * ```
   */
  getGetStarted(): Promise<{
    payload: string;
  } | null> {
    return this.getMessengerProfile(['get_started']).then((res) =>
      res[0]
        ? (res[0].getStarted as {
            payload: string;
          })
        : null
    );
  }

  /**
   * Sets the values of get started button.
   *
   * @param payload - Payload sent back to your webhook in a `messaging_postbacks` event when the 'Get Started' button is tapped.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button
   *
   * @example
   *    *
   * ```js
   * await client.setGetStarted('GET_STARTED');
   * ```
   */
  setGetStarted(
    payload: string
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.setMessengerProfile({
      getStarted: {
        payload,
      },
    });
  }

  /**
   * Deletes get started button.
   *
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button
   *
   * @example
   *
   * ```js
   * await client.deleteGetStarted();
   * ```
   */
  deleteGetStarted(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['get_started']);
  }

  /**
   * Retrieves the current value of persistent menu.
   *
   * @returns Array of persistent menus.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   *
   * @example
   *
   * ```js
   * await client.getPersistentMenu();
   * // [
   * //   {
   * //     locale: 'default',
   * //     composerInputDisabled: true,
   * //     callToActions: [
   * //       {
   * //         type: 'postback',
   * //         title: 'Restart Conversation',
   * //         payload: 'RESTART',
   * //       },
   * //       {
   * //         type: 'web_url',
   * //         title: 'Powered by ALOHA.AI, Yoctol',
   * //         url: 'https://www.yoctol.com/',
   * //       },
   * //     ],
   * //   },
   * // ]
   * ```
   */
  getPersistentMenu(): Promise<MessengerTypes.PersistentMenu | null> {
    return this.getMessengerProfile(['persistent_menu']).then((res) =>
      res[0] ? (res[0].persistentMenu as MessengerTypes.PersistentMenu) : null
    );
  }

  /**
   * Sets the values of persistent menu.
   *
   * @param menu - Array of [menu](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu#properties).
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   *
   * @example
   *
   * ```js
   * await client.setPersistentMenu([
   *   {
   *     locale: 'default',
   *     callToActions: [
   *       {
   *         title: 'Play Again',
   *         type: 'postback',
   *         payload: 'RESTART',
   *       },
   *       {
   *         title: 'Explore',
   *         type: 'web_url',
   *         url: 'https://www.youtube.com/watch?v=v',
   *         webviewHeightRatio: 'tall',
   *       },
   *       {
   *         title: 'Powered by YOCTOL',
   *         type: 'web_url',
   *         url: 'https://www.yoctol.com/',
   *         webviewHeightRatio: 'tall',
   *       },
   *     ],
   *   },
   * ]);
   * ```
   *
   * @note You must set a get started button to use the persistent menu.
   */
  setPersistentMenu(
    menuItems: MessengerTypes.MenuItem[] | MessengerTypes.PersistentMenuItem[],
    {
      composerInputDisabled = false,
    }: {
      composerInputDisabled?: boolean;
    } = {}
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    // locale is in type PersistentMenuItem
    if (
      menuItems.some(
        (item: MessengerTypes.MenuItem | MessengerTypes.PersistentMenuItem) =>
          'locale' in item && item.locale === 'default'
      )
    ) {
      return this.setMessengerProfile({
        persistentMenu: menuItems as MessengerTypes.PersistentMenu,
      });
    }

    // menuItems is in type MenuItem[]
    return this.setMessengerProfile({
      persistentMenu: [
        {
          locale: 'default',
          composerInputDisabled,
          callToActions: menuItems as MessengerTypes.MenuItem[],
        },
      ],
    });
  }

  /**
   * Deletes persistent menu.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   *
   * @example
   *
   * ```js
   * await client.deletePersistentMenu();
   * ```
   */
  deletePersistentMenu(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['persistent_menu']);
  }

  /**
   * User Level Persistent Menu
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/persistent-menu#user_level_menu
   *
   * @example
   *
   * ```js
   * ```
   */
  getUserPersistentMenu(
    userId: string
  ): Promise<MessengerTypes.PersistentMenu | null> {
    return this.axios
      .get(
        `/me/custom_user_settings?psid=${userId}&access_token=${this.accessToken}`
      )
      .then(
        (res) =>
          res.data.data[0]
            ? (res.data.data[0]
                .userLevelPersistentMenu as MessengerTypes.PersistentMenu)
            : null,
        handleError
      );
  }

  /**
   *
   * @example
   *
   * ```js
   * ```
   */
  setUserPersistentMenu(
    userId: string,
    menuItems: MessengerTypes.MenuItem[] | MessengerTypes.PersistentMenuItem[],
    {
      composerInputDisabled = false,
    }: {
      composerInputDisabled?: boolean;
    } = {}
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    // locale is in type PersistentMenuItem
    if (
      menuItems.some(
        (item: MessengerTypes.MenuItem | MessengerTypes.PersistentMenuItem) =>
          'locale' in item && item.locale === 'default'
      )
    ) {
      return this.axios
        .post<MessengerTypes.MutationSuccessResponse>(
          `/me/custom_user_settings?access_token=${this.accessToken}`,
          {
            psid: userId,
            persistentMenu: menuItems as MessengerTypes.PersistentMenu,
          }
        )
        .then((res) => res.data, handleError);
    }

    // menuItems is in type MenuItem[]
    return this.axios
      .post(`/me/custom_user_settings?access_token=${this.accessToken}`, {
        psid: userId,
        persistentMenu: [
          {
            locale: 'default',
            composerInputDisabled,
            callToActions: menuItems as MessengerTypes.MenuItem[],
          },
        ],
      })
      .then((res) => res.data, handleError);
  }

  /**
   *
   * @example
   *
   * ```js
   * ```
   */
  deleteUserPersistentMenu(
    userId: string
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.axios
      .delete(
        `/me/custom_user_settings?psid=${userId}&params=[%22persistent_menu%22]&access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the current value of greeting text.
   *
   * @returns Array of greeting configs
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   *
   * @example
   *
   * ```js
   * await client.getGreeting();
   * // [
   * //   {
   * //     locale: 'default',
   * //     text: 'Hello!',
   * //   },
   * // ]
   * ```
   */
  getGreeting(): Promise<MessengerTypes.GreetingConfig[] | null> {
    return this.getMessengerProfile(['greeting']).then((res) =>
      res[0] ? (res[0].greeting as MessengerTypes.GreetingConfig[]) : null
    );
  }

  /**
   * Sets the values of greeting text.
   *
   * @param greeting - Array of [greeting](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting#properties).
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   *
   * @example
   *
   * ```js
   * await client.setGreeting([
   *   {
   *     locale: 'default',
   *     text: 'Hello!',
   *   },
   * ]);
   * ```
   */
  setGreeting(
    greeting: string | MessengerTypes.GreetingConfig[]
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    if (typeof greeting === 'string') {
      return this.setMessengerProfile({
        greeting: [
          {
            locale: 'default',
            text: greeting,
          },
        ],
      });
    }

    return this.setMessengerProfile({
      greeting,
    });
  }

  /**
   * Deletes greeting text.
   *
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   *
   * @example
   *
   * ```js
   * await client.deleteGreeting();
   * ```
   */
  deleteGreeting(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['greeting']);
  }

  /**
   * Retrieves the current value of ice breakers.
   *
   * @returns Array of ice breakers.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/ice-breakers
   *
   * @example
   *
   * ```js
   * await client.getIceBreakers()
   * // [
   * //   {
   * //     "question": "<QUESTION>",
   * //     "payload": "<PAYLOAD>",
   * //   },
   * //   {
   * //     "question": "<QUESTION>",
   * //     "payload": "<PAYLOAD>",
   * //   }
   * // ]
   * ```
   */
  getIceBreakers(): Promise<MessengerTypes.IceBreaker[] | null> {
    return this.getMessengerProfile(['ice_breakers']).then((res) =>
      res[0] ? (res[0].iceBreakers as MessengerTypes.IceBreaker[]) : null
    );
  }

  /**
   * Sets the values of ice breakers.
   *
   * @param iceBreakers - Array of ice breakers.
   * @returns Success status
   *
   * @example
   *
   * ```js
   * await client.setIceBreakers([
   *   {
   *     question: '<QUESTION>',
   *     payload: '<PAYLOAD>',
   *   },
   *   {
   *     question: '<QUESTION>',
   *     payload: '<PAYLOAD>',
   *   }
   * ]);
   * ```
   */
  setIceBreakers(
    iceBreakers: MessengerTypes.IceBreaker[]
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.setMessengerProfile({
      iceBreakers,
    });
  }

  /**
   * Deletes ice breakers.
   *
   * @returns Success status
   *
   * @example
   *
   * ```js
   * await client.deleteIceBreakers();
   * ```
   */
  deleteIceBreakers(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['ice_breakers']);
  }

  /**
   * Retrieves the current value of whitelisted domains.
   *
   * @returns Array of whitelisted domains.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   *
   * @example
   *
   * ```js
   * await client.getWhitelistedDomains();
   * // ['http://www.example.com/']
   * ```
   */
  getWhitelistedDomains(): Promise<string[] | null> {
    return this.getMessengerProfile(['whitelisted_domains']).then((res) =>
      res[0] ? (res[0].whitelistedDomains as string[]) : null
    );
  }

  /**
   * Sets the values of whitelisted domains.
   *
   * @param whitelistedDomains - Array of [whitelisted_domain](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting#properties).
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   *
   * @example
   *
   * ```js
   * await client.setWhitelistedDomains(['www.example.com']);
   * ```
   */
  setWhitelistedDomains(
    whitelistedDomains: string[]
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.setMessengerProfile({
      whitelistedDomains,
    });
  }

  /**
   * Deletes whitelisted domains.
   *
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   *
   * @example
   *
   * ```js
   * await client.deleteWhitelistedDomains();
   * ```
   */
  deleteWhitelistedDomains(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['whitelisted_domains']);
  }

  /**
   * Retrieves the current value of account linking URL.
   *
   * @returns Account linking URL
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   *
   * @example
   *
   * ```js
   * await client.getAccountLinkingURL();
   * // 'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
   * ```
   */
  getAccountLinkingURL(): Promise<string | null> {
    return this.getMessengerProfile(['account_linking_url']).then((res) =>
      res[0] ? (res[0].accountLinkingUrl as string) : null
    );
  }

  /**
   * Sets the values of account linking URL.
   *
   * @param url - Account linking URL.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   *
   * @example
   *
   * ```js
   * await client.setAccountLinkingURL(
   *   'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
   * );
   * ```
   */
  setAccountLinkingURL(
    accountLinkingUrl: string
  ): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.setMessengerProfile({
      accountLinkingUrl,
    });
  }

  /**
   * Deletes account linking URL.
   *
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   *
   * @example
   *
   * ```js
   * await client.deleteAccountLinkingURL();
   * ```
   */
  deleteAccountLinkingURL(): Promise<MessengerTypes.MutationSuccessResponse> {
    return this.deleteMessengerProfile(['account_linking_url']);
  }

  /**
   * Sends request raw body using the Send API.
   *
   * @param body - The raw body to be sent.
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/send-api#request
   *
   * @example
   *
   * ```js
   * await client.sendRawBody({
   *   recipient: {
   *     id: USER_ID,
   *   },
   *   message: {
   *     text: 'Hello!',
   *   },
   * });
   * // {
   * //   recipientId: '1254477777772919',
   * //   messageId: 'AG5Hz2Uq7tuwNEhXfYYKj8mJEM_QPpz5jdCK48PnKAjSdjfipqxqMvK8ma6AC8fplwlqLP_5cgXIbu7I3rBN0P'
   * // }
   * ```
   */
  sendRawBody(
    body: Record<string, any>
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.axios
      .post<MessengerTypes.SendMessageSuccessResponse>(
        `/me/messages?access_token=${this.accessToken}`,
        body
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sends messages to the specified user using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param message - A [message](https://developers.facebook.com/docs/messenger-platform/reference/send-api#message) object.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @example
   *
   * ```js
   * await client.sendMessage(USER_ID, {
   *   text: 'Hello!',
   * });
   * ```
   *
   * You can specify [messaging type](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) using options. If `messagingType` and `tag` is not provided, `UPDATE` will be used as default messaging type.
   *
   * ```js
   * await client.sendMessage(
   *   USER_ID,
   *   { text: 'Hello!' },
   *   { messagingType: 'RESPONSE' }
   * );
   * ```
   *
   * Available messaging types:
   * - `UPDATE` as default
   * - `RESPONSE` using `{ messagingType: 'RESPONSE' }` options
   * - `MESSAGE_TAG` using `{ tag: 'ANY_TAG' }` options
   */
  sendMessage(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    message: MessengerTypes.Message,
    options: MessengerTypes.SendOption = {}
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
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

  /**
   * Sends messages to the specified user using the Send API with form-data format.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param formdata - A FromData object
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @example
   */
  sendMessageFormData(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    formdata: FormData,
    options: MessengerTypes.SendOption = {}
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
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

    return this.axios
      .post<MessengerTypes.SendMessageSuccessResponse>(
        `/me/messages?access_token=${this.accessToken}`,
        formdata,
        {
          headers: formdata.getHeaders(),
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sends attachment messages to the specified user using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param attachment - The attachment of media or template to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#sending_attachments
   *
   * @example
   *
   * ```js
   * await client.sendAttachment(USER_ID, {
   *   type: 'image',
   *   payload: {
   *     url: 'https://example.com/pic.png',
   *   },
   * });
   * ```
   */
  sendAttachment(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attachment: MessengerTypes.Attachment,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAttachment(attachment, options),
      options
    );
  }

  /**
   * Sends plain text messages to the specified user using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param text - The text to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#sending_text
   *
   * @example
   *
   * ```js
   * await client.sendText(USER_ID, 'Hello!', { tag: 'CONFIRMED_EVENT_UPDATE' });
   * ```
   */
  sendText(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    text: string,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createText(text, options),
      options
    );
  }

  /**
   * Sends sounds to the specified user by uploading them or sharing a URL using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param audio - The audio to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @param options.filename - Required when upload from a buffer.
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#types
   *
   * @example
   *
   * ```js
   * // Send audio using url string:
   * await client.sendAudio(USER_ID, 'https://example.com/audio.mp3');
   *
   * // Use `AttachmentPayload` to send cached attachment:
   * await client.sendAudio(USER_ID, { attachmentId: '55688' });
   *
   * // Use `ReadStream` created from the local file:
   * const fs = require('fs');
   * await client.sendAudio(USER_ID, fs.createReadStream('audio.mp3'));
   *
   * // Use `Buffer` to send attachment:
   * await client.sendAudio(USER_ID, buffer, { filename: 'audio.mp3' });
   * ```
   */
  sendAudio(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    audio:
      | string
      | MessengerTypes.FileData
      | MessengerTypes.MediaAttachmentPayload,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(audio) || audio instanceof fs.ReadStream) {
      const message = Messenger.createAudioFormData(audio, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createAudio(audio, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  /**
   * Sends images to the specified user by uploading them or sharing a URL using the Send API. Supported formats are jpg, png and gif.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param image - The image to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @param options.filename - Required when upload from a buffer.
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#types
   *
   * @example
   *
   * ```js
   * // Send image using url string:
   * await client.sendImage(USER_ID, 'https://example.com/image.jpg');
   *
   * // Use `AttachmentPayload` to send cached attachment:
   * await client.sendImage(USER_ID, { attachmentId: '55688' });
   *
   * // Use `ReadStream` created from the local file:
   * const fs = require('fs');
   * await client.sendImage(USER_ID, fs.createReadStream('image.jpg'));
   *
   * // Use `Buffer` to send attachment:
   * await client.sendImage(USER_ID, buffer, { filename: 'image.jpg' });
   * ```
   */
  sendImage(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    image:
      | string
      | MessengerTypes.FileData
      | MessengerTypes.MediaAttachmentPayload,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(image) || image instanceof fs.ReadStream) {
      const message = Messenger.createImageFormData(image, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createImage(image, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  /**
   * Sends videos to the specified user by uploading them or sharing a URL using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param video - The video to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @param options.filename - Required when upload from a buffer.
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#types
   *
   * @example
   *
   * ```js
   * // Send video using url string:
   * await client.sendVideo(USER_ID, 'https://example.com/video.mp4');
   *
   * // Use `AttachmentPayload` to send cached attachment:
   * await client.sendVideo(USER_ID, { attachmentId: '55688' });
   *
   * // Use `ReadStream` created from the local file:
   * const fs = require('fs');
   * await client.sendVideo(USER_ID, fs.createReadStream('video.mp4'));
   *
   * // Use `Buffer` to send attachment:
   * await client.sendVideo(USER_ID, buffer, { filename: 'video.mp4' });
   * ```
   */
  sendVideo(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    video:
      | string
      | MessengerTypes.FileData
      | MessengerTypes.MediaAttachmentPayload,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(video) || video instanceof fs.ReadStream) {
      const message = Messenger.createVideoFormData(video, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createVideo(video, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  /**
   * Sends files to the specified user by uploading them or sharing a URL using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param file - The file to be sent.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @param options.filename - Required when upload from a buffer.
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages#types
   *
   * @example
   *
   * ```js
   * // Send file using url string:
   * await client.sendFile(USER_ID, 'https://example.com/file.pdf');
   *
   * // Use `AttachmentPayload` to send cached attachment:
   * await client.sendFile(USER_ID, { attachmentId: '55688' });
   *
   * // Use `ReadStream` created from the local file:
   * const fs = require('fs');
   * await client.sendFile(USER_ID, fs.createReadStream('file.pdf'));
   *
   * // Use `Buffer` to send attachment:
   * await client.sendFile(USER_ID, buffer, { filename: 'file.pdf' });
   * ```
   */
  sendFile(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    file:
      | string
      | MessengerTypes.FileData
      | MessengerTypes.MediaAttachmentPayload,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    if (Buffer.isBuffer(file) || file instanceof fs.ReadStream) {
      const message = Messenger.createFileFormData(file, options);
      return this.sendMessageFormData(psidOrRecipient, message, options);
    }

    const message = Messenger.createFile(file, options);
    return this.sendMessage(psidOrRecipient, message, options);
  }

  /**
   * Sends structured template messages to the specified user using the Send API.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param payload - The template object.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/templates
   *
   * @example
   *
   * ```js
   * await client.sendTemplate(USER_ID, {
   *   templateType: 'button',
   *   text: 'title',
   *   buttons: [
   *     {
   *       type: 'postback',
   *       title: 'Start Chatting',
   *       payload: 'USER_DEFINED_PAYLOAD',
   *     },
   *   ],
   * });
   * ```
   */
  sendTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    payload: MessengerTypes.TemplateAttachmentPayload,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createTemplate(payload, options),
      options
    );
  }

  /**
   * Sends button template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37410664-0b80b080-27dc-11e8-8854-4408d6f32fdf.png" alt="sendButtonTemplate" width="250" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param title - Text that appears above the buttons.
   * @param buttons - Array of [button](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button#button). Set of 1-3 buttons that appear as call-to-actions.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/button
   *
   * @example
   *
   * ```js
   * await client.sendButtonTemplate(USER_ID, 'What do you want to do next?', [
   *   {
   *     type: 'web_url',
   *     url: 'https://petersapparel.parseapp.com',
   *     title: 'Show Website',
   *   },
   *   {
   *     type: 'postback',
   *     title: 'Start Chatting',
   *     payload: 'USER_DEFINED_PAYLOAD',
   *   },
   * ]);
   * ```
   */
  sendButtonTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    text: string,
    buttons: MessengerTypes.TemplateButton[],
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createButtonTemplate(text, buttons, options),
      options
    );
  }

  /**
   * Sends generic template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37410502-bf948426-27db-11e8-8c9d-7fd6158d0cc2.png" alt="sendGenericTemplate" width="750" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param elements - Array of [element](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#element). Data for each bubble in message.
   * @param options - Other optional parameters, such as `image_aspect_ratio`, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) and [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
   *
   * @example
   *
   * ```js
   * await client.sendGenericTemplate(
   *   USER_ID,
   *   [
   *     {
   *       title: "Welcome to Peter's Hats",
   *       imageUrl: 'https://petersfancybrownhats.com/company_image.png',
   *       subtitle: "We've got the right hat for everyone.",
   *       defaultAction: {
   *         type: 'web_url',
   *         url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
   *         messengerExtensions: true,
   *         webviewHeightRatio: 'tall',
   *         fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
   *       },
   *       buttons: [
   *         {
   *           type: 'postback',
   *           title: 'Start Chatting',
   *           payload: 'DEVELOPER_DEFINED_PAYLOAD',
   *         },
   *       ],
   *     },
   *   ],
   *   { imageAspectRatio: 'square' }
   * );
   * ```
   */
  sendGenericTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    elements: MessengerTypes.TemplateElement[],
    options: {
      imageAspectRatio?: 'horizontal' | 'square';
    } & MessengerTypes.SendOption = {}
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createGenericTemplate(elements, options),
      omit(options, ['imageAspectRatio'])
    );
  }

  /**
   * Sends receipt template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37410909-8b72001e-27dc-11e8-94ae-555cb4ae93c9.png" alt="sendReceiptTemplate" width="250" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param receipt - [payload](https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt#payload) of receipt template.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt
   *
   * @example
   *
   * ```js
   * await client.sendReceiptTemplate(USER_ID, {
   *   recipientName: 'Stephane Crozatier',
   *   orderNumber: '12345678902',
   *   currency: 'USD',
   *   paymentMethod: 'Visa 2345',
   *   orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
   *   timestamp: '1428444852',
   *   elements: [
   *     {
   *       title: 'Classic White T-Shirt',
   *       subtitle: '100% Soft and Luxurious Cotton',
   *       quantity: 2,
   *       price: 50,
   *       currency: 'USD',
   *       imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
   *     },
   *     {
   *       title: 'Classic Gray T-Shirt',
   *       subtitle: '100% Soft and Luxurious Cotton',
   *       quantity: 1,
   *       price: 25,
   *       currency: 'USD',
   *       imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
   *     },
   *   ],
   *   address: {
   *     street1: '1 Hacker Way',
   *     street2: '',
   *     city: 'Menlo Park',
   *     postalCode: '94025',
   *     state: 'CA',
   *     country: 'US',
   *   },
   *   summary: {
   *     subtotal: 75.0,
   *     shippingCost: 4.95,
   *     totalTax: 6.19,
   *     totalCost: 56.14,
   *   },
   *   adjustments: [
   *     {
   *       name: 'New Customer Discount',
   *       amount: 20,
   *     },
   *     {
   *       name: '$10 Off Coupon',
   *       amount: 10,
   *     },
   *   ],
   * });
   * ```
   */
  sendReceiptTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    receipt: MessengerTypes.ReceiptAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createReceiptTemplate(receipt, options),
      options
    );
  }

  /**
   * Sends media template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37410836-64249ada-27dc-11e8-8dc4-5a155916961a.png" alt="sendMediaTemplate" width="250" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param elements - Array of [element](https://developers.facebook.com/docs/messenger-platform/reference/template/media#payload). Only one element is allowed.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/media
   *
   * @example
   *
   * ```js
   * await client.sendMediaTemplate(USER_ID, [
   *   {
   *     mediaType: 'image',
   *     attachmentId: '1854626884821032',
   *     buttons: [
   *       {
   *         type: 'web_url',
   *         url: 'https://en.wikipedia.org/wiki/Rickrolling',
   *         title: 'View Website',
   *       },
   *     ],
   *   },
   * ]);
   * ```
   */
  sendMediaTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    elements: MessengerTypes.MediaElement[],
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createMediaTemplate(elements, options),
      options
    );
  }

  /**
   * Sends airline boarding pass template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37410966-a5fb1542-27dc-11e8-9d23-e3a090b0cdeb.png" alt="sendAirlineBoardingPassTemplate" width="600" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param attrs - [payload](https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline-boarding-pass#payload) of boarding pass template.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#boarding_pass
   *
   * @example
   *
   * ```js
   * await client.sendAirlineBoardingPassTemplate(RECIPIENT_ID, {
   *   introMessage: 'You are checked in.',
   *   locale: 'en_US',
   *   boardingPass: [
   *     {
   *       passengerName: 'SMITH/NICOLAS',
   *       pnrNumber: 'CG4X7U',
   *       travelClass: 'business',
   *       seat: '74J',
   *       auxiliaryFields: [
   *         {
   *           label: 'Terminal',
   *           value: 'T1',
   *         },
   *         {
   *           label: 'Departure',
   *           value: '30OCT 19:05',
   *         },
   *       ],
   *       secondaryFields: [
   *         {
   *           label: 'Boarding',
   *           value: '18:30',
   *         },
   *         {
   *           label: 'Gate',
   *           value: 'D57',
   *         },
   *         {
   *           label: 'Seat',
   *           value: '74J',
   *         },
   *         {
   *           label: 'Sec.Nr.',
   *           value: '003',
   *         },
   *       ],
   *       logoImageUrl: 'https://www.example.com/en/logo.png',
   *       headerImageUrl: 'https://www.example.com/en/fb/header.png',
   *       qrCode: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
   *       aboveBarCodeImageUrl: 'https://www.example.com/en/PLAT.png',
   *       flightInfo: {
   *         flightNumber: 'KL0642',
   *         departureAirport: {
   *           airportCode: 'JFK',
   *           city: 'New York',
   *           terminal: 'T1',
   *           gate: 'D57',
   *         },
   *         arrivalAirport: {
   *           airportCode: 'AMS',
   *           city: 'Amsterdam',
   *         },
   *         flightSchedule: {
   *           departureTime: '2016-01-02T19:05',
   *           arrivalTime: '2016-01-05T17:30',
   *         },
   *       },
   *     },
   *   ],
   * });
   * ```
   */
  sendAirlineBoardingPassTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attrs: MessengerTypes.AirlineBoardingPassAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineBoardingPassTemplate(attrs, options),
      options
    );
  }

  /**
   * Send airline check-in template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37411010-bfb3d8a2-27dc-11e8-91de-30653cf2d62c.png" alt="sendAirlineCheckinTemplate" width="250" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param attrs - [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template#payload) of check-in template.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#check_in
   *
   * @example
   *
   * ```js
   * await client.sendAirlineCheckinTemplate(USER_ID, {
   *   introMessage: 'Check-in is available now.',
   *   locale: 'en_US',
   *   pnrNumber: 'ABCDEF',
   *   flightInfo: [
   *     {
   *       flightNumber: 'f001',
   *       departureAirport: {
   *         airportCode: 'SFO',
   *         city: 'San Francisco',
   *         terminal: 'T4',
   *         gate: 'G8',
   *       },
   *       arrivalAirport: {
   *         airportCode: 'SEA',
   *         city: 'Seattle',
   *         terminal: 'T4',
   *         gate: 'G8',
   *       },
   *       flightSchedule: {
   *         boardingTime: '2016-01-05T15:05',
   *         departureTime: '2016-01-05T15:45',
   *         arrivalTime: '2016-01-05T17:30',
   *       },
   *     },
   *   ],
   *   checkinUrl: 'https://www.airline.com/check-in',
   * });
   * ```
   *
   */
  sendAirlineCheckinTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attrs: MessengerTypes.AirlineCheckinAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineCheckinTemplate(attrs, options),
      options
    );
  }

  /**
   * Send airline itinerary template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37411025-ce27545e-27dc-11e8-91be-28ab27644db7.png" alt="sendAirlineItineraryTemplate" width="600" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param attrs - [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template#payload) of itinerary template.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#itinerary
   *
   * @example
   *
   * ```js
   * await client.sendAirlineItineraryTemplate(USER_ID, {
   *   introMessage: "Here's your flight itinerary.",
   *   locale: 'en_US',
   *   pnrNumber: 'ABCDEF',
   *   passengerInfo: [
   *     {
   *       name: 'Farbound Smith Jr',
   *       ticketNumber: '0741234567890',
   *       passengerId: 'p001',
   *     },
   *     {
   *       name: 'Nick Jones',
   *       ticketNumber: '0741234567891',
   *       passengerId: 'p002',
   *     },
   *   ],
   *   flightInfo: [
   *     {
   *       connectionId: 'c001',
   *       segmentId: 's001',
   *       flightNumber: 'KL9123',
   *       aircraftType: 'Boeing 737',
   *       departureAirport: {
   *         airportCode: 'SFO',
   *         city: 'San Francisco',
   *         terminal: 'T4',
   *         gate: 'G8',
   *       },
   *       arrivalAirport: {
   *         airportCode: 'SLC',
   *         city: 'Salt Lake City',
   *         terminal: 'T4',
   *         gate: 'G8',
   *       },
   *       flightSchedule: {
   *         departureTime: '2016-01-02T19:45',
   *         arrivalTime: '2016-01-02T21:20',
   *       },
   *       travelClass: 'business',
   *     },
   *   ],
   *   passengerSegmentInfo: [
   *     {
   *       segmentId: 's001',
   *       passengerId: 'p001',
   *       seat: '12A',
   *       seatType: 'Business',
   *     },
   *     {
   *       segmentId: 's001',
   *       passengerId: 'p002',
   *       seat: '12B',
   *       seatType: 'Business',
   *     },
   *   ],
   *   priceInfo: [
   *     {
   *       title: 'Fuel surcharge',
   *       amount: '1597',
   *       currency: 'USD',
   *     },
   *   ],
   *   basePrice: '12206',
   *   tax: '200',
   *   totalPrice: '14003',
   *   currency: 'USD',
   * });
   * ```
   */
  sendAirlineItineraryTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attrs: MessengerTypes.AirlineItineraryAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineItineraryTemplate(attrs, options),
      options
    );
  }

  /**
   * Sends airline flight update template messages to the specified user using the Send API.
   *
   * <img src="https://user-images.githubusercontent.com/3382565/37411064-e3005a56-27dc-11e8-8486-4fc548ad7b1a.png" alt="sendAirlineUpdateTemplate" width="250" />
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param attrs - [payload](https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template#payload) of update template.
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#update
   *
   * @example
   *
   * ```js
   * await client.sendAirlineUpdateTemplate(USER_ID, {
   *   introMessage: 'Your flight is delayed',
   *   updateType: 'delay',
   *   locale: 'en_US',
   *   pnrNumber: 'CF23G2',
   *   updateFlightInfo: {
   *     flightNumber: 'KL123',
   *     departureAirport: {
   *       airportCode: 'SFO',
   *       city: 'San Francisco',
   *       terminal: 'T4',
   *       gate: 'G8',
   *     },
   *     arrivalAirport: {
   *       airportCode: 'AMS',
   *       city: 'Amsterdam',
   *       terminal: 'T4',
   *       gate: 'G8',
   *     },
   *     flightSchedule: {
   *       boardingTime: '2015-12-26T10:30',
   *       departureTime: '2015-12-26T11:30',
   *       arrivalTime: '2015-12-27T07:30',
   *     },
   *   },
   * });
   * ```
   */
  sendAirlineUpdateTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attrs: MessengerTypes.AirlineUpdateAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createAirlineUpdateTemplate(attrs, options),
      options
    );
  }

  /**
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
   * @returns An object includes recipientId and messageId.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/one-time-notification/#one-time-notif
   *
   * @example
   *
   * ```js
   * await client.sendOneTimeNotifReqTemplate(USER_ID, {
   *   title: '<TITLE_TEXT>',
   *   payload: '<USER_DEFINED_PAYLOAD>',
   * });
   * ```
   *
   */
  sendOneTimeNotifReqTemplate(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    attrs: MessengerTypes.OneTimeNotifReqAttributes,
    options?: MessengerTypes.SendOption
  ): Promise<MessengerTypes.SendMessageSuccessResponse> {
    return this.sendMessage(
      psidOrRecipient,
      Messenger.createOneTimeNotifReqTemplate(attrs, options),
      options
    );
  }

  /**
   * Sends sender actions to specified user using the Send API, to let users know you are processing their requests.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param senderAction - Message state to display to the user. One of `typing_on`, `typing_off` or `mark_seen`
   * @param options - Other optional parameters.
   * @param options.personaId - ID of the persona.
   * @returns An object includes recipientId
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
   *
   * @example
   *
   * ```js
   * await client.sendSenderAction(USER_ID, 'typing_on');
   *
   * // Or with persona:
   * await client.sendSenderAction(USER_ID, 'typing_on', { personaId: '<PERSONA_ID>' });
   * ```
   */
  sendSenderAction(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    senderAction: MessengerTypes.SenderAction,
    options?: MessengerTypes.SenderActionOption
  ): Promise<MessengerTypes.SendSenderActionResponse> {
    const recipient =
      typeof psidOrRecipient === 'string'
        ? {
            id: psidOrRecipient,
          }
        : psidOrRecipient;
    return this.sendRawBody({
      recipient,
      senderAction,
      ...options,
    });
  }

  /**
   * Marks last message as read for the specified user.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @returns An object includes recipientId
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions#supported_actions
   *
   * @example
   *
   * ```js
   * await client.markSeen(USER_ID);
   * ```
   */
  markSeen(
    psidOrRecipient: MessengerTypes.PsidOrRecipient
  ): Promise<MessengerTypes.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'mark_seen');
  }

  /**
   * Turns typing indicators on for the specified user.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param options - Other optional parameters.
   * @param options.personaId - ID of the persona.
   * @returns An object includes recipientId
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions#supported_actions
   *
   * @example
   *
   * ```js
   * await client.typingOn(USER_ID);
   *
   * // Or with persona:
   * await client.typingOn(USER_ID, { personaId: '<PERSONA_ID>' });
   * ```
   * */
  typingOn(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    options?: MessengerTypes.SenderActionOption
  ): Promise<MessengerTypes.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'typing_on', options);
  }

  /**
   * Turns typing indicators off for the specified user.
   *
   * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
   * @param options - Other optional parameters.
   * @param options.personaId - ID of the persona.
   * @returns An object includes recipientId
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions#supported_actions
   *
   * @example
   *
   * ```js
   * await client.typingOff(USER_ID);
   *
   * // Or with persona:
   * await client.typingOff(USER_ID, { personaId: '<PERSONA_ID>' });
   * ```
   */
  typingOff(
    psidOrRecipient: MessengerTypes.PsidOrRecipient,
    options?: MessengerTypes.SenderActionOption
  ): Promise<MessengerTypes.SendSenderActionResponse> {
    return this.sendSenderAction(psidOrRecipient, 'typing_off', options);
  }

  /**
   * Sends multiple requests in a batch.
   *
   * @param requests - Subrequests in the batch.
   * @returns An array of batch results
   *
   * @see https://developers.facebook.com/docs/graph-api/making-multiple-requests
   *
   * @example
   *
   * ```js
   * const { MessengerBatch } = require('messaging-api-messenger');
   *
   * await client.sendBatch([
   *   MessengerBatch.sendText(USER_ID, '1'),
   *   MessengerBatch.sendText(USER_ID, '2'),
   *   MessengerBatch.sendText(USER_ID, '3'),
   * ]);
   */
  sendBatch(
    batch: MessengerTypes.BatchItem[],
    { includeHeaders = true }: { includeHeaders?: boolean } = {}
  ): Promise<
    {
      code: number;
      headers?: { name: string; value: string }[];
      body: Record<string, any>;
    }[]
  > {
    invariant(
      batch.length <= 50,
      'limit the number of requests which can be in a batch to 50'
    );

    const responseAccessPaths = batch.map((item) => item.responseAccessPath);

    const bodyEncodedbatch = batch
      .map((item) => omit(item, 'responseAccessPath'))
      .map((item) => {
        if (item.body) {
          const body = snakecaseKeysDeep(item.body) as Record<string, any>;
          return {
            ...item,
            body: Object.keys(body)
              .map((key) => {
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

    return this.axios
      .post('/', {
        accessToken: this.accessToken,
        includeHeaders,
        batch: bodyEncodedbatch,
      })
      .then(
        (res) =>
          res.data.map(
            (item: { code: number; body: string }, index: number) => {
              const responseAccessPath = responseAccessPaths[index];
              const datum = camelcaseKeysDeep(item) as Record<string, any>;
              if (datum.body) {
                const parsedBody = camelcaseKeysDeep(JSON.parse(datum.body));
                return {
                  ...datum,
                  body: responseAccessPath
                    ? get(parsedBody, responseAccessPath)
                    : parsedBody,
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
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts
   */

  /**
   * Creates a label
   *
   * @param name - Name of the custom label
   * @returns An object includes label ID.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#create_label
   *
   * @example
   *
   * ```js
   * await client.createLabel('awesome');
   * // {
   * //   id: 1712444532121303
   * // }
   * ```
   */
  createLabel(name: string): Promise<{ id: string }> {
    return this.axios
      .post<{ id: string }>(
        `/me/custom_labels?access_token=${this.accessToken}`,
        {
          name,
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Associates a label to a specific PSID
   *
   * @param userId - Facebook page-scoped user ID of the user
   * @param labelId - ID of the custom label
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#associate_label
   *
   * @example
   *
   * ```js
   * await client.associateLabel(USER_ID, LABEL_ID);
   * ```
   */
  associateLabel(userId: string, labelId: number): Promise<{ success: true }> {
    return this.axios
      .post<{ success: true }>(
        `/${labelId}/label?access_token=${this.accessToken}`,
        {
          user: userId,
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Removes a label currently associated with a PSID
   *
   * @param userId - Facebook page-scoped user ID of the user
   * @param labelId - ID of the custom label
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#remove_label
   *
   * @example
   *
   * ```js
   * await client.dissociateLabel(USER_ID, LABEL_ID);
   * ```
   */
  dissociateLabel(userId: string, labelId: number): Promise<{ success: true }> {
    return this.axios
      .delete<{ success: true }>(
        `/${labelId}/label?access_token=${this.accessToken}`,
        {
          data: { user: userId },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the labels currently associated with a PSID
   *
   * @param userId - Facebook page-scoped user ID of the user
   * @returns Associated labels in pagination result
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#retrieving_labels_by_psid
   *
   * @example
   *
   * ```js
   * await client.getAssociatedLabels(USER_ID);
   * // {
   * //   data: [
   * //     {
   * //       name: 'myLabel',
   * //       id: '1001200005003',
   * //     },
   * //     {
   * //       name: 'myOtherLabel',
   * //       id: '1001200005002',
   * //     },
   * //   ],
   * //   paging: {
   * //     cursors: {
   * //       before:
   * //         'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
   * //       after:
   * //         'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
   * //     },
   * //   },
   * // }
   * ```
   */
  getAssociatedLabels(
    userId: string,
    options: { fields?: string[] } = {}
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
    return this.axios
      .get<{
        data: { name: string; id: string }[];
        paging: {
          cursors: {
            before: string;
            after: string;
          };
        };
      }>(
        `/${userId}/custom_labels?fields=${fields}&access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves details of the label
   *
   * @param labelId - ID of the custom label
   * @param options - Other optional parameters.
   * @param options.fields - Fields to retrieve with its ID.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#get_label_details
   *
   * @example
   *
   * ```js
   * await client.getLabelDetails(LABEL_ID, { fields: ['name'] });
   * // {
   * //   id: "1001200005002",
   * //   name: "myLabel",
   * // }
   * ```
   */
  getLabelDetails(
    labelId: number,
    options: { fields?: string[] } = {}
  ): Promise<{ name: string; id: string }> {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this.axios
      .get<{ name: string; id: string }>(
        `/${labelId}?fields=${fields}&access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves a list of custom labels
   *
   * @returns Custom labels in pagination result
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#get_all_labels
   *
   * @example
   *
   * ```js
   * await client.getLabelList();
   * // {
   * //   data: [
   * //     {
   * //       name: 'myLabel',
   * //       id: '1001200005003',
   * //     },
   * //     {
   * //       name: 'myOtherLabel',
   * //       id: '1001200005002',
   * //     },
   * //   ],
   * //   paging: {
   * //     cursors: {
   * //       before:
   * //         'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
   * //       after:
   * //         'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
   * //     },
   * //   },
   * // }
   * ```
   */
  getLabelList(options: { fields?: string[] } = {}): Promise<{
    data: { name: string; id: string }[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }> {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this.axios
      .get<{
        data: { name: string; id: string }[];
        paging: {
          cursors: {
            before: string;
            after: string;
          };
        };
      }>(`/me/custom_labels?fields=${fields}&access_token=${this.accessToken}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes a Label.
   *
   * @param labelId -  ID of the custom label to delete.
   * @returns Success status
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/custom-labels#delete_label
   *
   * @example
   *
   * ```js
   * await client.deleteLabel(LABEL_ID);
   * ```
   */
  deleteLabel(labelId: number): Promise<{ success: true }> {
    return this.axios
      .delete<{ success: true }>(`/${labelId}?access_token=${this.accessToken}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Uploads specified attachment using URL address, buffer, or stream.
   *
   * @param type - Must be one of `image`, `video`, `audio` or `file`.
   * @param attachment - Attachment to be uploaded.
   * @param options - Other optional parameters.
   * @param options.isReusable - Set to `true` to make the saved asset sendable to other message recipients. Defaults to `false`.
   * @param options.filename - Required when upload from buffer.
   * @returns An object includes attachment ID
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api
   *
   * @example
   *
   * ```js
   * await client.uploadAttachment('image', 'http://www.example.com/image.jpg', { isReusable: true });
   * // { attachmentId: "1857777774821032" }
   *
   * // Or using read stream:
   * const fs = require('fs');
   * await client.uploadAttachment('image', fs.createReadStream('image.jpg'), { isReusable: true });
   *
   * // Or using buffer:
   * await client.uploadAttachment('image', buffer, {
   *   isReusable: true,
   *   filename: 'image.jpg',
   * });
   * ```
   */
  uploadAttachment(
    type: 'audio' | 'image' | 'video' | 'file',
    attachment: string | MessengerTypes.FileData,
    options: MessengerTypes.UploadOption = {}
  ): Promise<{ attachmentId: string }> {
    const args = [];

    const isReusable = options.isReusable ?? false;

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
        maxContentLength: Infinity, // Facebook limit is 25MB, set a bigger value and let Facebook handle rejection
      });
    }

    return this.axios
      .post<{ attachmentId: string }>(
        `/me/message_attachments?access_token=${this.accessToken}`,
        ...args
      )
      .then((res) => res.data, handleError);
  }

  /**
   *
   * @param audio - Audio to be uploaded.
   * @param options - Other optional parameters.
   * @param options.isReusable - Set to `true` to make the saved asset sendable to other message recipients. Defaults to `false`.
   * @param options.filename - Required when upload from buffer.
   * @returns An object includes attachment ID
   *
   * @example
   *
   * ```js
   * await client.uploadAudio('http://www.example.com/audio.mp3', { isReusable: true });
   *
   * // Or using read stream:
   * const fs = require('fs');
   * await client.uploadAudio(fs.createReadStream('audio.mp3'), { isReusable: true });
   *
   * // Or using buffer:
   * await client.uploadAudio(buffer, {
   *   isReusable: true,
   *   filename: 'audio.mp3',
   * });
   * ```
   */
  uploadAudio(
    attachment: string | MessengerTypes.FileData,
    options?: MessengerTypes.UploadOption
  ): Promise<{ attachmentId: string }> {
    return this.uploadAttachment('audio', attachment, options);
  }

  /**
   * Uploads image attachment using URL address, buffer, or stream.
   *
   * @param image - Image to be uploaded.
   * @param options - Other optional parameters.
   * @param options.isReusable - Set to `true` to make the saved asset sendable to other message recipients. Defaults to `false`.
   * @param options.filename - Required when upload from buffer.
   * @returns An object includes attachment ID
   *
   * @example
   *
   * ```js
   * await client.uploadImage('http://www.example.com/image.jpg', { isReusable: true });
   *
   * // Or using read stream:
   * const fs = require('fs');
   * await client.uploadImage(fs.createReadStream('image.jpg'), { isReusable: true });
   *
   * // Or using buffer:
   * await client.uploadImage(buffer, {
   *   isReusable: true,
   *   filename: 'image.jpg',
   * });
   * ```
   */
  uploadImage(
    attachment: string | MessengerTypes.FileData,
    options?: MessengerTypes.UploadOption
  ): Promise<{ attachmentId: string }> {
    return this.uploadAttachment('image', attachment, options);
  }

  /**
   * Uploads video attachment using URL address, buffer, or stream.
   *
   * @param video - Video to be uploaded.
   * @param options - Other optional parameters.
   * @param options.isReusable - Set to `true` to make the saved asset sendable to other message recipients. Defaults to `false`.
   * @param options.filename - Required when upload from buffer.
   * @returns An object includes attachment ID
   *
   * @example
   *
   * ```js
   * await client.uploadVideo('http://www.example.com/video.mp4', { isReusable: true });
   *
   * // Or using read stream:
   * const fs = require('fs');
   * await client.uploadVideo(fs.createReadStream('video.mp4'), { isReusable: true });
   *
   * // Or using buffer:
   * await client.uploadVideo(buffer, {
   *   isReusable: true,
   *   filename: 'video.mp4',
   * });
   * ```
   */
  uploadVideo(
    attachment: string | MessengerTypes.FileData,
    options?: MessengerTypes.UploadOption
  ): Promise<{ attachmentId: string }> {
    return this.uploadAttachment('video', attachment, options);
  }

  /**
   * Uploads file attachment using URL address, buffer, or stream.
   *
   * @param file - File to be uploaded.
   * @param options - Other optional parameters.
   * @param options.isReusable - Set to `true` to make the saved asset sendable to other message recipients. Defaults to `false`.
   * @param options.filename - Required when upload from buffer.
   * @returns An object includes attachment ID
   *
   * @example
   *
   * ```js
   * await client.uploadFile('http://www.example.com/file.pdf', { isReusable: true });
   *
   * // Or using read stream:
   * const fs = require('fs');
   * await client.uploadFile(fs.createReadStream('file.pdf'), { isReusable: true });
   *
   * // Or using buffer:
   * await client.uploadFile(buffer, {
   *   isReusable: true,
   *   filename: 'file.pdf',
   * });
   * ```
   */
  uploadFile(
    attachment: string | MessengerTypes.FileData,
    options?: MessengerTypes.UploadOption
  ): Promise<{ attachmentId: string }> {
    return this.uploadAttachment('file', attachment, options);
  }

  /**
   * Handover Protocol API
   *
   * @see https://developers.facebook.com/docs/messenger-platform/handover-protocol
   */

  /**
   * Passes thread control from your app to another app.
   *
   * @param recipientId - The PSID of the message recipient.
   * @param targetAppId - The app ID of the Secondary Receiver to pass thread control to.
   * @param metadata - Metadata passed to the receiving app in the `pass_thread_control` webhook event.
   * @returns Success status.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/pass-thread-control
   *
   * @example
   *
   * ```js
   * await client.passThreadControl(USER_ID, APP_ID, 'free formed text for another app');
   * ```
   */
  passThreadControl(
    recipientId: string,
    targetAppId: number,
    metadata?: string
  ): Promise<{ success: true }> {
    return this.axios
      .post<{ success: true }>(
        `/me/pass_thread_control?access_token=${this.accessToken}`,
        {
          recipient: { id: recipientId },
          targetAppId,
          metadata,
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Passes thread control from your app to "Page Inbox" app.
   *
   * @param recipientId - The PSID of the message recipient.
   * @param metadata - Metadata passed to the receiving app in the `pass_thread_control` webhook event.
   * @returns Success status.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control#page_inbox
   *
   * @example
   *
   * ```js
   * await client.passThreadControlToPageInbox(
   *   USER_ID,
   *   'free formed text for another app'
   * );
   * ```
   */
  passThreadControlToPageInbox(
    recipientId: string,
    metadata?: string
  ): Promise<{ success: true }> {
    return this.passThreadControl(recipientId, 263902037430900, metadata);
  }

  /**
   * Takes control of a specific thread from a Secondary Receiver app.
   *
   * @param recipientId - The PSID of the message recipient.
   * @param metadata - Metadata passed back to the secondary app in the `take_thread_control` webhook event.
   * @returns Success status.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/take-thread-control
   *
   * @example
   *
   * ```js
   * await client.takeThreadControl(USER_ID, 'free formed text for another app');
   * ```
   */
  takeThreadControl(
    recipientId: string,
    metadata?: string
  ): Promise<{ success: true }> {
    return this.axios
      .post<{ success: true }>(
        `/me/take_thread_control?access_token=${this.accessToken}`,
        {
          recipient: { id: recipientId },
          metadata,
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Requests control of a specific thread from a Primary Receiver app.
   *
   * @param recipientId - The PSID of the message recipient.
   * @param metadata - Metadata passed to the primary app in the `request_thread_control` webhook event.
   * @returns Success status.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/handover-protocol/request-thread-control/
   *
   * @example
   *
   * ```js
   * await client.requestThreadControl(USER_ID, 'free formed text for primary app');
   * ```
   */
  requestThreadControl(
    recipientId: string,
    metadata?: string
  ): Promise<{ success: true }> {
    return this.axios
      .post<{ success: true }>(
        `/me/request_thread_control?access_token=${this.accessToken}`,
        {
          recipient: { id: recipientId },
          metadata,
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the list of apps that are Secondary Receivers for a page.
   *
   * @returns An array of secondary receivers.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/secondary-receivers
   *
   * @example
   *
   * ```js
   * await client.getSecondaryReceivers();
   * // [
   * //   {
   * //     "id": "12345678910",
   * //     "name": "David's Composer"
   * //   },
   * //   {
   * //     "id": "23456789101",
   * //     "name": "Messenger Rocks"
   * //   }
   * // ]
   * ```
   */
  getSecondaryReceivers(): Promise<
    {
      id: string;
      name: string;
    }[]
  > {
    return this.axios
      .get<{
        data: {
          id: string;
          name: string;
        }[];
      }>(
        `/me/secondary_receivers?fields=id,name&access_token=${this.accessToken}`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Gets the current thread owner.
   *
   * @param recipientId - The PSID of the message recipient.
   *
   * @returns App Id of the current thread owner.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/handover-protocol/get-thread-owner
   *
   * @example
   *
   * ```js
   * await client.getThreadOwner(USER_ID);
   * // {
   * //   appId: '12345678910'
   * // }
   * ```
   */
  getThreadOwner(recipientId: string): Promise<{ appId: string }> {
    return this.axios
      .get<{
        data: [
          {
            threadOwner: {
              appId: string;
            };
          }
        ];
      }>(
        `/me/thread_owner?recipient=${recipientId}&access_token=${this.accessToken}`
      )
      .then((res) => res.data.data[0].threadOwner, handleError);
  }

  /**
   * Retrieves the insights of your Facebook page.
   *
   * @param metrics - [The metrics](https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api/#metrics) you want to check.
   * @param options - Optional arguments.
   * @param options.since - Optional. UNIX timestamp of the start time to get the metric for.
   * @param options.until - Optional. UNIX timestamp of the end time to get the metric for.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api
   *
   * @example
   *
   * ```js
   * await client.getInsights(['page_messages_reported_conversations_unique']);
   * // [
   * //   {
   * //     "name": "page_messages_reported_conversations_unique",
   * //     "period": "day",
   * //     "values": [
   * //       {
   * //         "value": "<VALUE>",
   * //         "endTime": "<UTC_TIMESTAMP>"
   * //       },
   * //       {
   * //         "value": "<VALUE>",
   * //         "endTime": "<UTC_TIMESTAMP>"
   * //       }
   * //     ]
   * //   }
   * // ]
   * ```
   */
  getInsights(
    metrics: MessengerTypes.InsightMetric[],
    options: MessengerTypes.InsightOptions = {}
  ) {
    return this.axios
      .get(
        `/me/insights/?${querystring.stringify({
          metric: metrics.join(','),
          access_token: this.accessToken,
          ...options,
        })}`
      )
      .then((res) => res.data.data, handleError);
  }

  /**
   * Retrieves the number of conversations with the Page that have been blocked.
   *
   * @param options - Optional arguments.
   * @param options.since - Optional. UNIX timestamp of the start time to get the metric for.
   * @param options.until - Optional. UNIX timestamp of the end time to get the metric for.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api#metrics
   *
   * @example
   *
   * ```js
   * await client.getBlockedConversations();
   * // {
   * //   "name": "page_messages_blocked_conversations_unique",
   * //   "period": "day",
   * //   "values": [
   * //     {
   * //       "value": "<VALUE>",
   * //       "endTime": "<UTC_TIMESTAMP>"
   * //     },
   * //     {
   * //       "value": "<VALUE>",
   * //       "endTime": "<UTC_TIMESTAMP>"
   * //     }
   * //  ]
   * // }
   * ```
   */
  getBlockedConversations(options: MessengerTypes.InsightOptions): Promise<{
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
    ).then((result) => result[0]);
  }

  /**
   * Retrieves the number of conversations from your Page that have been reported by people for reasons such as spam, or containing inappropriate content.
   *
   * @param options - Optional arguments.
   * @param options.since - Optional. UNIX timestamp of the start time to get the metric for.
   * @param options.until - Optional. UNIX timestamp of the end time to get the metric for.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api#metrics
   *
   * @example
   *
   * ```js
   * await client.getReportedConversations();
   * // {
   * //   "name": "page_messages_reported_conversations_unique",
   * //   "period": "day",
   * //   "values": [
   * //     {
   * //       "value": "<VALUE>",
   * //       "endTime": "<UTC_TIMESTAMP>"
   * //     },
   * //     {
   * //       "value": "<VALUE>",
   * //       "endTime": "<UTC_TIMESTAMP>"
   * //     }
   * //   ]
   * // }
   * ```
   */
  getReportedConversations(options: MessengerTypes.InsightOptions): Promise<{
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
    ).then((result) => result[0]);
  }

  /**
   * Retrieves the number of people who have sent a message to your business, not including people who have blocked or reported your business on Messenger. (This number only includes connections made since October 2016.)
   *
   * @param options - Optional arguments.
   * @param options.since - Optional. UNIX timestamp of the start time to get the metric for.
   * @param options.until - Optional. UNIX timestamp of the end time to get the metric for.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api#metrics
   *
   * @example
   *
   * ```js
   * await client.getTotalMessagingConnections();
   * // {
   * //   name: 'page_messages_total_messaging_connections',
   * //   period: 'day',
   * //   values: [
   * //     { value: 1000, endTime: '2018-03-12T07:00:00+0000' },
   * //     { value: 1000, endTime: '2018-03-13T07:00:00+0000' },
   * //   ],
   * //   title: 'Messaging connections',
   * //   description:
   * //     'Daily: The number of people who have sent a message to your business, not including people who have blocked or reported your business on Messenger. (This number only includes connections made since October 2016.)',
   * //   id:
   * //     '1386473101668063/insights/page_messages_total_messaging_connections/day',
   * // }
   * ```
   */
  getTotalMessagingConnections(
    options: MessengerTypes.InsightOptions
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
    ).then((result) => result[0]);
  }

  /**
   * Retrieves the number of messaging conversations on Facebook Messenger that began with people who had never messaged with your business before.
   *
   * @param options - Optional arguments.
   * @param options.since - Optional. UNIX timestamp of the start time to get the metric for.
   * @param options.until - Optional. UNIX timestamp of the end time to get the metric for.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api#metrics
   *
   * @example
   *
   * ```js
   * await client.getNewConversations();
   * // {
   * //   name: 'page_messages_new_conversations_unique',
   * //   period: 'day',
   * //   values: [
   * //     { value: 1, endTime: '2018-03-12T07:00:00+0000' },
   * //     { value: 0, endTime: '2018-03-13T07:00:00+0000' },
   * //   ],
   * //   title: 'Daily unique new conversations count',
   * //   description:
   * //     'Daily: The number of messaging conversations on Facebook Messenger that began with people who had never messaged with your business before.',
   * //   id:
   * //     '1386473101668063/insights/page_messages_new_conversations_unique/day',
   * // }
   * ```
   */
  getNewConversations(options: MessengerTypes.InsightOptions): Promise<{
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
    ).then((result) => result[0]);
  }

  /**
   * Sets values of NLP configs.
   *
   * @param config - Configuration of NLP.
   * @param config.nlpEnabled - Either enable NLP or disable NLP for that Page.
   * @param config.model - Specifies the NLP model to use. Either one of `{CHINESE, CROATIAN, DANISH, DUTCH, ENGLISH, FRENCH_STANDARD, GERMAN_STANDARD, HEBREW, HUNGARIAN, IRISH, ITALIAN_STANDARD, KOREAN, NORWEGIAN_BOKMAL, POLISH, PORTUGUESE, ROMANIAN, SPANISH, SWEDISH, VIETNAMESE}`, or `CUSTOM`.
   * @param config.customToken - Access token from Wit.
   * @param config.verbose - Specifies whether verbose mode if enabled, which returns extra information like the position of the detected entity in the query.
   * @param config.nest - The number of entities to return, in descending order of confidence. Minimum 1. Maximum 8. Defaults to 1.
   * @returns
   *
   * @see https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   *
   * @example
   *
   * ```js
   * await client.setNLPConfigs({ nlpEnabled: true });
   * ```
   */
  // FIXME: [type] return type
  setNLPConfigs(config: MessengerTypes.MessengerNLPConfig = {}): Promise<any> {
    return this.axios
      .post(
        `/me/nlp_configs?${querystring.stringify(
          snakecaseKeysDeep({
            ...config,
            accessToken: this.accessToken,
          }) as Record<string, any>
        )}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Enables Built-in NLP.
   *
   * @returns
   *
   * @see https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   *
   * @example
   *
   * ```js
   * await client.enableNLP();
   * ```
   */
  // FIXME: [type] return type
  enableNLP(): Promise<any> {
    return this.setNLPConfigs({ nlpEnabled: true });
  }

  /**
   * Disables Built-in NLP.
   *
   * @returns
   *
   * @see https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   *
   * @example
   *
   * ```js
   * await client.disableNLP();
   * ```
   */
  // FIXME: [type] return type
  disableNLP(): Promise<any> {
    return this.setNLPConfigs({ nlpEnabled: false });
  }

  /**
   * Logs custom events by using the [Application Activities Graph API](https://developers.facebook.com/docs/graph-api/reference/application/activities/) endpoint.
   *
   * @param activity - Event activity
   * @param activity.appId - ID of the app.
   * @param activity.pageId - ID of the page.
   * @param activity.pageScopedUserId - Facebook page-scoped user ID.
   * @param activity.events - Custom events.
   * @returns
   *
   * @see https://developers.facebook.com/docs/app-events/bots-for-messenger#logging-custom-events
   *
   * @example
   *
   * ```js
   * await client.logCustomEvents({
   *   appId: APP_ID,
   *   pageId: PAGE_ID,
   *   pageScopedUserId: USER_ID,
   *   events: [
   *     {
   *       _eventName: 'fb_mobile_purchase',
   *       _valueToSum: 55.22,
   *       _fbCurrency: 'USD',
   *     },
   *   ],
   * });
   * ```
   */
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
  }): Promise<any> {
    return this.axios
      .post<any>(`/${appId}/activities`, {
        event: 'CUSTOM_APP_EVENTS',
        customEvents: JSON.stringify(events),
        advertiserTrackingEnabled: 0,
        applicationTrackingEnabled: 0,
        extinfo: JSON.stringify(['mb1']),
        pageId,
        pageScopedUserId,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * @see https://developers.facebook.com/docs/messenger-platform/identity/id-matching#examples
   *
   * @example
   */
  // FIXME: [type] return type
  getUserField({
    field,
    userId,
    appSecret,
    app,
    page,
  }: {
    field: string;
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
  }) {
    // $appsecret_proof= hash_hmac('sha256', $access_token, $app_secret);
    const appsecretProof = crypto
      .createHmac('sha256', appSecret)
      .update(this.accessToken)
      .digest('hex');

    const appQueryString = app ? `&app=${app}` : '';
    const pageQueryString = page ? `&page=${page}` : '';

    return this.axios
      .get(
        `/${userId}/${field}?access_token=${this.accessToken}&appsecret_proof=${appsecretProof}${appQueryString}${pageQueryString}`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Given a user ID for a bot in Messenger, retrieve the IDs for apps owned by the same business
   *
   * @param params - Parameters
   * @param params.userId - Page-scoped user ID.
   * @param params.appSecret - Secret of the app.
   * @param params.app - The app to retrieve the IDs.
   * @param params.page - The page to retrieve the IDs.
   * @returns User IDs in pagination result
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/id-matching
   *
   * @example
   *
   * ```js
   * await client.getIdsForApps({
   *   userId: USER_ID,
   *   appSecret: APP_SECRET,
   * });
   * // {
   * //   data: [
   * //     {
   * //       id: '10152368852405295',
   * //       app: {
   * //         category: 'Business',
   * //         link: 'https://www.facebook.com/games/?app_id=1419232575008550',
   * //         name: "John's Game App",
   * //         id: '1419232575008550',
   * //       },
   * //     },
   * //     {
   * //       id: '645195294',
   * //       app: {
   * //         link: 'https://apps.facebook.com/johnsmovieappns/',
   * //         name: 'JohnsMovieApp',
   * //         namespace: 'johnsmovieappns',
   * //         id: '259773517400382',
   * //       },
   * //     },
   * //   ],
   * //   paging: {
   * //     cursors: {
   * //       before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
   * //       after: 'NDAwMDExOTA3MDM1ODMwA',
   * //     },
   * //   },
   * // };
   * ```
   */
  getIdsForApps({
    userId,
    appSecret,
    app,
    page,
  }: {
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
  }): Promise<{
    data: {
      id: string;
      app: {
        id: string;
        link: string;
        name: string;
        category?: string;
        namespace?: string;
      };
    }[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }> {
    return this.getUserField({
      field: 'ids_for_apps',
      userId,
      appSecret,
      app,
      page,
    });
  }

  /**
   * Given a user ID for a Page (associated with a bot), retrieve the IDs for other Pages owned by the same business
   *
   * @param params - Parameters
   * @param params.userId - Page-scoped user ID.
   * @param params.appSecret - Secret of the app.
   * @param params.app - The app to retrieve the IDs.
   * @param params.page - The page to retrieve the IDs.
   * @returns User IDs in pagination result
   *
   * @see https://developers.facebook.com/docs/messenger-platform/identity/id-matching
   *
   * @example
   *
   * ```js
   * await client.getIdsForPages({
   *   userId: USER_ID,
   *   appSecret: APP_SECRET,
   * });
   * // {
   * //   data: [
   * //     {
   * //       id: '12345123', // The psid for the user for that page
   * //       page: {
   * //         category: 'Musician',
   * //         link:
   * //           'https://www.facebook.com/Johns-Next-Great-Thing-380374449010653/',
   * //         name: "John's Next Great Thing",
   * //         id: '380374449010653',
   * //       },
   * //     },
   * //   ],
   * //   paging: {
   * //     cursors: {
   * //       before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
   * //       after: 'NDAwMDExOTA3MDM1ODMwA',
   * //     },
   * //   },
   * // };
   * ```
   */
  getIdsForPages({
    userId,
    appSecret,
    app,
    page,
  }: {
    userId: string;
    appSecret: string;
    app?: string;
    page?: string;
  }): Promise<{
    data: {
      id: string;
      page: {
        id: string;
        link: string;
        name: string;
        category?: string;
        namespace?: string;
      };
    }[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }> {
    return this.getUserField({
      field: 'ids_for_pages',
      userId,
      appSecret,
      app,
      page,
    });
  }

  /**
   * Personas API
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/personas
   */

  /**
   * Creates a Persona.
   *
   * @param persona - Data of the new persona
   * @param persona.name - Name of the persona.
   * @param persona.profilePictureUrl - Profile picture of the persona.
   * @returns - ID of the persona
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#create
   *
   * @example
   *
   * ```js
   * await client.createPersona({
   *   name: 'John Mathew',
   *   profilePictureUrl: 'https://facebook.com/john_image.jpg',
   * });
   * // {
   * //   "id": "<PERSONA_ID>"
   * // }
   * ```
   */
  createPersona(persona: MessengerTypes.Persona): Promise<{ id: string }> {
    return this.axios
      .post<{ id: string }>(
        `/me/personas?access_token=${this.accessToken}`,
        persona
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the name and profile picture of a persona.
   *
   * @param personaId - ID of the persona.
   * @returns Data of the persona
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#get
   *
   * @example
   *
   * ```js
   * await client.getPersona('PERSONA_ID');
   * // {
   * //   "name": "John Mathew",
   * //   "profile_picture_url": "https://facebook.com/john_image.jpg",
   * //   "id": "<PERSONA_ID>"
   * // }
   * ```
   */
  getPersona(personaId: string): Promise<{
    id: string;
    name: string;
    profilePictureUrl: string;
  }> {
    return this.axios
      .get<{
        id: string;
        name: string;
        profilePictureUrl: string;
      }>(`/${personaId}?access_token=${this.accessToken}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves personas associated with a page using the cursor.
   *
   * @param cursor - Pagination cursor.
   * @returns - Persona data in pagination result
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#retrieve_all
   *
   * @example
   *
   * ```js
   * await client.getPersonas(cursor);
   * // {
   * //   "data": [
   * //     {
   * //       "name": "John Mathew",
   * //       "profile_picture_url": "https://facebook.com/john_image.jpg",
   * //       "id": "<PERSONA_ID>"
   * //     },
   * //     {
   * //       "name": "David Mark",
   * //       "profile_picture_url": "https://facebook.com/david_image.jpg",
   * //       "id": "<PERSONA_ID>"
   * //     }
   * //   ],
   * //   "paging": {
   * //     "cursors": {
   * //       "before": "QVFIUlMtR2ZATQlRtVUZALUlloV1",
   * //       "after": "QVFIUkpnMGx0aTNvUjJNVmJUT0Yw"
   * //     }
   * //   }
   * // }
   * ```
   */
  getPersonas(cursor?: string): Promise<{
    data: {
      id: string;
      name: string;
      profilePictureUrl: string;
    }[];
    paging: { cursors: { before: string; after: string } };
  }> {
    return this.axios
      .get<{
        data: {
          id: string;
          name: string;
          profilePictureUrl: string;
        }[];
        paging: { cursors: { before: string; after: string } };
      }>(
        `/me/personas?access_token=${this.accessToken}${
          cursor ? `&after=${cursor}` : ''
        }`
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves all personas associated with a page.
   *
   * @returns an array of all personas
   *
   * @example
   *
   * ```js
   * await client.getAllPersonas();
   * // [
   * //   {
   * //     "name": "John Mathew",
   * //     "profile_picture_url": "https://facebook.com/john_image.jpg",
   * //     "id": "<PERSONA_ID>"
   * //   },
   * //   {
   * //     "name": "David Mark",
   * //     "profile_picture_url": "https://facebook.com/david_image.jpg",
   * //     "id": "<PERSONA_ID>"
   * //   }
   * // ]
   * ```
   */
  async getAllPersonas(): Promise<
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
      } = await this.getPersonas(cursor);

      allPersonas = allPersonas.concat(data);
      cursor = paging ? paging.cursors.after : null;
    } while (cursor);

    return allPersonas;
  }

  /**
   * Deletes a persona.
   *
   * @param personaId - ID of the persona.
   * @returns Success status.
   *
   * @see https://developers.facebook.com/docs/messenger-platform/send-messages/personas/#remove
   *
   * @example
   *
   * ```js
   * await client.deletePersona('PERSONA_ID');
   * ```
   */
  deletePersona(personaId: string): Promise<{ success: true }> {
    return this.axios
      .delete<{ success: true }>(
        `/${personaId}?access_token=${this.accessToken}`
      )
      .then((res) => res.data, handleError);
  }
}
