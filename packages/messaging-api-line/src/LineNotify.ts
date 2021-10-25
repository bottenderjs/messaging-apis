import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import qs from 'qs';
import { PrintableAxiosError } from 'axios-error';

import * as LineTypes from './LineTypes';

function handleError(
  err: AxiosError<{
    error: {
      message: string;
    };
  }>
): never {
  if (err.response && err.response.data && err.response.data.error) {
    const { message } = err.response.data.error;
    const msg = `LINE Notify API - ${message}`;
    throw new PrintableAxiosError(msg, err);
  }
  throw new PrintableAxiosError(err.message, err);
}

function throwErrorIfAny<
  T extends {
    status: number;
    message: string;
  }
>(res: AxiosResponse<T>): T {
  if (res.data.status !== 200) {
    const { status, message } = res.data;
    const msg = `LINE NOTIFY API - ${status} ${message}`;
    throw new PrintableAxiosError(msg, {
      response: res,
      config: res.config,
      request: res.request,
    });
  }
  return res.data;
}

/**
 * LINE Notify
 */
export default class LineNotify {
  /**
   * The underlying axios instance.
   */
  readonly axios: AxiosInstance;

  /**
   * The underlying axios instance for notify-api.line.me APIs.
   */
  readonly apiAxios: AxiosInstance;

  /**
   * The client ID used by the client.
   */
  private clientId: string;

  /**
   * The client secret used by the client.
   */
  private clientSecret: string;

  /**
   * The redirect URI used by the client.
   */
  private redirectUri: string;

  /**
   * The origin of the notify-bot.line.me APIs.
   */
  private origin = 'https://notify-bot.line.me/';

  /**
   * The origin of the notify-api.line.me APIs.
   */
  private apiOrigin = 'https://notify-api.line.me/';

  /**
   * The constructor of LineNotify.
   *
   * @param config - the config object
   * @example
   * ```js
   * const lineNotify = new LineNotify({
   *   clientId: NOTIFY_CLIENT_ID,
   *   clientSecret: NOTIFY_CLIENT_SECRET,
   *   redirectUri: NOTIFY_REDIRECT_URI,
   * });
   * ```
   */
  constructor(config: LineTypes.LineNotifyConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.origin = config.origin ?? this.origin;
    this.apiOrigin = config.apiOrigin ?? this.apiOrigin;
    this.axios = axios.create({
      baseURL: this.origin,
    });
    this.apiAxios = axios.create({
      baseURL: this.apiOrigin,
    });
  }

  /**
   * Get Auth Link
   *
   * Get The OAuth2 authorization endpoint URI.
   *
   * @param state - Assigns a token that can be used for responding to CSRF attacks
   *
   * CSRF attacks are typically countered by assigning a hash value generated from a user's session ID, and then verifying the state parameter variable when it attempts to access redirect_uri.
   *
   * LINE Notify is designed with web applications in mind, and requires state parameter variables.
   * @returns The OAuth2 authorization endpoint URI
   * @example
   * ```js
   * await lineNotify.getAuthLink('state');
   * // 'https://notify-bot.line.me/oauth/authorize?scope=notify&response_type=code&client_id=client-id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=state'
   * ```
   */
  public getAuthLink(state: string): string {
    const data = {
      scope: 'notify',
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
    };

    return `${this.origin}oauth/authorize?${qs.stringify(data)}`;
  }

  /**
   * Get Token
   *
   * The OAuth2 token endpoint.
   *
   * @param code - Assigns a code parameter value generated during redirection
   * @returns An access token for authentication.
   * @example
   * ```js
   * await lineNotify.getToken('<CODE>');
   * // ACCESS_TOKEN
   * ```
   */
  public async getToken(code: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const formData = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
    };
    return this.axios
      .post('/oauth/token', qs.stringify(formData), { headers })
      .then((res) => res.data.access_token, handleError);
  }

  /**
   * Get Status
   *
   * An API for checking connection status. You can use this API to check the validity of an access token. Acquires the names of related users or groups if acquiring them is possible.
   *
   * On the connected service side, it's used to see which groups are configured with a notification and which user the notifications will be sent to. There is no need to check the status with this API before calling /api/notify or /api/revoke.
   *
   * If this API receives a status code 401 when called, the access token will be deactivated on LINE Notify (disabled by the user in most cases). Connected services will also delete the connection information.
   *
   * ## Expected use cases
   * If a connected service wishes to check the connection status of a certain user
   *
   * As LINE Notify also provides the same feature, support for this API is optional.
   *
   * @param accessToken - the accessToken you want to revoke
   * @returns
   * - status: Value according to HTTP status code.
   * - message: Message visible to end-user.
   * - targetType: If the notification target is a user: "USER". If the notification target is a group: "GROUP".
   * - target: If the notification target is a user, displays user name. If acquisition fails, displays "null". If the notification target is a group, displays group name. If the target user has already left the group, displays "null".
   * @example
   * ```js
   * await lineNotify.getStatus('ACCESS_TOKEN');
   * // {
   * //   status: 200,
   * //   message: 'message',
   * //   targetType: 'USER',
   * //   target: 'user name',
   * // }
   * ```
   */
  public async getStatus(accessToken: string): Promise<{
    status: number;
    message: string;
    targetType: 'USER' | 'GROUP';
    target: string;
  }> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return this.apiAxios
      .get('/api/status', { headers })
      .then(throwErrorIfAny, handleError);
  }

  /**
   * Send Notify
   *
   * Sends notifications to users or groups that are related to an access token.
   *
   * If this API receives a status code 401 when called, the access token will be deactivated on LINE Notify (disabled by the user in most cases). Connected services will also delete the connection information.
   *
   * Requests use POST method with application/x-www-form-urlencoded (Identical to the default HTML form transfer type).
   *
   * ## Expected use cases
   * When a connected service has an event that needs to send a notification to LINE
   *
   * @param accessToken - An access token related to users or groups
   * @param message - The notification content
   * @param options - Other optional parameters
   * @returns
   * - status: Value according to HTTP status code
   * - message: Message visible to end-user
   * @example
   * ```js
   * await lineNotify.sendNotify('ACCESS_TOKEN', 'message');
   * ```
   */
  public async sendNotify(
    accessToken: string,
    message: string,
    options: LineTypes.LineNotifyOptions = {}
  ): Promise<{
    status: string;
    message: string;
  }> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${accessToken}`,
    };
    const formData = {
      message,
      ...options,
    };
    return this.apiAxios
      .post('/api/notify', qs.stringify(formData), { headers })
      .then(throwErrorIfAny, handleError);
  }

  /**
   * Revoke Token
   *
   * An API used on the connected service side to revoke notification configurations. Using this API will revoke all used access tokens, disabling the access tokens from accessing the API.
   *
   * The revocation process on the connected service side is as follows
   *
   * 1. Call /api/revoke
   * 2. If step 1 returns status code 200, the request is accepted, revoking all access tokens and ending the process
   * 3. If step 1 returns status code 401, the access tokens have already been revoked and the connection will be d
   * 4. If step 1 returns any other status code, the process will end (you can try again at a later time)
   *
   * ### Expected use cases
   * When the connected service wishes to end a connection with a user
   *
   * As LINE Notify also provides the same feature, support for this API is optional.
   *
   * @param accessToken - the accessToken you want to revoke
   * @returns
   * - status: Value according to HTTP status code
   * - message: Message visible to end-user
   * @example
   * ```js
   * await lineNotify.revokeToken('ACCESS_TOKEN');
   * ```
   */
  public async revokeToken(accessToken: string): Promise<{
    status: string;
    message: string;
  }> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${accessToken}`,
    };
    return this.apiAxios
      .post('/api/revoke', {}, { headers })
      .then(throwErrorIfAny, handleError);
  }
}
