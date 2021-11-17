import crypto from 'crypto';
import url from 'url';

import appendQuery from 'append-query';
import axios, { Method } from 'axios';
import get from 'lodash/get';
import invariant from 'ts-invariant';
import omit from 'lodash/omit';
import { JsonValue, SnakeCasedPropertiesDeep } from 'type-fest';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  snakecaseKeys,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import BatchRequestError from './BatchRequestError';
import {
  BatchConfig,
  BatchErrorResponse,
  BatchRequest,
  BatchRequestErrorInfo,
  BatchRequestItem,
  BatchResponseBeforeParse,
  BatchResponseItem,
  ClientConfig,
  QueueItem,
} from './types';

const MAX_BATCH_SIZE = 50;

const alwaysTrue = (): true => true;

function extractVersion(version: string): string {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

export default class FacebookBatchQueue {
  /**
   * The queue to store facebook requests.
   */
  public readonly queue: QueueItem[];

  /**
   * The version of the Facebook Graph API.
   */
  private version: string;

  /**
   * The access token used by the client.
   */
  private accessToken: string;

  /**
   * The app secret used by the client.
   */
  private appSecret?: string;

  /**
   * The origin used by the client.
   */
  private origin: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  private skipAppSecretProof: boolean;

  private delay: number;

  private shouldRetry: (err: BatchRequestErrorInfo) => boolean;

  private retryTimes: number;

  private includeHeaders: boolean;

  private timeout: NodeJS.Timeout;

  /**
   *
   * @param options - Optional batch config.
   * @example
   * ```js
   * const client = new MessengerClient();
   * new FacebookBatchQueue(client);
   *
   * new FacebookBatchQueue(client, {
   *   accessToken: '<ACCESS_TOKEN>',
   *   appSecret: '<APP_SECRET>',
   *   delay: 3000,
   *   shouldRetry: () => true,
   *   retryTimes: 3,
   * });
   * ```
   */
  constructor(options: ClientConfig & BatchConfig) {
    this.queue = [];

    this.version = extractVersion(options.version ?? '12.0');
    this.accessToken = options.accessToken;
    this.origin = options.origin ?? 'https://graph.facebook.com';
    this.appSecret = options.appSecret;
    this.skipAppSecretProof = options.skipAppSecretProof ?? false;
    this.onRequest = options.onRequest;
    this.delay = options.delay ?? 1000;
    this.shouldRetry = options.shouldRetry ?? alwaysTrue;
    this.retryTimes = options.retryTimes ?? 0;
    this.includeHeaders = options.includeHeaders ?? true;

    this.timeout = setTimeout(() => this.flush(), this.delay);
  }

  /**
   * Pushes a facebook request into the queue.
   *
   * @param request - The request to be queued.
   * @returns A promise resolves the response of the request.
   * @example
   * ```js
   * await bq.push({
   *   method: 'POST',
   *   relativeUrl: 'me/messages',
   *   body: {
   *     messagingType: 'UPDATE',
   *     recipient: 'PSID',
   *     message: { text: 'Hello World' },
   *   },
   * });
   * //=> {
   * //  recipientId: '...',
   * //  messageId: '...',
   * // }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  push<T extends JsonValue = any>(request: BatchRequest): Promise<T> {
    const promise = new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
    });

    if (this.queue.length >= MAX_BATCH_SIZE) {
      this.flush();
    }

    return promise as Promise<T>;
  }

  /**
   * Flushes the queue proactively.
   *
   * This queue has a timer to flush items at a time interval, so normally you don't need to call this method.
   *
   * @example
   * ```js
   * await bq.flush();
   * ```
   */
  async flush(): Promise<void> {
    const items = this.queue.splice(0, MAX_BATCH_SIZE);

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.flush(), this.delay);

    if (items.length < 1) return;

    try {
      const responses = await this.sendBatch(items.map((item) => item.request));

      items.forEach(({ request, resolve, reject, retry = 0 }, i) => {
        const response = responses[i];
        if (response.code === 200) {
          resolve(response.body);
          return;
        }

        const err: BatchRequestErrorInfo = {
          response: response as BatchErrorResponse,
          request,
        };

        if (retry < this.retryTimes && this.shouldRetry(err)) {
          this.queue.push({ request, resolve, reject, retry: retry + 1 });
        } else {
          reject(new BatchRequestError(err));
        }
      });
    } catch (err: any) {
      items.forEach(({ request, resolve, reject, retry = 0 }) => {
        if (retry < this.retryTimes && this.shouldRetry(err)) {
          this.queue.push({ request, resolve, reject, retry: retry + 1 });
        } else {
          reject(err);
        }
      });
    }
  }

  /**
   * Stops the internal timer.
   *
   * @example
   * ```js
   * bq.stop();
   * ```
   */
  stop(): void {
    clearTimeout(this.timeout);
  }

  /**
   * Sends multiple requests in a batch.
   *
   * @param requests - Subrequests in the batch.
   * @returns An array of batch results
   * @see https://developers.facebook.com/docs/graph-api/batch-requests
   */
  private async sendBatch(
    reqItems: BatchRequestItem[]
  ): Promise<BatchResponseItem[]> {
    invariant(
      reqItems.length <= 50,
      'limit the number of requests which can be in a batch to 50'
    );

    const responseAccessPaths = reqItems.map((item) => item.responseAccessPath);

    const omitResponseAccessPath = (item: BatchRequestItem) =>
      omit(item, 'responseAccessPath');

    // https://developers.facebook.com/docs/graph-api/security/
    const addAppSecretProof = (item: BatchRequestItem) => {
      if (this.skipAppSecretProof || !this.appSecret) return item;

      // add batch-level app secret proof
      const urlParts = url.parse(item.relativeUrl, true);
      const accessToken =
        get(urlParts, 'query.access_token') || get(item, 'body.accessToken');

      if (accessToken) {
        const appSecretProof = crypto
          .createHmac('sha256', this.appSecret)
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
    };

    const toSnakeCase = (item: BatchRequestItem) => snakecaseKeysDeep(item);

    const encodeBody = (item: SnakeCasedPropertiesDeep<BatchRequestItem>) => {
      const { body } = item;
      if (!body) return item;

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
    };

    const baseUrl = `${this.origin}/v${this.version}/`;

    const preparedBatch = reqItems
      .map(omitResponseAccessPath)
      .map(addAppSecretProof)
      .map(toSnakeCase)
      .map((item) => {
        try {
          if (this.onRequest) {
            this.onRequest({
              method: item.method.toLowerCase() as Method,
              url: baseUrl + item.relative_url,
              body: item.body,
              headers: {},
            });
          }
          // eslint-disable-next-line no-empty
        } catch {}

        return item;
      })
      .map(encodeBody);

    // add top-level app secret proof
    let appSecretProof;
    if (!this.skipAppSecretProof && this.appSecret) {
      appSecretProof = crypto
        .createHmac('sha256', this.appSecret)
        .update(this.accessToken, 'utf8')
        .digest('hex');
    }

    const { data } = await axios.post(
      baseUrl,
      snakecaseKeys({
        accessToken: this.accessToken,
        includeHeaders: this.includeHeaders,
        batch: preparedBatch,
        ...(appSecretProof ? { appSecretProof } : undefined),
      })
    );

    const parseBody = (item: BatchResponseBeforeParse) => {
      if (!item.body) return item;

      return {
        ...item,
        body: JSON.parse(item.body),
      };
    };

    const toCamelCase = (item: BatchResponseItem) => camelcaseKeysDeep(item);

    return data
      .map(parseBody)
      .map(toCamelCase)
      .map((item: BatchResponseItem, index: number) => {
        if (!item.body) return item;

        const responseAccessPath = responseAccessPaths[index];
        return {
          ...item,
          body: responseAccessPath
            ? get(item.body, responseAccessPath)
            : item.body,
        };
      });
  }
}
