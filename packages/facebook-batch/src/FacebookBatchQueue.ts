import { JsonValue } from 'type-fest';
import { MessengerClient, MessengerTypes } from 'messaging-api-messenger';

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
  /**
   * The queue to store facebook requests.
   */
  readonly queue: QueueItem[];

  private client: MessengerClient;

  private delay: number;

  private shouldRetry: (err: BatchRequestErrorInfo) => boolean;

  private retryTimes: number;

  private includeHeaders: boolean;

  private timeout: NodeJS.Timeout;

  /**
   *
   * @param client - A MessengerClient or FacebookClient instance.
   * @param options - Optional batch config.
   *
   * @example
   * ```js
   * const client = new MessengerClient();
   * new FacebookBatchQueue(client);
   *
   * new FacebookBatchQueue(client, {
   *   delay: 3000,
   *   shouldRetry: () => true,
   *   retryTimes: 3,
   * });
   * ```
   */
  constructor(
    clientConfig: MessengerTypes.ClientConfig,
    options: BatchConfig = {}
  ) {
    this.queue = [];

    // TODO: we use messenger client here for now, but maybe we will replace it with some facebook base client
    this.client = new MessengerClient(clientConfig);
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
   *
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
   *   recipientId: '...',
   *   messageId: '...',
   * }
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
   * @remarks
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
      const responses = await this.client.sendBatch(
        items.map((item) => item.request),
        {
          includeHeaders: this.includeHeaders,
        }
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

        if (retry < this.retryTimes && this.shouldRetry(err)) {
          this.queue.push({ request, resolve, reject, retry: retry + 1 });
        } else {
          reject(new BatchRequestError(err));
        }
      });
    } catch (err) {
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
}
