/* eslint-disable max-classes-per-file */
import axios, { AxiosError, AxiosInstance } from 'axios';
import get from 'lodash/get';
import qs from 'qs';
import { CamelCasedPropertiesDeep } from 'type-fest';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  pascalcaseKeys,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as TwilioTypes from './TwilioTypes';

/**
 * @see https://www.twilio.com/docs/usage/troubleshooting/debugging-your-application#debugging-calls-to-the-rest-api
 */
function getErrorMessage(
  err:
    | AxiosError<{
        code: number;
        message: string;
        moreInfo: string;
        status: number;
      }>
    | Error
) {
  if (!('response' in err && err.response?.data)) {
    return err.message;
  }

  const error = get(err, 'response.data');

  if (!error) return err.message;

  return `${error.code} ${error.message} ${error.moreInfo}`;
}

function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    throw new PrintableAxiosError(`Twilio API - ${getErrorMessage(err)}`, err);
  }
  throw err;
}

class MessageListInstance {
  private client: TwilioClient;

  constructor(client: TwilioClient) {
    this.client = client;
  }

  /**
   * Send a new outgoing message.
   *
   * @param options - the message options
   * @returns message resource object
   * @see https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
   * @example
   * ```js
   * await twilio.messages.create({
   *   to: 'whatsapp:+15005550006',
   *   body: 'This is a message that I want to send over WhatsApp with Twilio',
   * });
   * ```
   */
  public async create(
    options: TwilioTypes.MessageListInstanceCreateOptions
  ): Promise<CamelCasedPropertiesDeep<TwilioTypes.MessageResource>> {
    try {
      const { data } = await this.client.axios.post<
        CamelCasedPropertiesDeep<TwilioTypes.MessageResource>
      >('/Messages.json', {
        from: this.client.phoneNumber,
        ...options,
      });
      return data;
    } catch (err: unknown) {
      handleError(err);
    }
  }
}

export default class TwilioClient {
  /**
   * The underlying axios instance.
   */
  public readonly axios: AxiosInstance;

  /**
   * The `messages.*` methods.
   */
  public readonly messages: MessageListInstance;

  /**
   * The phone number used by the client
   */
  public readonly phoneNumber: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * The constructor of TwilioClient.
   *
   * @param config - the config object
   * @example
   * ```js
   * const twilio = new TwilioClient({
   *   accountSid: TWILIO_ACCOUNT_SID,
   *   authToken: TWILIO_AUTH_TOKEN,
   *   phoneNumber: 'whatsapp:+14155238886',
   * });
   * ```
   */
  constructor(config: TwilioTypes.ClientConfig) {
    const twilioOrigin = `https://${config.accountSid}:${config.authToken}@api.twilio.com`;

    this.phoneNumber = config.phoneNumber;

    this.axios = axios.create({
      baseURL: `${config.origin ?? twilioOrigin}/2010-04-01/Accounts/${
        config.accountSid
      }/`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: [
        (data, headers) => {
          if (headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
            return data;
          }
          return qs.stringify(pascalcaseKeys(data), { indices: false });
        },
        // eslint-disable-next-line no-nested-ternary
        ...(Array.isArray(axios.defaults.transformRequest)
          ? axios.defaults.transformRequest
          : axios.defaults.transformRequest !== undefined
          ? [axios.defaults.transformRequest]
          : []),
      ],
      transformResponse: [
        // eslint-disable-next-line no-nested-ternary
        ...(Array.isArray(axios.defaults.transformResponse)
          ? axios.defaults.transformResponse
          : axios.defaults.transformResponse !== undefined
          ? [axios.defaults.transformResponse]
          : []),
        (data, headers) => {
          if (headers['content-type'] !== 'application/json') return data;
          return camelcaseKeysDeep(data);
        },
      ],
    });

    this.onRequest = config.onRequest;

    this.axios.interceptors.request.use(
      createRequestInterceptor({
        onRequest: this.onRequest,
      })
    );

    this.messages = new MessageListInstance(this);
  }
}
