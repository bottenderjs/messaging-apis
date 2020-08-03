import crypto from 'crypto';
import url from 'url';

import appendQuery from 'append-query';
import axios, { AxiosInstance, AxiosTransformer } from 'axios';
import get from 'lodash/get';
import invariant from 'ts-invariant';
import isPlainObject from 'lodash/isPlainObject';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as Types from './MessengerTypes';

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

export default class FacebookBaseClient {
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

  constructor(config: Types.ClientConfig) {
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
    this.version = extractVersion(config.version || '6.0');
    this.onRequest = config.onRequest;
    const { origin } = config;

    let skipAppSecretProof;
    if (typeof config.skipAppSecretProof === 'boolean') {
      skipAppSecretProof = config.skipAppSecretProof;
    } else {
      skipAppSecretProof = this.appSecret == null;
    }

    this.axios = axios.create({
      baseURL: `${origin || 'https://graph.facebook.com'}/v${this.version}/`,
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

        const urlParts = url.parse(requestConfig.url || '', true);
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
        requestConfig.url = appendQuery(requestConfig.url || '', {
          appsecret_proof: appSecretProof,
        });

        return requestConfig;
      });
    }
  }
}
