import invariant from 'invariant';
import { JsonObject } from 'type-fest';
import { MessengerClient } from 'messaging-api-messenger';

import BatchRequestError from './BatchRequestError';
import {
  BatchConfig,
  BatchErrorResponse,
  BatchRequest,
  BatchRequestErrorInfo,
  QueueItem,
} from './types';

const MAX_BATCH_SIZE = 50;

const alwaysTrue = (): true => true;

export default class FacebookBatchQueue {
  _client: MessengerClient;

  _queue: QueueItem[];

  _delay: number;

  _shouldRetry: (err: BatchRequestErrorInfo) => boolean;

  _retryTimes: number;

  _timeout: NodeJS.Timeout;

  constructor(client: MessengerClient, options: BatchConfig = {}) {
    invariant(
      client,
      'Must provide a MessengerClient or FacebookClient instance'
    );

    this._client = client;
    this._queue = [];
    this._delay = options.delay ?? 1000;
    this._shouldRetry = options.shouldRetry ?? alwaysTrue;
    this._retryTimes = options.retryTimes ?? 0;

    this._timeout = setTimeout(() => this.flush(), this._delay);
  }

  get queue(): QueueItem[] {
    return this._queue;
  }

  push<T extends JsonObject = JsonObject>(request: BatchRequest): Promise<T> {
    const promise = new Promise((resolve, reject) => {
      this._queue.push({ request, resolve, reject });
    });

    if (this._queue.length >= MAX_BATCH_SIZE) {
      this.flush();
    }

    return promise as Promise<T>;
  }

  async flush(): Promise<void> {
    const items = this._queue.splice(0, MAX_BATCH_SIZE);

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => this.flush(), this._delay);

    if (items.length < 1) return;

    try {
      const responses = await this._client.sendBatch(
        items.map((item) => item.request)
      );

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

        if (retry < this._retryTimes && this._shouldRetry(err)) {
          this._queue.push({ request, resolve, reject, retry: retry + 1 });
        } else {
          reject(new BatchRequestError(err));
        }
      });
    } catch (err) {
      items.forEach(({ request, resolve, reject, retry = 0 }) => {
        if (retry < this._retryTimes && this._shouldRetry(err)) {
          this._queue.push({ request, resolve, reject, retry: retry + 1 });
        } else {
          reject(err);
        }
      });
    }
  }

  stop(): void {
    clearTimeout(this._timeout);
  }
}
